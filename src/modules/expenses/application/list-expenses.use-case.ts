import type { ExpenseRepository } from "../domain/expense.repository";

export async function listExpensesUseCase(repo: ExpenseRepository) {
  return repo.list();
}
