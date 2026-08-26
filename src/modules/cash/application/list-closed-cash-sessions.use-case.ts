import { CLOSED_SESSIONS_LIMIT } from "../domain/cash";
import type { CashRepository } from "../domain/cash.repository";

export async function listClosedCashSessionsUseCase(
  repo: CashRepository,
  limit = CLOSED_SESSIONS_LIMIT
) {
  return repo.listClosedSessions(limit);
}
