import type { LowStockProduct, OpenCashSummary, PeriodTotals } from "../domain/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";
import { formatQuantity } from "@/shared/utils/format-quantity";

interface TotalsCardProps {
  title: string;
  description: string;
  totals: PeriodTotals;
}

function TotalsCard({ title, description, totals }: TotalsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {formatCurrency(totals.total)}
        </p>
        <p className="text-sm text-muted-foreground">
          {totals.count} registro{totals.count === 1 ? "" : "s"}
        </p>
      </CardContent>
    </Card>
  );
}

interface ReportsSummaryProps {
  sales: PeriodTotals;
  purchases: PeriodTotals;
  expenses: PeriodTotals;
  lowStock: LowStockProduct[];
  openCash: OpenCashSummary | null;
}

export function ReportsSummary({
  sales,
  purchases,
  expenses,
  lowStock,
  openCash,
}: ReportsSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <TotalsCard
          title="Ventas"
          description="Excluye anuladas"
          totals={sales}
        />
        <TotalsCard title="Compras" description="Ingreso de mercadería" totals={purchases} />
        <TotalsCard title="Gastos" description="Gastos operativos" totals={expenses} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Caja</CardTitle>
          <CardDescription>Estado de la sesión abierta</CardDescription>
        </CardHeader>
        <CardContent>
          {openCash ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Abierta el</dt>
                <dd className="font-medium tabular-nums">
                  {formatDateTime(openCash.openedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Saldo esperado</dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {formatCurrency(openCash.expectedBalance)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Sin caja abierta</p>
          )}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Stock bajo mínimo</h2>
          <p className="text-sm text-muted-foreground">
            Productos simples activos con stock ≤ mínimo.
          </p>
        </div>
        {lowStock.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No hay productos con stock bajo.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium">Stock (g)</th>
                    <th className="px-4 py-3 font-medium">Mínimo (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((product) => (
                    <tr key={product.id} className="border-b bg-warning/5 last:border-0">
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3 tabular-nums text-warning">
                        {formatQuantity(product.stock, product.saleUnit)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatQuantity(product.minStock, product.saleUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
