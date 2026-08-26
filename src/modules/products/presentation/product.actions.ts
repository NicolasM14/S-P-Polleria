"use server";

import { revalidatePath } from "next/cache";

import { createCategoryUseCase } from "../application/create-category.use-case";
import { createProductUseCase } from "../application/create-product.use-case";
import {
  createCategorySchema,
  createProductSchema,
  setProductActiveSchema,
  updateProductSchema,
} from "../application/product.schema";
import { setProductActiveUseCase } from "../application/set-product-active.use-case";
import { updateProductUseCase } from "../application/update-product.use-case";
import { ProductDomainError } from "../domain/product.rules";
import { createSupabaseProductRepository } from "../infrastructure/supabase-product.repository";
import { createClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/types/action-result";
import { actionError } from "@/shared/types/action-result";

async function getRepo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new ProductDomainError("No autenticado.");
  }
  return createSupabaseProductRepository(supabase);
}

export async function createProductAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createProductSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const repo = await getRepo();
    const product = await createProductUseCase(repo, {
      name: parsed.data.name,
      kind: parsed.data.kind,
      saleUnit: parsed.data.saleUnit,
      price: parsed.data.price,
      minStock: parsed.data.minStock,
      initialStock: parsed.data.initialStock,
      categoryId: parsed.data.categoryId ?? null,
      isActive: parsed.data.isActive,
      components: parsed.data.components,
    });

    revalidatePath("/productos");
    revalidatePath("/stock");
    return { success: true, data: { id: product.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo crear el producto",
    };
  }
}

export async function updateProductAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = updateProductSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const repo = await getRepo();
    await updateProductUseCase(repo, {
      id: parsed.data.id,
      name: parsed.data.name,
      price: parsed.data.price,
      minStock: parsed.data.minStock,
      categoryId: parsed.data.categoryId ?? null,
      isActive: parsed.data.isActive,
      components: parsed.data.components,
    });

    revalidatePath("/productos");
    revalidatePath(`/productos/${parsed.data.id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar el producto",
    };
  }
}

export async function setProductActiveAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = setProductActiveSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const repo = await getRepo();
    await setProductActiveUseCase(repo, parsed.data.id, parsed.data.isActive);
    revalidatePath("/productos");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo cambiar el estado",
    };
  }
}

export async function createCategoryAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createCategorySchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const repo = await getRepo();
    const category = await createCategoryUseCase(repo, parsed.data.name);
    revalidatePath("/productos");
    revalidatePath("/productos/nuevo");
    return { success: true, data: { id: category.id } };
  } catch (error) {
    return actionError(error, "No se pudo crear la categoría");
  }
}
