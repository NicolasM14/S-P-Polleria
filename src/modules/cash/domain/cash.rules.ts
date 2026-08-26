export class CashDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CashDomainError";
  }
}

export function assertOpeningAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new CashDomainError("El monto de apertura debe ser mayor o igual a 0.");
  }
}

export function assertCountedAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new CashDomainError("El efectivo contado debe ser mayor o igual a 0.");
  }
}
