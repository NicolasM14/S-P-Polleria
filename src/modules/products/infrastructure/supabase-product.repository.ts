import type { SupabaseClient } from "@supabase/supabase-js";

import type { Product, ProductListFilters, ProductWithComponents } from "../domain/product";
import type {
  CreateProductInput,
  ProductRepository,
  UpdateProductInput,
} from "../domain/product.repository";
import { ProductDomainError } from "../domain/product.rules";
import {
  mapCategoryRow,
  mapComboComponentRow,
  mapProductRow,
  mapProductWithComponents,
} from "./product.mapper";

export function createSupabaseProductRepository(client: SupabaseClient): ProductRepository {
  async function getComponents(comboId: string) {
    const { data, error } = await client
      .from("combo_components")
      .select("id, combo_id, component_id, quantity, products:component_id(name, sale_unit)")
      .eq("combo_id", comboId);
    if (error) throw new ProductDomainError(error.message);
    return (data ?? []).map(mapComboComponentRow);
  }

  return {
    async list(filters: ProductListFilters): Promise<Product[]> {
      let query = client.from("products").select("*").order("name", { ascending: true });

      if (filters.kind && filters.kind !== "all") {
        query = query.eq("kind", filters.kind);
      }
      if (filters.active === "active") {
        query = query.eq("is_active", true);
      } else if (filters.active === "inactive") {
        query = query.eq("is_active", false);
      }
      if (filters.search?.trim()) {
        query = query.ilike("name", `%${filters.search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw new ProductDomainError(error.message);
      return (data ?? []).map(mapProductRow);
    },

    async findById(id: string): Promise<ProductWithComponents | null> {
      const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw new ProductDomainError(error.message);
      if (!data) return null;

      const components = await getComponents(id);
      return mapProductWithComponents(data, components);
    },

    async listCategories() {
      const { data, error } = await client
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new ProductDomainError(error.message);
      return (data ?? []).map(mapCategoryRow);
    },

    async createCategory(name: string, sortOrder = 0) {
      const trimmed = name.trim();
      if (!trimmed) throw new ProductDomainError("El nombre de la categoría es obligatorio.");

      const { data, error } = await client
        .from("categories")
        .insert({ name: trimmed, sort_order: sortOrder })
        .select("*")
        .single();

      if (error) {
        if (error.message.toLowerCase().includes("duplicate") || error.code === "23505") {
          throw new ProductDomainError("Ya existe una categoría con ese nombre.");
        }
        throw new ProductDomainError(error.message);
      }
      return mapCategoryRow(data);
    },

    async applyInitialStock(productId: string, quantity: number) {
      if (quantity <= 0) return;
      const { error } = await client.rpc("adjust_stock", {
        p_product_id: productId,
        p_quantity: quantity,
        p_notes: "Stock inicial al crear producto",
      });
      if (error) throw new ProductDomainError(error.message);
    },

    async listSimpleProducts(activeOnly = true) {
      let query = client
        .from("products")
        .select("*")
        .eq("kind", "simple")
        .order("name", { ascending: true });
      if (activeOnly) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw new ProductDomainError(error.message);
      return (data ?? []).map(mapProductRow);
    },

    async create(input: CreateProductInput): Promise<Product> {
      const { data, error } = await client
        .from("products")
        .insert({
          name: input.name,
          kind: input.kind,
          sale_unit: input.saleUnit,
          price: input.price,
          min_stock: input.minStock,
          category_id: input.categoryId,
          is_active: input.isActive,
          stock: 0,
        })
        .select("*")
        .single();

      if (error) throw new ProductDomainError(error.message);

      if (input.kind === "combo" && input.components?.length) {
        const { error: comboError } = await client.from("combo_components").insert(
          input.components.map((c) => ({
            combo_id: data.id,
            component_id: c.componentId,
            quantity: c.quantity,
          }))
        );
        if (comboError) {
          await client.from("products").delete().eq("id", data.id);
          throw new ProductDomainError(comboError.message);
        }
      }

      return mapProductRow(data);
    },

    async update(input: UpdateProductInput): Promise<Product> {
      const { data, error } = await client
        .from("products")
        .update({
          name: input.name,
          price: input.price,
          min_stock: input.minStock,
          category_id: input.categoryId,
          is_active: input.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select("*")
        .single();

      if (error) throw new ProductDomainError(error.message);

      if (input.components) {
        const { error: delError } = await client
          .from("combo_components")
          .delete()
          .eq("combo_id", input.id);
        if (delError) throw new ProductDomainError(delError.message);

        if (input.components.length > 0) {
          const { error: insError } = await client.from("combo_components").insert(
            input.components.map((c) => ({
              combo_id: input.id,
              component_id: c.componentId,
              quantity: c.quantity,
            }))
          );
          if (insError) throw new ProductDomainError(insError.message);
        }
      }

      return mapProductRow(data);
    },

    async setActive(id: string, isActive: boolean) {
      const { error } = await client
        .from("products")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new ProductDomainError(error.message);
    },

    getComponents,
  };
}
