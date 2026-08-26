export type ProductKind = "simple" | "combo";
export type SaleUnit = "kg" | "unit";

export interface Product {
  id: string;
  categoryId: string | null;
  name: string;
  kind: ProductKind;
  saleUnit: SaleUnit;
  price: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComboComponent {
  id: string;
  comboId: string;
  componentId: string;
  quantity: number;
  componentName?: string;
  componentSaleUnit?: SaleUnit;
}

export interface ProductWithComponents extends Product {
  components: ComboComponent[];
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ProductListFilters {
  search?: string;
  kind?: ProductKind | "all";
  active?: "all" | "active" | "inactive";
}

export const MAX_DECIMALS_KG = 3;
