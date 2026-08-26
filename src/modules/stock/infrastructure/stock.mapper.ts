import type {
  SaleUnit,
  StockBalance,
  StockMovement,
  StockMovementType,
} from "../domain/stock";
import type { SimpleProductOption } from "../domain/stock.repository";

interface ProductBalanceRow {
  id: string;
  name: string;
  sale_unit: SaleUnit;
  stock: number | string;
  min_stock: number | string;
  is_active: boolean;
}

interface StockMovementRow {
  id: string;
  product_id: string;
  quantity: number | string;
  type: StockMovementType;
  stock_after: number | string;
  notes: string | null;
  sale_id: string | null;
  purchase_id: string | null;
  created_at: string;
  products:
    | { name: string; sale_unit: SaleUnit }
    | Array<{ name: string; sale_unit: SaleUnit }>
    | null;
}

interface SimpleProductRow {
  id: string;
  name: string;
  sale_unit: SaleUnit;
  stock: number | string;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapStockBalanceRow(row: ProductBalanceRow): StockBalance {
  return {
    id: row.id,
    name: row.name,
    saleUnit: row.sale_unit,
    stock: toNumber(row.stock),
    minStock: toNumber(row.min_stock),
    isActive: row.is_active,
  };
}

export function mapStockMovementRow(row: StockMovementRow): StockMovement {
  const related = Array.isArray(row.products) ? row.products[0] : row.products;
  return {
    id: row.id,
    productId: row.product_id,
    productName: related?.name ?? "Producto",
    saleUnit: related?.sale_unit ?? "unit",
    quantity: toNumber(row.quantity),
    type: row.type,
    stockAfter: toNumber(row.stock_after),
    notes: row.notes,
    saleId: row.sale_id,
    purchaseId: row.purchase_id,
    createdAt: row.created_at,
  };
}

export function mapSimpleProductOption(row: SimpleProductRow): SimpleProductOption {
  return {
    id: row.id,
    name: row.name,
    saleUnit: row.sale_unit,
    stock: toNumber(row.stock),
  };
}
