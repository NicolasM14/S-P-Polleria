import { CASH_MOVEMENT_TYPE_LABELS, type CashMovement } from "../domain/cash";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";
import { cn } from "@/shared/lib/utils";

interface CashMovementsTableProps {
  movements: CashMovement[];
  compact?: boolean;
}

export function CashMovementsTable({ movements, compact = false }: CashMovementsTableProps) {
  if (movements.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">Sin movimientos de efectivo todavía.</p>
      </div>
    );
  }

  return (
    <div className={cn(!compact && "overflow-hidden rounded-lg border border-border bg-card")}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Cuándo</th>
              <th className="px-3 py-2 font-medium">Qué pasó</th>
              <th className="px-3 py-2 font-medium">Efectivo</th>
              <th className="px-3 py-2 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => {
              const positive = movement.amount >= 0;
              return (
                <tr key={movement.id} className="border-b last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {formatDateTime(movement.createdAt)}
                  </td>
                  <td className="px-3 py-2">
                    {CASH_MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}
                  </td>
                  <td
                    className={`px-3 py-2 font-medium tabular-nums ${
                      positive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {formatCurrency(movement.amount)}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
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
