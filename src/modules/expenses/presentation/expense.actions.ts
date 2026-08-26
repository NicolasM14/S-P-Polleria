"use server";

import { revalidatePath } from "next/cache";

import { createExpenseUseCase } from "../application/create-expense.use-case";
import { createExpenseSchema } from "../application/expense.schema";
import { createSupabaseExpenseRepository } from "../infrastructure/supabase-expense.repository";
import { requireSupabaseUser } from "@/shared/lib/supabase/require-user";
import { actionError, type ActionResult } from "@/shared/types/action-result";

export async function createExpenseAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createExpenseSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" };
    }

    const { client } = await requireSupabaseUser();
    const repo = createSupabaseExpenseRepository(client);
    const occurredAt =
      parsed.data.occurredAt && parsed.data.occurredAt.trim()
        ? new Date(parsed.data.occurredAt).toISOString()
        : null;

    const id = await createExpenseUseCase(repo, {
      categoryId: parsed.data.categoryId,
      amount: parsed.data.amount,
      description: parsed.data.description,
      fromCash: parsed.data.fromCash,
      occurredAt,
    });

    revalidatePath("/gastos");
    revalidatePath("/caja");
    revalidatePath("/reportes");
    revalidatePath("/dashboard");
    return { success: true, data: { id } };
  } catch (error) {
    return actionError(error, "No se pudo registrar el gasto");
  }
}
