import type { CreateExpenseInput } from "../domain/expense";
import type { ExpenseRepository } from "../domain/expense.repository";
import {
  assertAmountPositive,
  assertCategoryId,
  assertNotFuture,
  roundMoney,
} from "../domain/expense.rules";

export async function createExpenseUseCase(
  repo: ExpenseRepository,
  input: CreateExpenseInput
) {
  assertCategoryId(input.categoryId);
  assertAmountPositive(input.amount);
  assertNotFuture(input.occurredAt);

  return repo.create({
    categoryId: input.categoryId,
    amount: roundMoney(input.amount),
    description: input.description.trim(),
    fromCash: input.fromCash,
    occurredAt: input.occurredAt ?? null,
  });
}
