import { CASH_MOVEMENT_TYPE_LABELS, type CashMovement } from "../domain/cash";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

interface CashMovementsTableProps {
  movements: CashMovement[];
}

export function CashMovementsTable({ movements }: CashMovementsTableProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Sin movimientos en esta sesión todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => {
              const positive = movement.amount >= 0;
              return (
                <tr key={movement.id} className="border-b last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateTime(movement.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {CASH_MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}
                  </td>
                  <td
                    className={`px-4 py-3 tabular-nums font-medium ${
                      positive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {formatCurrency(movement.amount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {movement.notes?.trim() || "—"}
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
