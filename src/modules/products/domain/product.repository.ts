import type {
  ComboComponent,
  Product,
  ProductKind,
  ProductListFilters,
  ProductWithComponents,
  Category,
  SaleUnit,
} from "./product";

export interface CreateProductInput {
  name: string;
  kind: ProductKind;
  saleUnit: SaleUnit;
  price: number;
  minStock: number;
  categoryId: string | null;
  isActive: boolean;
  components?: Array<{ componentId: string; quantity: number }>;
}

export interface UpdateProductInput {
  id: string;
  name: string;
  price: number;
  minStock: number;
  categoryId: string | null;
  isActive: boolean;
  components?: Array<{ componentId: string; quantity: number }>;
}

export interface ProductRepository {
  list(filters: ProductListFilters): Promise<Product[]>;
  findById(id: string): Promise<ProductWithComponents | null>;
  listCategories(): Promise<Category[]>;
  createCategory(name: string, sortOrder?: number): Promise<Category>;
  applyInitialStock(productId: string, quantity: number): Promise<void>;
  listSimpleProducts(activeOnly?: boolean): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(input: UpdateProductInput): Promise<Product>;
  setActive(id: string, isActive: boolean): Promise<void>;
  getComponents(comboId: string): Promise<ComboComponent[]>;
}
