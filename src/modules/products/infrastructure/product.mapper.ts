import type {
  Category,
  ComboComponent,
  Product,
  ProductKind,
  ProductWithComponents,
  SaleUnit,
} from "../domain/product";

interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  kind: ProductKind;
  sale_unit: SaleUnit;
  price: number | string;
  stock: number | string;
  min_stock: number | string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ComboComponentRow {
  id: string;
  combo_id: string;
  component_id: string;
  quantity: number | string;
  products?:
    | { name: string; sale_unit: SaleUnit }
    | Array<{ name: string; sale_unit: SaleUnit }>
    | null;
}

interface CategoryRow {
  id: string;
  name: string;
  sort_order: number;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    kind: row.kind,
    saleUnit: row.sale_unit,
    price: toNumber(row.price),
    stock: toNumber(row.stock),
    minStock: toNumber(row.min_stock),
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapComboComponentRow(row: ComboComponentRow): ComboComponent {
  const related = Array.isArray(row.products) ? row.products[0] : row.products;
  return {
    id: row.id,
    comboId: row.combo_id,
    componentId: row.component_id,
    quantity: toNumber(row.quantity),
    componentName: related?.name,
    componentSaleUnit: related?.sale_unit,
  };
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

export function mapProductWithComponents(
  row: ProductRow,
  components: ComboComponent[]
): ProductWithComponents {
  return {
    ...mapProductRow(row),
    components,
  };
}
