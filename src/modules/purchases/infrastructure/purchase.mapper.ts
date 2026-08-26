import type { StoredPaymentMethod } from "@/shared/constants/payment-methods";

import type {
  Purchase,
  PurchaseItem,
  PurchasePayment,
  PurchaseWithDetails,
} from "../domain/purchase";

interface PurchaseRow {
  id: string;
  purchased_at: string;
  notes: string | null;
  total: number | string;
  created_by: string;
  created_at: string;
}

interface PurchaseItemRow {
  id: string;
  purchase_id: string;
  product_id: string;
  product_name: string;
  sale_unit: "kg" | "unit";
  quantity: number | string;
  unit_cost: number | string;
  line_total: number | string;
}

interface PurchasePaymentRow {
  id: string;
  purchase_id: string;
  method: StoredPaymentMethod;
  amount: number | string;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapPurchaseRow(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    purchasedAt: row.purchased_at,
    notes: row.notes,
    total: toNumber(row.total),
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapPurchaseItemRow(row: PurchaseItemRow): PurchaseItem {
  return {
    id: row.id,
    purchaseId: row.purchase_id,
    productId: row.product_id,
    productName: row.product_name,
    saleUnit: row.sale_unit,
    quantity: toNumber(row.quantity),
    unitCost: toNumber(row.unit_cost),
    lineTotal: toNumber(row.line_total),
  };
}

export function mapPurchasePaymentRow(row: PurchasePaymentRow): PurchasePayment {
  return {
    id: row.id,
    purchaseId: row.purchase_id,
    method: row.method,
    amount: toNumber(row.amount),
  };
}

export function mapPurchaseWithDetails(
  row: PurchaseRow,
  items: PurchaseItem[],
  payments: PurchasePayment[]
): PurchaseWithDetails {
  return {
    ...mapPurchaseRow(row),
    items,
    payments,
  };
}
