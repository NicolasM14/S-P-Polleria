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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Caja</h1>
        <p className="text-muted-foreground">
          Apertura, movimientos de efectivo y cierre con arqueo.
        </p>
      </div>

      {!openView ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Abrir caja</CardTitle>
            <CardDescription>
              No hay sesión abierta. Solo puede haber una caja abierta a la vez.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpenCashForm />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sesión abierta</CardTitle>
              <CardDescription>
                Abierta el {formatDateTime(openView.session.openedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Monto de apertura</dt>
                  <dd className="text-lg font-semibold tabular-nums text-foreground">
                    {formatCurrency(openView.session.openingAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Saldo esperado</dt>
                  <dd className="text-lg font-semibold tabular-nums text-foreground">
                    {formatCurrency(openView.expectedBalance)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Movimientos</dt>
                  <dd className="text-lg font-semibold tabular-nums text-foreground">
                    {openView.movements.length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Movimientos de la sesión</h2>
            <CashMovementsTable movements={openView.movements} />
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cerrar caja</CardTitle>
              <CardDescription>
                Contá el efectivo físico e ingresá el monto. La diferencia se calcula
                automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CloseCashForm expectedBalance={openView.expectedBalance} />
            </CardContent>
          </Card>
        </>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Sesiones cerradas recientes</h2>
        <p className="text-sm text-muted-foreground">Últimas 10 sesiones.</p>
        <ClosedSessionsList sessions={closedSessions} />
      </section>
    </div>
  );
}
