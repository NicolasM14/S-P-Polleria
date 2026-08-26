import type { ProductRepository } from "../domain/product.repository";
import { ProductDomainError } from "../domain/product.rules";

export async function setProductActiveUseCase(
  repo: ProductRepository,
  id: string,
  isActive: boolean
) {
  const existing = await repo.findById(id);
  if (!existing) {
    throw new ProductDomainError("Producto no encontrado.");
  }
  await repo.setActive(id, isActive);
}
