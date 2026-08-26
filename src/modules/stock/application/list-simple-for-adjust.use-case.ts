import type { StockRepository } from "../domain/stock.repository";

export async function listSimpleForAdjustUseCase(repo: StockRepository) {
  return repo.listSimpleProductsForAdjust();
}
