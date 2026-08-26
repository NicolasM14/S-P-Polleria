import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateExpenseInput, Expense, ExpenseCategory } from "../domain/expense";
import type { ExpenseRepository } from "../domain/expense.repository";
import { ExpenseDomainError } from "../domain/expense.rules";
import { mapExpenseCategoryRow, mapExpenseRow } from "./expense.mapper";

export function createSupabaseExpenseRepository(client: SupabaseClient): ExpenseRepository {
  return {
    async list(): Promise<Expense[]> {
      const { data, error } = await client
        .from("expenses")
        .select(
          "id, category_id, description, amount, from_cash, occurred_at, created_by, created_at, expense_categories(name)"
        )
        .order("occurred_at", { ascending: false })
        .limit(100);

      if (error) throw new ExpenseDomainError(error.message);
      return (data ?? []).map(mapExpenseRow);
    },

    async listCategories(): Promise<ExpenseCategory[]> {
      const { data, error } = await client
        .from("expense_categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw new ExpenseDomainError(error.message);
      return (data ?? []).map(mapExpenseCategoryRow);
    },

    async create(input: CreateExpenseInput): Promise<string> {
      const { data, error } = await client.rpc("create_expense", {
        p_category_id: input.categoryId,
        p_amount: input.amount,
        p_description: input.description,
        p_from_cash: input.fromCash,
        p_occurred_at: input.occurredAt ?? new Date().toISOString(),
      });

      if (error) throw new ExpenseDomainError(error.message);
      if (!data) throw new ExpenseDomainError("No se recibió el id del gasto.");
      return data as string;
    },
  };
}
