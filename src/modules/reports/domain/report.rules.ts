export class ReportDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportDomainError";
  }
}

/** Zona horaria del local (Argentina sin DST desde 2009 → UTC−3 fijo). */
export const BUSINESS_TIMEZONE = "America/Argentina/Buenos_Aires";
const BUSINESS_UTC_OFFSET = "-03:00";

/** Día calendario del negocio YYYY-MM-DD (Argentina, no UTC del servidor). */
export function todayDateString(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Inicio del día de negocio (00:00 ART) como ISO timestamptz UTC. */
export function startOfLocalDayISO(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00${BUSINESS_UTC_OFFSET}`);
  if (Number.isNaN(date.getTime())) {
    throw new ReportDomainError("Fecha desde inválida.");
  }
  return date.toISOString();
}

/** Fin del día de negocio (23:59:59.999 ART) como ISO timestamptz UTC. */
export function endOfLocalDayISO(dateStr: string): string {
  const date = new Date(`${dateStr}T23:59:59.999${BUSINESS_UTC_OFFSET}`);
  if (Number.isNaN(date.getTime())) {
    throw new ReportDomainError("Fecha hasta inválida.");
  }
  return date.toISOString();
}

export function assertValidDateRange(from: string, to: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    throw new ReportDomainError("Rango de fechas inválido.");
  }
  if (from > to) {
    throw new ReportDomainError("La fecha desde no puede ser posterior a hasta.");
  }
}
