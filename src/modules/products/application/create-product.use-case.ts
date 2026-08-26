import type { CreateProductInput, ProductRepository } from "../domain/product.repository";
import {
  assertComboComponents,
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
  assertValidName(input.name);
  assertValidPrice(input.price);
  assertValidMinStock(input.minStock, input.saleUnit);

  const initialStock = input.initialStock ?? 0;
  if (initialStock < 0) {
    throw new ProductDomainError("El stock inicial no puede ser negativo.");
  }
  if (input.kind === "combo" && initialStock > 0) {
    throw new ProductDomainError("Los combos no tienen stock propio.");
  }
  if (input.saleUnit === "unit" && !Number.isInteger(initialStock)) {
    throw new ProductDomainError("Para unidad, el stock inicial debe ser entero.");
  }

  if (input.kind === "combo") {
    input = { ...input, minStock: input.minStock ?? 0 };
  }

  const simples = await repo.listSimpleProducts(false);
  const meta = new Map(
    simples.map((p) => [p.id, { kind: p.kind, saleUnit: p.saleUnit }] as const)
  );

  assertComboComponents(input.kind, input.components, meta);

  const product = await repo.create({
    ...input,
    name: input.name.trim(),
    components: input.kind === "combo" ? input.components : [],
  });

  if (input.kind === "simple" && initialStock > 0) {
    await repo.applyInitialStock(product.id, initialStock);
  }

  return product;
}
