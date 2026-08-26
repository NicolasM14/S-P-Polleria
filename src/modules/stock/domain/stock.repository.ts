import type { SaleUnit, StockBalance, StockMovement } from "./stock";

export interface AdjustStockInput {
  productId: string;
  quantity: number;
  notes: string;
}

export interface SimpleProductOption {
  id: string;
  name: string;
  saleUnit: SaleUnit;
  stock: number;
}

export interface StockRepository {
  listBalances(): Promise<StockBalance[]>;
  listRecentMovements(limit: number): Promise<StockMovement[]>;
  listSimpleProductsForAdjust(): Promise<SimpleProductOption[]>;
  findSimpleProductSaleUnit(productId: string): Promise<SaleUnit | null>;
  adjustStock(input: AdjustStockInput): Promise<string>;
}
