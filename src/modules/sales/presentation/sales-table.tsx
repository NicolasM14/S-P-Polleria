import Link from "next/link";

import type { SaleStatus } from "../domain/sale";
import { VoidSaleButton } from "./void-sale-button";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

interface SaleRow {
  id: string;
  soldAt: string;
  status: SaleStatus;
  total: number;
  notes: string | null;
}

interface SalesTableProps {
  sales: SaleRow[];
}

export function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>
        <Button asChild variant="accent" className="mt-4">
          <Link href="/ventas/nueva">Registrar primera venta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Notas</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0">
                <td className="px-4 py-3 tabular-nums">{formatDateTime(sale.soldAt)}</td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(sale.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      sale.status === "completed"
                        ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
                        : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {sale.status === "completed" ? "Completada" : "Anulada"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {sale.notes?.trim() ? sale.notes : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {sale.status === "completed" ? (
                      <VoidSaleButton saleId={sale.id} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
