import type { CashSession } from "../domain/cash";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

interface ClosedSessionsListProps {
  sessions: CashSession[];
}

export function ClosedSessionsList({ sessions }: ClosedSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Todavía no hay sesiones cerradas.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Cierre</th>
              <th className="px-4 py-3 font-medium">Apertura</th>
              <th className="px-4 py-3 font-medium">Esperado</th>
              <th className="px-4 py-3 font-medium">Contado</th>
              <th className="px-4 py-3 font-medium">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const difference = session.difference ?? 0;
              return (
                <tr key={session.id} className="border-b last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {session.closedAt ? formatDateTime(session.closedAt) : "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(session.openingAmount)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(session.expectedAmount ?? 0)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(session.countedAmount ?? 0)}
                  </td>
                  <td
                    className={`px-4 py-3 tabular-nums font-medium ${
                      difference === 0
                        ? "text-foreground"
                        : difference > 0
                          ? "text-success"
                          : "text-destructive"
                    }`}
                  >
                    {difference > 0 ? "+" : ""}
                    {formatCurrency(difference)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
