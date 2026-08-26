import type { CreateProductInput, ProductRepository } from "../domain/product.repository";
import {
  assertValidMinStock,
  assertValidName,
  assertValidPrice,
  ProductDomainError,
} from "../domain/product.rules";

export interface CreateProductWithStockInput extends CreateProductInput {
  initialStock?: number;
}

export async function createProductUseCase(
  repo: ProductRepository,
  input: CreateProductWithStockInput
) {
  if (input.kind !== "simple") {
    throw new ProductDomainError("Solo se admiten productos simples (sin combos).");
  }

  assertValidName(input.name);
  assertValidPrice(input.price);
  assertValidMinStock(input.minStock, input.saleUnit);

  const initialStock = input.initialStock ?? 0;
  if (initialStock < 0) {
    throw new ProductDomainError("El stock inicial no puede ser negativo.");
  }
  if (input.saleUnit === "unit" && !Number.isInteger(initialStock)) {
    throw new ProductDomainError("Para unidad, el stock inicial debe ser entero.");
  }

  const product = await repo.create({
    ...input,
    kind: "simple",
    name: input.name.trim(),
    components: [],
  });

  if (initialStock > 0) {
    await repo.applyInitialStock(product.id, initialStock);
  }

  return product;
}
