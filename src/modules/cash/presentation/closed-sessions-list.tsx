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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Cerrado</th>
            <th className="px-3 py-2 font-medium">Inicio</th>
            <th className="px-3 py-2 font-medium">Esperado</th>
            <th className="px-3 py-2 font-medium">Contado</th>
            <th className="px-3 py-2 font-medium">Dif.</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const difference = session.difference ?? 0;
            return (
              <tr key={session.id} className="border-b last:border-0">
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                  {session.closedAt ? formatDateTime(session.closedAt) : "—"}
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {formatCurrency(session.openingAmount)}
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {formatCurrency(session.expectedAmount ?? 0)}
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {formatCurrency(session.countedAmount ?? 0)}
                </td>
                <td
                  className={`px-3 py-2 font-medium tabular-nums ${
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
  );
}
