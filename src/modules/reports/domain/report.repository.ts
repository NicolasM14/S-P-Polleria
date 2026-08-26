import type {
  DateRange,
  LowStockProduct,
  OpenCashSummary,
  PeriodTotals,
} from "./report";

export interface ReportRepository {
  getSalesTotals(range: DateRange): Promise<PeriodTotals>;
  getPurchasesTotals(range: DateRange): Promise<PeriodTotals>;
  getExpensesTotals(range: DateRange): Promise<PeriodTotals>;
  listLowStockProducts(): Promise<LowStockProduct[]>;
  getOpenCashSummary(): Promise<OpenCashSummary | null>;
}
