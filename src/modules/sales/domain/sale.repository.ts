import type { CreateSaleInput, Sale, SaleWithDetails } from "./sale";

export interface SaleRepository {
  list(): Promise<Sale[]>;
  findById(id: string): Promise<SaleWithDetails | null>;
  create(input: CreateSaleInput): Promise<string>;
  voidSale(saleId: string): Promise<string>;
}
