import type { SupabaseClient } from "@supabase/supabase-js";

import type { SaleUnit, StockBalance, StockMovement } from "../domain/stock";
import type {
  AdjustStockInput,
  SimpleProductOption,
  StockRepository,
} from "../domain/stock.repository";
import { StockDomainError } from "../domain/stock.rules";
import {
  mapSimpleProductOption,
  mapStockBalanceRow,
  mapStockMovementRow,
} from "./stock.mapper";
import { mapSupabaseBusinessError } from "@/shared/lib/supabase/map-business-error";

export function createSupabaseStockRepository(client: SupabaseClient): StockRepository {
  return {
    async listBalances(): Promise<StockBalance[]> {
      const { data, error } = await client
        .from("products")
        .select("id, name, sale_unit, stock, min_stock, is_active")
        .eq("kind", "simple")
        .order("name", { ascending: true });

      if (error) throw new StockDomainError(error.message);
      return (data ?? []).map(mapStockBalanceRow);
    },

    async listRecentMovements(limit: number): Promise<StockMovement[]> {
      const { data, error } = await client
        .from("stock_movements")
        .select(
          "id, product_id, quantity, type, stock_after, notes, sale_id, purchase_id, created_at, products:product_id(name, sale_unit)"
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw new StockDomainError(error.message);
      return (data ?? []).map(mapStockMovementRow);
    },

    async listSimpleProductsForAdjust(): Promise<SimpleProductOption[]> {
      const { data, error } = await client
        .from("products")
        .select("id, name, sale_unit, stock")
        .eq("kind", "simple")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw new StockDomainError(error.message);
      return (data ?? []).map(mapSimpleProductOption);
    },

    async findSimpleProductSaleUnit(productId: string): Promise<SaleUnit | null> {
      const { data, error } = await client
        .from("products")
        .select("sale_unit, kind, is_active")
        .eq("id", productId)
        .maybeSingle();

      if (error) throw new StockDomainError(error.message);
      if (!data || data.kind !== "simple" || !data.is_active) return null;
      return data.sale_unit as SaleUnit;
    },

    async adjustStock(input: AdjustStockInput): Promise<string> {
      const { data, error } = await client.rpc("adjust_stock", {
        p_product_id: input.productId,
        p_quantity: input.quantity,
        p_notes: input.notes,
      });

      if (error) throw new StockDomainError(mapSupabaseBusinessError(error.message));
      return data as string;
    },
  };
}
