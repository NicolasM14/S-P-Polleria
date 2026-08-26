import { MAX_DECIMALS_KG, type SaleUnit } from "./stock";

export class StockDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockDomainError";
  }
}

export function assertAdjustQuantity(quantity: number, saleUnit: SaleUnit) {
  if (!Number.isFinite(quantity) || quantity === 0) {
    throw new StockDomainError("La cantidad no puede ser 0.");
  }
  if (saleUnit === "unit" && !Number.isInteger(quantity)) {
    throw new StockDomainError("Para productos por unidad, la cantidad debe ser entera.");
  }
  if (saleUnit === "kg") {
    const factor = 10 ** MAX_DECIMALS_KG;
    const scaled = Math.round(quantity * factor);
    if (Math.abs(quantity * factor - scaled) > 1e-8) {
      throw new StockDomainError(`Kg admite como máximo ${MAX_DECIMALS_KG} decimales.`);
    }
  }
}

export function assertAdjustNotes(notes: string) {
  if (!notes.trim()) {
    throw new StockDomainError("El motivo del ajuste es obligatorio.");
  }
}

export function isLowStock(stock: number, minStock: number) {
  return stock <= minStock;
}
