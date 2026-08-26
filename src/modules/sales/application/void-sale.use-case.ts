import type { SaleRepository } from "../domain/sale.repository";
import { SaleDomainError } from "../domain/sale.rules";

export async function voidSaleUseCase(repo: SaleRepository, saleId: string) {
  if (!saleId) {
    throw new SaleDomainError("Venta inválida.");
  }
  return repo.voidSale(saleId);
}
