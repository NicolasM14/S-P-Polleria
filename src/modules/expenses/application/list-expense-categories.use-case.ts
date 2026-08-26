import type { ExpenseRepository } from "../domain/expense.repository";

export async function listExpenseCategoriesUseCase(repo: ExpenseRepository) {
  return repo.listCategories();
}
