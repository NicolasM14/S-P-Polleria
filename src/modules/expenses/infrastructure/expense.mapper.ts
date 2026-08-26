import type { Expense, ExpenseCategory } from "../domain/expense";

interface ExpenseCategoryRow {
  id: string;
  name: string;
}

interface ExpenseRow {
  id: string;
  category_id: string | null;
  description: string;
  amount: number | string;
  from_cash: boolean;
  occurred_at: string;
  created_by: string;
  created_at: string;
  expense_categories?:
    | { name: string }
    | Array<{ name: string }>
    | null;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapExpenseCategoryRow(row: ExpenseCategoryRow): ExpenseCategory {
  return {
    id: row.id,
    name: row.name,
  };
}

export function mapExpenseRow(row: ExpenseRow): Expense {
  const related = Array.isArray(row.expense_categories)
    ? row.expense_categories[0]
    : row.expense_categories;

  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: related?.name ?? null,
    description: row.description,
    amount: toNumber(row.amount),
    fromCash: row.from_cash,
    occurredAt: row.occurred_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
