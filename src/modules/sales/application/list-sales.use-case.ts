import type { SaleRepository } from "../domain/sale.repository";

export async function listSalesUseCase(repo: SaleRepository) {
  return repo.list();
}
