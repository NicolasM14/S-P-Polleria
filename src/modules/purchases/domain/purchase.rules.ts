import { MONEY_EPSILON } from "./purchase";

export class PurchaseDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PurchaseDomainError";
  }
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function assertPaymentsMatchTotal(paymentsSum: number, total: number) {
  if (Math.abs(roundMoney(paymentsSum) - roundMoney(total)) > MONEY_EPSILON) {
    throw new PurchaseDomainError(
      `La suma de pagos (${roundMoney(paymentsSum)}) debe igualar el total (${roundMoney(total)}).`
    );
  }
}

export function assertHasItems(count: number) {
  if (count < 1) {
    throw new PurchaseDomainError("La compra debe tener al menos un ítem.");
  }
}
