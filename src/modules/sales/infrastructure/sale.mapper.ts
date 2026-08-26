import type { PaymentMethod } from "@/shared/constants/payment-methods";

import type {
  Sale,
  SaleItem,
  SalePayment,
  SaleStatus,
  SaleWithDetails,
} from "../domain/sale";

interface SaleRow {
  id: string;
  sold_at: string;
  status: SaleStatus;
  subtotal: number | string;
  discount: number | string;
  total: number | string;
  notes: string | null;
  created_by: string;
  voided_at: string | null;
  voided_by: string | null;
  created_at: string;
}

interface SaleItemRow {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_kind: "simple" | "combo";
  sale_unit: "kg" | "unit";
  quantity: number | string;
  unit_price: number | string;
  line_total: number | string;
}

interface SalePaymentRow {
  id: string;
  sale_id: string;
  method: PaymentMethod;
  amount: number | string;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapSaleRow(row: SaleRow): Sale {
  return {
    id: row.id,
    soldAt: row.sold_at,
    status: row.status,
    subtotal: toNumber(row.subtotal),
    discount: toNumber(row.discount),
    total: toNumber(row.total),
    notes: row.notes,
    createdBy: row.created_by,
    voidedAt: row.voided_at,
    voidedBy: row.voided_by,
    createdAt: row.created_at,
  };
}

export function mapSaleItemRow(row: SaleItemRow): SaleItem {
  return {
    id: row.id,
    saleId: row.sale_id,
    productId: row.product_id,
    productName: row.product_name,
    productKind: row.product_kind,
    saleUnit: row.sale_unit,
    quantity: toNumber(row.quantity),
    unitPrice: toNumber(row.unit_price),
    lineTotal: toNumber(row.line_total),
  };
}

export function mapSalePaymentRow(row: SalePaymentRow): SalePayment {
  return {
    id: row.id,
    saleId: row.sale_id,
    method: row.method,
    amount: toNumber(row.amount),
  };
}

export function mapSaleWithDetails(
  row: SaleRow,
  items: SaleItem[],
  payments: SalePayment[]
): SaleWithDetails {
  return {
    ...mapSaleRow(row),
    items,
    payments,
  };
}
