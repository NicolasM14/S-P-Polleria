import { getPeriodReportUseCase } from "../application/get-period-report.use-case";
import { reportDateRangeSchema } from "../application/report.schema";
import { createSupabaseReportRepository } from "../infrastructure/supabase-report.repository";
import { ReportsFilters } from "./reports-filters";
import { ReportsSummary } from "./reports-summary";
import { createClient } from "@/shared/lib/supabase/server";

interface ReportsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = (await searchParams) ?? {};
  const range = reportDateRangeSchema.parse({
    from: typeof params.from === "string" ? params.from : undefined,
    to: typeof params.to === "string" ? params.to : undefined,
  });

  const supabase = await createClient();
  const repo = createSupabaseReportRepository(supabase);
  const report = await getPeriodReportUseCase(repo, range.from, range.to);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Reportes</h1>
        <p className="text-muted-foreground">
          Resumen de ventas, compras, gastos, caja y stock bajo.
        </p>
      </div>

      <ReportsFilters from={report.range.from} to={report.range.to} />

      <ReportsSummary
        sales={report.sales}
        purchases={report.purchases}
        expenses={report.expenses}
        lowStock={report.lowStock}
        openCash={report.openCash}
      />
    </div>
  );
}
