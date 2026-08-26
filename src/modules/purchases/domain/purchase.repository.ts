import type {
  CreatePurchaseInput,
  Purchase,
  PurchaseWithDetails,
} from "./purchase";

export interface PurchaseRepository {
  list(): Promise<Purchase[]>;
  findById(id: string): Promise<PurchaseWithDetails | null>;
  create(input: CreatePurchaseInput): Promise<string>;
}
