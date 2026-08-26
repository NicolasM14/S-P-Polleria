import { formatGramsFromKg } from "@/shared/utils/weight";

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

/**
 * Formatea cantidades para UI.
 * Productos en kg se muestran en **gramos** (como la balanza).
 */
export function formatQuantity(value: number, saleUnit: "kg" | "unit") {
  if (saleUnit === "unit") {
    return new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 0,
    }).format(toNumber(value));
  }
  return formatGramsFromKg(value);
}
