import type { ProductRepository } from "../domain/product.repository";

export async function listCategoriesUseCase(repo: ProductRepository) {
  return repo.listCategories();
}

export async function listSimpleProductsUseCase(repo: ProductRepository) {
  return repo.listSimpleProducts(true);
}
