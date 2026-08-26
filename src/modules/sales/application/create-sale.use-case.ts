import type { CreateSaleInput } from "../domain/sale";
import type { SaleRepository } from "../domain/sale.repository";
import {
  assertHasItems,
  assertPaymentsMatchTotal,
  assertValidDiscount,
  roundMoney,
} from "../domain/sale.rules";

export async function createSaleUseCase(repo: SaleRepository, input: CreateSaleInput) {
  assertHasItems(input.items.length);

  const discount = input.discount ?? 0;
  const subtotal = roundMoney(
    input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  );
  assertValidDiscount(discount, subtotal);

  const total = roundMoney(subtotal - discount);
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
    discount: roundMoney(discount),
    notes: input.notes?.trim() || null,
    soldAt: input.soldAt ?? null,
  });
}
