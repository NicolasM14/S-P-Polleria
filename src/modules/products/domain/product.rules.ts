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

export function assertComboComponents(
  kind: ProductKind,
  components: Array<{ componentId: string; quantity: number }> | undefined,
  componentMeta: Map<string, { kind: ProductKind; saleUnit: SaleUnit }>
) {
  if (kind === "simple") {
    if (components && components.length > 0) {
      throw new ProductDomainError("Un producto simple no puede tener componentes.");
    }
    return;
  }

  if (!components || components.length === 0) {
    throw new ProductDomainError("Un combo necesita al menos un componente.");
  }

  const seen = new Set<string>();
  for (const row of components) {
    if (seen.has(row.componentId)) {
      throw new ProductDomainError("No se puede repetir el mismo componente en el combo.");
    }
    seen.add(row.componentId);

    const meta = componentMeta.get(row.componentId);
    if (!meta) {
      throw new ProductDomainError("Componente de combo no encontrado.");
    }
    if (meta.kind !== "simple") {
      throw new ProductDomainError("Los componentes del combo deben ser productos simples (profundidad 1).");
    }
    if (!Number.isFinite(row.quantity) || row.quantity <= 0) {
      throw new ProductDomainError("La cantidad de cada componente debe ser mayor a 0.");
    }
    if (meta.saleUnit === "unit" && !Number.isInteger(row.quantity)) {
      throw new ProductDomainError("Cantidad por unidad debe ser entera.");
    }
    if (meta.saleUnit === "kg") {
      const factor = 10 ** MAX_DECIMALS_KG;
      const scaled = Math.round(row.quantity * factor);
      if (Math.abs(row.quantity * factor - scaled) > 1e-8) {
        throw new ProductDomainError(`Kg admite como máximo ${MAX_DECIMALS_KG} decimales.`);
      }
    }
  }
}
