export class ExpenseDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpenseDomainError";
  }
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function assertAmountPositive(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ExpenseDomainError("El monto debe ser mayor a 0.");
  }
}

export function assertCategoryId(categoryId: string) {
  if (!categoryId?.trim()) {
    throw new ExpenseDomainError("La categoría es obligatoria.");
  }
}

export function assertNotFuture(occurredAt: string | null | undefined) {
  if (occurredAt == null || occurredAt.trim() === "") return;
  const date = new Date(occurredAt);
  if (Number.isNaN(date.getTime())) {
    throw new ExpenseDomainError("Fecha inválida.");
  }
  if (date.getTime() > Date.now() + 60_000) {
    throw new ExpenseDomainError("La fecha no puede ser futura.");
  }
}
