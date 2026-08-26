import type { ProductRepository } from "../domain/product.repository";
import { assertValidName } from "../domain/product.rules";

export async function createCategoryUseCase(repo: ProductRepository, name: string) {
  assertValidName(name);
  return repo.createCategory(name.trim());
}
