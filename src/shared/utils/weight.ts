function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

/** La balanza muestra gramos; en DB el stock se guarda en kg. */
export function gramsToKg(grams: number): number {
  return toNumber(grams) / 1000;
}

export function kgToGrams(kg: number): number {
  return Math.round(toNumber(kg) * 1000);
}

/** Formatea un valor guardado en kg como gramos enteros (es-AR). */
export function formatGramsFromKg(kg: number): string {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(kgToGrams(kg));
}
