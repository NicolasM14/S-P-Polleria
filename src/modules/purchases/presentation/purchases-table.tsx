import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

interface PurchaseRow {
  id: string;
  purchasedAt: string;
  notes: string | null;
  total: number;
}

interface PurchasesTableProps {
  purchases: PurchaseRow[];
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">Todavía no hay compras registradas.</p>
        <Button asChild variant="accent" className="mt-4">
          <Link href="/compras/nueva">Registrar primera compra</Link>
        </Button>
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
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Notas</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="border-b last:border-0">
                <td className="px-4 py-3 tabular-nums">
                  {formatDateTime(purchase.purchasedAt)}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(purchase.total)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {purchase.notes?.trim() ? purchase.notes : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
