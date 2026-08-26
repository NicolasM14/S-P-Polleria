import { CLOSED_SESSIONS_LIMIT } from "../domain/cash";
import { getOpenCashSessionUseCase } from "../application/get-open-cash-session.use-case";
import { listClosedCashSessionsUseCase } from "../application/list-closed-cash-sessions.use-case";
import { createSupabaseCashRepository } from "../infrastructure/supabase-cash.repository";
import { CashMovementsTable } from "./cash-movements-table";
import { CloseCashForm } from "./close-cash-form";
import { ClosedSessionsList } from "./closed-sessions-list";
import { OpenCashForm } from "./open-cash-form";
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

export async function CashPage() {
  const supabase = await createClient();
  const repo = createSupabaseCashRepository(supabase);
  const [openView, closedSessions] = await Promise.all([
    getOpenCashSessionUseCase(repo),
    listClosedCashSessionsUseCase(repo),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Caja</h1>
          <p className="text-sm text-muted-foreground">
            Efectivo del turno. Las transferencias se ven aparte y no cierran con la caja.
          </p>
        </div>
        {openView ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Abierta · {formatDateTime(openView.session.openedAt)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Sin caja abierta
          </span>
        )}
      </div>

      {!openView ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Abrir caja</CardTitle>
            <CardDescription>
              Ingresá el efectivo del cajón para empezar el turno. Puede ser 0.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpenCashForm />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <Card className="min-h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Efectivo</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Plata física del cajón. Esto es lo que se arquea al cerrar.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Debería haber ahora</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-primary">
                    {formatCurrency(openView.expectedBalance)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Inicio:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {formatCurrency(openView.session.openingAmount)}
                      </span>
                    </span>
                    <span>
                      Movimientos:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {openView.movements.length}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Cerrar caja</p>
                  <CloseCashForm expectedBalance={openView.expectedBalance} />
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Transferencias</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Solo informativo · no entra al efectivo ni al cierre
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-secondary/40 px-3 py-3">
                    <p className="text-xs text-muted-foreground">Cobradas (ventas)</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                      {formatCurrency(openView.transferSalesTotal)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/40 px-3 py-3">
                    <p className="text-xs text-muted-foreground">Pagadas (compras)</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                      {formatCurrency(openView.transferPurchasesTotal)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Comparalo con el banco o Mercado Pago. Desde la apertura de este turno.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Movimientos de efectivo</CardTitle>
              <CardDescription>Ingresos (+) y salidas (−) de plata física.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="max-h-56 overflow-auto rounded-md border border-border">
                <CashMovementsTable movements={openView.movements} compact />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Turnos anteriores</CardTitle>
          <CardDescription>Últimos {CLOSED_SESSIONS_LIMIT} cierres.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ClosedSessionsList sessions={closedSessions} />
        </CardContent>
      </Card>
    </div>
  );
}
