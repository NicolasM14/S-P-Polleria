import type { CashMovement, CashSession, OpenCashSessionView } from "./cash";

export interface OpenCashSessionInput {
  openingAmount: number;
}

export interface CloseCashSessionInput {
  countedAmount: number;
  notes: string | null;
}

export interface CashRepository {
  getOpenSessionView(): Promise<OpenCashSessionView | null>;
  listClosedSessions(limit: number): Promise<CashSession[]>;
  listMovements(sessionId: string): Promise<CashMovement[]>;
  openSession(input: OpenCashSessionInput): Promise<string>;
  closeSession(input: CloseCashSessionInput): Promise<string>;
}
