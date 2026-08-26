import type { PeriodReport } from "../domain/report";
import type { ReportRepository } from "../domain/report.repository";
import {
  assertValidDateRange,
  endOfLocalDayISO,
  startOfLocalDayISO,
} from "../domain/report.rules";

export async function getPeriodReportUseCase(
  repo: ReportRepository,
  from: string,
  to: string
): Promise<PeriodReport> {
  assertValidDateRange(from, to);

  const range = {
    from: startOfLocalDayISO(from),
    to: endOfLocalDayISO(to),
  };

  const [sales, purchases, expenses, lowStock, openCash] = await Promise.all([
    repo.getSalesTotals(range),
    repo.getPurchasesTotals(range),
    repo.getExpensesTotals(range),
    repo.listLowStockProducts(),
    repo.getOpenCashSummary(),
  ]);

  return {
    range: { from, to },
    sales,
    purchases,
    expenses,
    lowStock,
    openCash,
  };
}
