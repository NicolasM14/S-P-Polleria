import type { ProductRepository, UpdateProductInput } from "../domain/product.repository";
import {
  assertValidMinStock,
  assertValidName,
  assertValidPrice,
  ProductDomainError,
} from "../domain/product.rules";

export async function updateProductUseCase(repo: ProductRepository, input: UpdateProductInput) {
  const existing = await repo.findById(input.id);
  if (!existing) {
    throw new ProductDomainError("Producto no encontrado.");
  }
  if (existing.kind !== "simple") {
    throw new ProductDomainError("Los combos ya no se editan. Desactivá el producto si hace falta.");
  }

  assertValidName(input.name);
  assertValidPrice(input.price);
  assertValidMinStock(input.minStock, existing.saleUnit);

  return repo.update({
    ...input,
    name: input.name.trim(),
    components: [],
  });
}
