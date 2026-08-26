import type { SupabaseClient } from "@supabase/supabase-js";

import type { CashMovement, CashSession, OpenCashSessionView } from "../domain/cash";
import type {
  CashRepository,
  CloseCashSessionInput,
  OpenCashSessionInput,
} from "../domain/cash.repository";
import { CashDomainError } from "../domain/cash.rules";
import { mapCashMovementRow, mapCashSessionRow } from "./cash.mapper";

function toMoney(value: number | string | null | undefined): number {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

async function sumTransferPaymentsSince(
  client: SupabaseClient,
  kind: "sales" | "purchases",
  openedAt: string
): Promise<number> {
  if (kind === "sales") {
    const { data, error } = await client
      .from("sale_payments")
      .select("amount, sales!inner(sold_at, status)")
      .eq("method", "transfer")
      .eq("sales.status", "completed")
      .gte("sales.sold_at", openedAt);

    if (error) throw new CashDomainError(error.message);
    return toMoney(
      (data ?? []).reduce((sum, row) => sum + toMoney(row.amount as number | string), 0)
    );
  }

  const { data, error } = await client
    .from("purchase_payments")
    .select("amount, purchases!inner(purchased_at)")
    .eq("method", "transfer")
    .gte("purchases.purchased_at", openedAt);

  if (error) throw new CashDomainError(error.message);
  return toMoney(
    (data ?? []).reduce((sum, row) => sum + toMoney(row.amount as number | string), 0)
  );
}

export function createSupabaseCashRepository(client: SupabaseClient): CashRepository {
  async function listMovements(sessionId: string): Promise<CashMovement[]> {
    const { data, error } = await client
      .from("cash_movements")
      .select(
        "id, cash_session_id, type, amount, notes, sale_id, purchase_id, expense_id, created_at"
      )
      .eq("cash_session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw new CashDomainError(error.message);
    return (data ?? []).map(mapCashMovementRow);
  }

  return {
    async getOpenSessionView(): Promise<OpenCashSessionView | null> {
      const { data, error } = await client
        .from("cash_sessions")
        .select("*")
        .eq("status", "open")
        .maybeSingle();

      if (error) throw new CashDomainError(error.message);
      if (!data) return null;

      const session = mapCashSessionRow(data);
      const movements = await listMovements(session.id);
      const expectedBalance = movements.reduce((sum, movement) => sum + movement.amount, 0);
      const [transferSalesTotal, transferPurchasesTotal] = await Promise.all([
        sumTransferPaymentsSince(client, "sales", session.openedAt),
        sumTransferPaymentsSince(client, "purchases", session.openedAt),
      ]);

      return {
        session,
        expectedBalance,
        transferSalesTotal,
        transferPurchasesTotal,
        movements,
      };
    },

    async listClosedSessions(limit: number): Promise<CashSession[]> {
      const { data, error } = await client
        .from("cash_sessions")
        .select("*")
        .eq("status", "closed")
        .order("closed_at", { ascending: false })
        .limit(limit);

      if (error) throw new CashDomainError(error.message);
      return (data ?? []).map(mapCashSessionRow);
    },

    listMovements,

    async openSession(input: OpenCashSessionInput): Promise<string> {
      const { data, error } = await client.rpc("open_cash_session", {
        p_opening_amount: input.openingAmount,
      });

      if (error) throw new CashDomainError(error.message);
      return data as string;
    },

    async closeSession(input: CloseCashSessionInput): Promise<string> {
      const { data, error } = await client.rpc("close_cash_session", {
        p_counted_amount: input.countedAmount,
        p_notes: input.notes,
      });

      if (error) throw new CashDomainError(error.message);
      return data as string;
    },
  };
}
