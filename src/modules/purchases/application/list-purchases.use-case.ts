import type { PurchaseRepository } from "../domain/purchase.repository";

export async function listPurchasesUseCase(repo: PurchaseRepository) {
  return repo.list();
}
