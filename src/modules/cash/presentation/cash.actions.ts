"use server";

import { revalidatePath } from "next/cache";

import {
  closeCashSessionSchema,
  openCashSessionSchema,
} from "../application/cash.schema";
import { closeCashSessionUseCase } from "../application/close-cash-session.use-case";
import { openCashSessionUseCase } from "../application/open-cash-session.use-case";
import { createSupabaseCashRepository } from "../infrastructure/supabase-cash.repository";
import { requireSupabaseUser } from "@/shared/lib/supabase/require-user";
import { actionError, type ActionResult } from "@/shared/types/action-result";

export async function openCashSessionAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = openCashSessionSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseCashRepository(client);
    const id = await openCashSessionUseCase(repo, {
      openingAmount: parsed.data.openingAmount,
    });

    revalidatePath("/caja");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo abrir la caja");
  }
}

export async function closeCashSessionAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = closeCashSessionSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseCashRepository(client);
    const id = await closeCashSessionUseCase(repo, {
      countedAmount: parsed.data.countedAmount,
      notes: parsed.data.notes,
    });

    revalidatePath("/caja");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo cerrar la caja");
  }
}
