import type {
  PaymentMethod,
  StoredPaymentMethod,
} from "@/shared/constants/payment-methods";

export interface Purchase {
  id: string;
  purchasedAt: string;
  notes: string | null;
  total: number;
  createdBy: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  saleUnit: "kg" | "unit";
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchasePayment {
  id: string;
  purchaseId: string;
  method: StoredPaymentMethod;
  amount: number;
}

export interface PurchaseWithDetails extends Purchase {
  items: PurchaseItem[];
  payments: PurchasePayment[];
}

export interface CreatePurchaseItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchasePaymentInput {
  method: PaymentMethod;
  amount: number;
}

export interface CreatePurchaseInput {
  items: CreatePurchaseItemInput[];
  payments: CreatePurchasePaymentInput[];
  notes?: string | null;
  purchasedAt?: string | null;
}

export const MONEY_EPSILON = 0.01;
