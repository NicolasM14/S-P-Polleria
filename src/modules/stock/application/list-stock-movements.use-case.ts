import { RECENT_MOVEMENTS_LIMIT } from "../domain/stock";
import type { StockRepository } from "../domain/stock.repository";

export async function listStockMovementsUseCase(
  repo: StockRepository,
  limit = RECENT_MOVEMENTS_LIMIT
) {
  return repo.listRecentMovements(limit);
}
