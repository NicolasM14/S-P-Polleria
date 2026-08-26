import type {
  CashMovement,
  CashMovementType,
  CashSession,
  CashSessionStatus,
} from "../domain/cash";

interface CashSessionRow {
  id: string;
  status: CashSessionStatus;
  opened_at: string;
  opened_by: string;
  opening_amount: number | string;
  closed_at: string | null;
  closed_by: string | null;
  expected_amount: number | string | null;
  counted_amount: number | string | null;
  difference: number | string | null;
  notes: string | null;
}

interface CashMovementRow {
  id: string;
  cash_session_id: string;
  type: CashMovementType;
  amount: number | string;
  notes: string | null;
  sale_id: string | null;
  purchase_id: string | null;
  expense_id: string | null;
  created_at: string;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function toNullableNumber(value: number | string | null): number | null {
  if (value === null) return null;
  return toNumber(value);
}

export function mapCashSessionRow(row: CashSessionRow): CashSession {
  return {
    id: row.id,
    status: row.status,
    openedAt: row.opened_at,
    openedBy: row.opened_by,
    openingAmount: toNumber(row.opening_amount),
    closedAt: row.closed_at,
    closedBy: row.closed_by,
    expectedAmount: toNullableNumber(row.expected_amount),
    countedAmount: toNullableNumber(row.counted_amount),
    difference: toNullableNumber(row.difference),
    notes: row.notes,
  };
}

export function mapCashMovementRow(row: CashMovementRow): CashMovement {
  return {
    id: row.id,
    cashSessionId: row.cash_session_id,
    type: row.type,
    amount: toNumber(row.amount),
    notes: row.notes,
    saleId: row.sale_id,
    purchaseId: row.purchase_id,
    expenseId: row.expense_id,
    createdAt: row.created_at,
  };
}
