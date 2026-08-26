"use server";

import { revalidatePath } from "next/cache";

import { createPurchaseUseCase } from "../application/create-purchase.use-case";
import { createPurchaseSchema } from "../application/purchase.schema";
import { createSupabasePurchaseRepository } from "../infrastructure/supabase-purchase.repository";
import { requireSupabaseUser } from "@/shared/lib/supabase/require-user";
import { actionError, type ActionResult } from "@/shared/types/action-result";

export async function createPurchaseAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createPurchaseSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabasePurchaseRepository(client);
    const purchasedAt =
      parsed.data.purchasedAt && parsed.data.purchasedAt.trim()
        ? new Date(parsed.data.purchasedAt).toISOString()
        : null;

    const id = await createPurchaseUseCase(repo, {
      items: parsed.data.items,
      payments: parsed.data.payments,
      notes: parsed.data.notes ?? null,
      purchasedAt,
    });

    revalidatePath("/compras");
    revalidatePath("/stock");
    revalidatePath("/caja");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo registrar la compra");
  }
}
