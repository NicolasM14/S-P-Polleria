import type { StockBalance } from "../domain/stock";
import { isLowStock } from "../domain/stock.rules";
import { formatQuantity } from "@/shared/utils/format-quantity";

interface StockBalancesTableProps {
  balances: StockBalance[];
}

export function StockBalancesTable({ balances }: StockBalancesTableProps) {
  if (balances.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No hay productos simples. Creá productos en el catálogo para gestionar stock.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Stock (g)</th>
              <th className="px-4 py-3 font-medium">Mínimo (g)</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((row) => {
              const low = row.isActive && isLowStock(row.stock, row.minStock);
              return (
                <tr
                  key={row.id}
                  className={`border-b last:border-0 ${low ? "bg-warning/5" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-3 tabular-nums">
                    <span className={low ? "font-semibold text-warning" : undefined}>
                      {formatQuantity(row.stock, "kg")} g
                      {low ? " · bajo" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatQuantity(row.minStock, "kg")} g
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.isActive
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {row.isActive ? "Activo" : "Inactivo"}
                    </span>
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
