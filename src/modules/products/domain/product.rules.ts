import type { ProductKind, SaleUnit } from "./product";
import { MAX_DECIMALS_KG } from "./product";

export class ProductDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductDomainError";
  }
}

export function assertValidPrice(price: number) {
  if (!Number.isFinite(price) || price < 0) {
    throw new ProductDomainError("El precio debe ser mayor o igual a 0.");
  }
}

export function assertValidMinStock(minStock: number, saleUnit: SaleUnit) {
  if (!Number.isFinite(minStock) || minStock < 0) {
    throw new ProductDomainError("El stock mínimo debe ser mayor o igual a 0.");
  }
  if (saleUnit === "unit" && !Number.isInteger(minStock)) {
    throw new ProductDomainError("Para productos por unidad, el stock mínimo debe ser entero.");
  }
}

export function assertValidName(name: string) {
  if (!name.trim()) {
    throw new ProductDomainError("El nombre es obligatorio.");
  }
}

export function assertSimpleProduct(kind: ProductKind) {
  if (kind !== "simple") {
    throw new ProductDomainError("Solo se admiten productos simples (sin combos).");
  }
}

export function assertKgPrecision(quantity: number) {
  const factor = 10 ** MAX_DECIMALS_KG;
  const scaled = Math.round(quantity * factor);
  if (Math.abs(quantity * factor - scaled) > 1e-8) {
    throw new ProductDomainError(`Kg admite como máximo ${MAX_DECIMALS_KG} decimales.`);
  }
}
