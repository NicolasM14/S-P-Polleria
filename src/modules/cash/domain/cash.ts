export type CashSessionStatus = "open" | "closed";

export type CashMovementType =
  | "opening"
  | "sale"
  | "purchase"
  | "expense"
  | "manual_in"
  | "manual_out";

export interface CashSession {
  id: string;
  status: CashSessionStatus;
  openedAt: string;
  openedBy: string;
  openingAmount: number;
  closedAt: string | null;
  closedBy: string | null;
  expectedAmount: number | null;
  countedAmount: number | null;
  difference: number | null;
  notes: string | null;
}

export interface CashMovement {
  id: string;
  cashSessionId: string;
  type: CashMovementType;
  amount: number;
  notes: string | null;
  saleId: string | null;
  purchaseId: string | null;
  expenseId: string | null;
  createdAt: string;
}

export interface OpenCashSessionView {
  session: CashSession;
  expectedBalance: number;
  /** Transferencias cobradas en ventas desde la apertura (no mueve efectivo). */
  transferSalesTotal: number;
  /** Transferencias pagadas en compras desde la apertura (no mueve efectivo). */
  transferPurchasesTotal: number;
  movements: CashMovement[];
}

export const CASH_MOVEMENT_TYPE_LABELS: Record<CashMovementType, string> = {
  opening: "Apertura",
  sale: "Venta",
  purchase: "Compra",
  expense: "Gasto",
  manual_in: "Ingreso manual",
  manual_out: "Egreso manual",
};

export const CLOSED_SESSIONS_LIMIT = 10;
