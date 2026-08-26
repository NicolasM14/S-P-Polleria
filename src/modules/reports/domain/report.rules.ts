export class ReportDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportDomainError";
  }
}

/** Local calendar date YYYY-MM-DD */
export function todayDateString(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Start of local day as ISO timestamptz */
export function startOfLocalDayISO(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new ReportDomainError("Fecha desde inválida.");
  }
  return date.toISOString();
}

/** End of local day as ISO timestamptz */
export function endOfLocalDayISO(dateStr: string): string {
  const date = new Date(`${dateStr}T23:59:59.999`);
  if (Number.isNaN(date.getTime())) {
    throw new ReportDomainError("Fecha hasta inválida.");
  }
  return date.toISOString();
}

export function assertValidDateRange(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new ReportDomainError("Rango de fechas inválido.");
  }
  if (fromDate.getTime() > toDate.getTime()) {
    throw new ReportDomainError("La fecha desde no puede ser posterior a hasta.");
  }
}
