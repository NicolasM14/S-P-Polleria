/** Valor para input numérico controlado: vacío si es 0 (no mostrar "0" al editar). */
export function numberInputValue(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value === 0) {
    return "";
  }
  return String(value);
}

/** Parsea input vacío como 0 (campos opcionales como stock mínimo). */
export function parseOptionalNumber(value: string, fallback = 0): number {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
}
