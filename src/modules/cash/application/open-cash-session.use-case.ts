import type { CashRepository, OpenCashSessionInput } from "../domain/cash.repository";
import { assertOpeningAmount } from "../domain/cash.rules";

export async function openCashSessionUseCase(
  repo: CashRepository,
  input: OpenCashSessionInput
) {
  assertOpeningAmount(input.openingAmount);
  return repo.openSession(input);
}
