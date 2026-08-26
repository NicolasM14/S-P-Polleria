export interface PeriodTotals {
  count: number;
  total: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  saleUnit: "kg" | "unit";
}

export interface OpenCashSummary {
  sessionId: string;
  openedAt: string;
  expectedBalance: number;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface PeriodReport {
  range: DateRange;
  sales: PeriodTotals;
  purchases: PeriodTotals;
  expenses: PeriodTotals;
  lowStock: LowStockProduct[];
  openCash: OpenCashSummary | null;
}

export interface DashboardSummary {
  salesToday: PeriodTotals;
  openCash: OpenCashSummary | null;
  lowStockCount: number;
}
