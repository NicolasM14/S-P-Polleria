import type { LowStockProduct, PeriodTotals } from "../domain/report";

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function sumTotals(
  rows: Array<{ total?: number | string; amount?: number | string }>
): PeriodTotals {
  const total = rows.reduce((sum, row) => {
    const value = row.total ?? row.amount ?? 0;
    return sum + toNumber(value);
  }, 0);
  return {
    count: rows.length,
    total: Math.round(total * 100) / 100,
  };
}

interface ProductStockRow {
  id: string;
  name: string;
  stock: number | string;
  min_stock: number | string;
  sale_unit: "kg" | "unit";
}

export function mapLowStockProduct(row: ProductStockRow): LowStockProduct {
  return {
    id: row.id,
    name: row.name,
    stock: toNumber(row.stock),
    minStock: toNumber(row.min_stock),
    saleUnit: row.sale_unit,
  };
}
