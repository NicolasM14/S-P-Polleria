import type { DashboardSummary } from "../domain/report";
import type { ReportRepository } from "../domain/report.repository";
import {
  endOfLocalDayISO,
  startOfLocalDayISO,
  todayDateString,
} from "../domain/report.rules";

export async function getDashboardSummaryUseCase(
  repo: ReportRepository
): Promise<DashboardSummary> {
  const today = todayDateString();
  const range = {
    from: startOfLocalDayISO(today),
    to: endOfLocalDayISO(today),
  };

  const [salesToday, openCash, lowStock] = await Promise.all([
    repo.getSalesTotals(range),
    repo.getOpenCashSummary(),
    repo.listLowStockProducts(),
  ]);

  return {
    salesToday,
    openCash,
    lowStockCount: lowStock.length,
  };
}
