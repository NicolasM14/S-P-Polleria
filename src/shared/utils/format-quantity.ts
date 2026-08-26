function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function formatQuantity(value: number, saleUnit: "kg" | "unit") {
  if (saleUnit === "unit") {
    return new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(toNumber(value));
}
