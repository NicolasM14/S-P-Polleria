"use server";

import { revalidatePath } from "next/cache";

import { adjustStockUseCase } from "../application/adjust-stock.use-case";
import { adjustStockSchema } from "../application/stock.schema";
import { createSupabaseStockRepository } from "../infrastructure/supabase-stock.repository";
import { actionError, type ActionResult } from "@/shared/types/action-result";
import { requireSupabaseUser } from "@/shared/lib/supabase/require-user";

export async function adjustStockAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = adjustStockSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseStockRepository(client);
    const id = await adjustStockUseCase(repo, {
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes,
    });

    revalidatePath("/stock");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo ajustar el stock");
  }
}
