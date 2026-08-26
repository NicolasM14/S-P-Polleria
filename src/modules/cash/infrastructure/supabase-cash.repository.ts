import type { SupabaseClient } from "@supabase/supabase-js";

import type { CashMovement, CashSession, OpenCashSessionView } from "../domain/cash";
import type {
  CashRepository,
  CloseCashSessionInput,
  OpenCashSessionInput,
} from "../domain/cash.repository";
import { CashDomainError } from "../domain/cash.rules";
import { mapCashMovementRow, mapCashSessionRow } from "./cash.mapper";

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

      return { session, expectedBalance, movements };
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
