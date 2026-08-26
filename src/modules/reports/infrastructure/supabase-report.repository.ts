import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DateRange,
  LowStockProduct,
  OpenCashSummary,
  PeriodTotals,
} from "../domain/report";
import type { ReportRepository } from "../domain/report.repository";
import { ReportDomainError } from "../domain/report.rules";
import { mapLowStockProduct, sumTotals } from "./report.mapper";

export function createSupabaseReportRepository(client: SupabaseClient): ReportRepository {
  return {
    async getSalesTotals(range: DateRange): Promise<PeriodTotals> {
      const { data, error } = await client
        .from("sales")
        .select("total")
        .neq("status", "voided")
        .gte("sold_at", range.from)
        .lte("sold_at", range.to);

      if (error) throw new ReportDomainError(error.message);
      return sumTotals(data ?? []);
    },

    async getPurchasesTotals(range: DateRange): Promise<PeriodTotals> {
      const { data, error } = await client
        .from("purchases")
        .select("total")
        .gte("purchased_at", range.from)
        .lte("purchased_at", range.to);

      if (error) throw new ReportDomainError(error.message);
      return sumTotals(data ?? []);
    },

    async getExpensesTotals(range: DateRange): Promise<PeriodTotals> {
      const { data, error } = await client
        .from("expenses")
        .select("amount")
        .gte("occurred_at", range.from)
        .lte("occurred_at", range.to);

      if (error) throw new ReportDomainError(error.message);
      return sumTotals(data ?? []);
    },

    async listLowStockProducts(): Promise<LowStockProduct[]> {
      const { data, error } = await client
        .from("products")
        .select("id, name, stock, min_stock, sale_unit")
        .eq("kind", "simple")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw new ReportDomainError(error.message);

      return (data ?? [])
        .map(mapLowStockProduct)
        .filter((product) => product.stock <= product.minStock);
    },

    async getOpenCashSummary(): Promise<OpenCashSummary | null> {
      const { data: session, error: sessionError } = await client
        .from("cash_sessions")
        .select("id, opened_at")
        .eq("status", "open")
        .maybeSingle();

      if (sessionError) throw new ReportDomainError(sessionError.message);
      if (!session) return null;

      const { data: movements, error: movementsError } = await client
        .from("cash_movements")
        .select("amount")
        .eq("cash_session_id", session.id);

      if (movementsError) throw new ReportDomainError(movementsError.message);

      const expectedBalance = (movements ?? []).reduce(
        (sum, row) => sum + (typeof row.amount === "number" ? row.amount : Number(row.amount)),
        0
      );

      return {
        sessionId: session.id,
        openedAt: session.opened_at,
        expectedBalance: Math.round(expectedBalance * 100) / 100,
      };
    },
  };
}
