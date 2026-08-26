import type { CreateExpenseInput, Expense, ExpenseCategory } from "./expense";

export interface ExpenseRepository {
  list(): Promise<Expense[]>;
  listCategories(): Promise<ExpenseCategory[]>;
  create(input: CreateExpenseInput): Promise<string>;
}
