import type { CashRepository, CloseCashSessionInput } from "../domain/cash.repository";
import { assertCountedAmount } from "../domain/cash.rules";

export async function closeCashSessionUseCase(
  repo: CashRepository,
  input: CloseCashSessionInput
) {
  assertCountedAmount(input.countedAmount);
  return repo.closeSession({
    countedAmount: input.countedAmount,
    notes: input.notes,
  });
}
