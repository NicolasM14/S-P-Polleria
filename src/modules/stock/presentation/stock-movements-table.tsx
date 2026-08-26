import { STOCK_MOVEMENT_TYPE_LABELS, type StockMovement } from "../domain/stock";
import { formatDateTime } from "@/shared/utils/format-datetime";
import { formatQuantity } from "@/shared/utils/format-quantity";

interface StockMovementsTableProps {
  movements: StockMovement[];
}

export function StockMovementsTable({ movements }: StockMovementsTableProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Todavía no hay movimientos de stock.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Cantidad</th>
              <th className="px-4 py-3 font-medium">Stock resultante</th>
              <th className="px-4 py-3 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => {
              const positive = movement.quantity > 0;
              return (
                <tr key={movement.id} className="border-b last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateTime(movement.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{movement.productName}</td>
                  <td className="px-4 py-3">
                    {STOCK_MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}
                  </td>
                  <td
                    className={`px-4 py-3 tabular-nums font-medium ${
                      positive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {formatQuantity(movement.quantity, movement.saleUnit)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatQuantity(movement.stockAfter, movement.saleUnit)}
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
