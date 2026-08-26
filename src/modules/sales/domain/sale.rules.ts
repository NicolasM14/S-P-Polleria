import { MONEY_EPSILON } from "./sale";

export class SaleDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SaleDomainError";
  }
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function assertHasItems(count: number) {
  if (count < 1) {
    throw new SaleDomainError("La venta debe tener al menos un ítem.");
  }
}

export function assertValidDiscount(discount: number, subtotal: number) {
  if (!Number.isFinite(discount) || discount < 0) {
    throw new SaleDomainError("El descuento debe ser ≥ 0.");
  }
  if (discount > subtotal) {
    throw new SaleDomainError("El descuento no puede superar el subtotal.");
  }
}

export function assertPaymentsMatchTotal(paymentsSum: number, total: number) {
  if (Math.abs(roundMoney(paymentsSum) - roundMoney(total)) > MONEY_EPSILON) {
    throw new SaleDomainError(
      `La suma de pagos (${roundMoney(paymentsSum)}) debe igualar el total (${roundMoney(total)}).`
    );
  }
}
