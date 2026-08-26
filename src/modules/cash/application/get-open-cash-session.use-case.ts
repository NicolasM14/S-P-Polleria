import type { CashRepository } from "../domain/cash.repository";

export async function getOpenCashSessionUseCase(repo: CashRepository) {
  return repo.getOpenSessionView();
}
