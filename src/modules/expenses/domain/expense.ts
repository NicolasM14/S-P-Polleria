export interface ExpenseCategory {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  categoryId: string | null;
  categoryName: string | null;
  description: string;
  amount: number;
  fromCash: boolean;
  occurredAt: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateExpenseInput {
  categoryId: string;
  amount: number;
  description: string;
  fromCash: boolean;
  occurredAt?: string | null;
}
