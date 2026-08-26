import type { ProductListFilters } from "../domain/product";
import type { ProductRepository } from "../domain/product.repository";

export async function listProductsUseCase(
  repo: ProductRepository,
  filters: ProductListFilters = {}
) {
  return repo.list(filters);
}
