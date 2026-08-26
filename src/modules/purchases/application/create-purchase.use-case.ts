import type { CreatePurchaseInput } from "../domain/purchase";
import type { PurchaseRepository } from "../domain/purchase.repository";
import {
  assertHasItems,
  assertPaymentsMatchTotal,
  roundMoney,
} from "../domain/purchase.rules";

export async function createPurchaseUseCase(
  repo: PurchaseRepository,
  input: CreatePurchaseInput
) {
  assertHasItems(input.items.length);

  const total = roundMoney(
    input.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
  );
  const paymentsSum = roundMoney(
    input.payments.reduce((sum, payment) => sum + payment.amount, 0)
  );
  assertPaymentsMatchTotal(paymentsSum, total);

  return repo.create({
    items: input.items,
    payments: input.payments.map((p) => ({
      ...p,
      amount: roundMoney(p.amount),
    })),
    notes: input.notes?.trim() || null,
    purchasedAt: input.purchasedAt ?? null,
  });
}
