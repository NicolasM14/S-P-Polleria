import type { StockRepository } from "../domain/stock.repository";

export async function listStockUseCase(repo: StockRepository) {
  return repo.listBalances();
}
