import type { AdjustStockInput, StockRepository } from "../domain/stock.repository";
import {
  assertAdjustNotes,
  assertAdjustQuantity,
  StockDomainError,
} from "../domain/stock.rules";

export async function adjustStockUseCase(repo: StockRepository, input: AdjustStockInput) {
  assertAdjustNotes(input.notes);

  const saleUnit = await repo.findSimpleProductSaleUnit(input.productId);
  if (!saleUnit) {
    throw new StockDomainError("Producto simple no encontrado o inactivo.");
  }

  assertAdjustQuantity(input.quantity, saleUnit);

  return repo.adjustStock({
    productId: input.productId,
    quantity: input.quantity,
    notes: input.notes.trim(),
  });
}
