"use server";

import { revalidatePath } from "next/cache";

import { createSaleUseCase } from "../application/create-sale.use-case";
import { createSaleSchema, voidSaleSchema } from "../application/sale.schema";
import { voidSaleUseCase } from "../application/void-sale.use-case";
import { createSupabaseSaleRepository } from "../infrastructure/supabase-sale.repository";
import { requireSupabaseUser } from "@/shared/lib/supabase/require-user";
import { actionError, type ActionResult } from "@/shared/types/action-result";

export async function createSaleAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createSaleSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseSaleRepository(client);
    const soldAt =
      parsed.data.soldAt && parsed.data.soldAt.trim()
        ? new Date(parsed.data.soldAt).toISOString()
        : null;

    const id = await createSaleUseCase(repo, {
      items: parsed.data.items,
      payments: parsed.data.payments,
      discount: parsed.data.discount,
      notes: parsed.data.notes ?? null,
      soldAt,
    });

    revalidatePath("/ventas");
    revalidatePath("/stock");
    revalidatePath("/caja");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo registrar la venta");
  }
}

export async function voidSaleAction(raw: unknown): Promise<ActionResult> {
  try {
    const parsed = voidSaleSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseSaleRepository(client);
    await voidSaleUseCase(repo, parsed.data.saleId);

    revalidatePath("/ventas");
    revalidatePath("/stock");
    revalidatePath("/caja");
    return { success: true };
  } catch (error) {
    return actionError(error, "No se pudo anular la venta");
  }
}
