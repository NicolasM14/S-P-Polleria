import type {
  PaymentMethod,
  StoredPaymentMethod,
} from "@/shared/constants/payment-methods";

export type SaleStatus = "completed" | "voided";

export interface Sale {
  id: string;
  soldAt: string;
  status: SaleStatus;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  createdBy: string;
  voidedAt: string | null;
  voidedBy: string | null;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  productKind: "simple" | "combo";
  saleUnit: "kg" | "unit";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SalePayment {
  id: string;
  saleId: string;
  method: StoredPaymentMethod;
  amount: number;
}

export interface SaleWithDetails extends Sale {
  items: SaleItem[];
  payments: SalePayment[];
}

export interface CreateSaleItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalePaymentInput {
  method: PaymentMethod;
  amount: number;
}

export interface CreateSaleInput {
  items: CreateSaleItemInput[];
  payments: CreateSalePaymentInput[];
  discount?: number;
  notes?: string | null;
  soldAt?: string | null;
}

export const MONEY_EPSILON = 0.01;
