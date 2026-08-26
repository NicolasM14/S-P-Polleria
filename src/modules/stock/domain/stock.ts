export type SaleUnit = "kg" | "unit";

export type StockMovementType = "purchase" | "sale" | "sale_void" | "adjustment";

export interface StockBalance {
  id: string;
  name: string;
  saleUnit: SaleUnit;
  stock: number;
  minStock: number;
  isActive: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  saleUnit: SaleUnit;
  quantity: number;
  type: StockMovementType;
  stockAfter: number;
  notes: string | null;
  saleId: string | null;
  purchaseId: string | null;
  createdAt: string;
}

export const STOCK_MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  purchase: "Compra",
  sale: "Venta",
  sale_void: "Anulación",
  adjustment: "Ajuste",
};

export const MAX_DECIMALS_KG = 3;
export const RECENT_MOVEMENTS_LIMIT = 50;
