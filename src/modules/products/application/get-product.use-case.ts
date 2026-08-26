import type { ProductRepository } from "../domain/product.repository";

export async function getProductUseCase(repo: ProductRepository, id: string) {
  return repo.findById(id);
}
