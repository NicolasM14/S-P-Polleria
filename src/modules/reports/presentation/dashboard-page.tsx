import Link from "next/link";

import { getDashboardSummaryUseCase } from "../application/get-dashboard-summary.use-case";
import { createSupabaseReportRepository } from "../infrastructure/supabase-report.repository";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { createClient } from "@/shared/lib/supabase/server";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

export async function DashboardPage() {
  const supabase = await createClient();
  const repo = createSupabaseReportRepository(supabase);
  const summary = await getDashboardSummaryUseCase(repo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Inicio</h1>
        <p className="text-muted-foreground">
          Resumen del día: ventas, caja y stock.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ventas de hoy</CardTitle>
            <CardDescription>Excluye anuladas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(summary.salesToday.total)}
            </p>
            <p className="text-sm text-muted-foreground">
              {summary.salesToday.count} venta
              {summary.salesToday.count === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Caja</CardTitle>
            <CardDescription>Saldo esperado</CardDescription>
          </CardHeader>
          <CardContent>
            {summary.openCash ? (
              <div className="space-y-1">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(summary.openCash.expectedBalance)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Abierta {formatDateTime(summary.openCash.openedAt)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-medium text-muted-foreground">Sin caja abierta</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stock bajo</CardTitle>
            <CardDescription>Productos en mínimo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-semibold tabular-nums">
              {summary.lowStockCount}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/stock">Ver stock</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="accent">
            <Link href="/ventas/nueva">Nueva venta</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/compras/nueva">Nueva compra</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/caja">Caja</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/productos">Productos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
