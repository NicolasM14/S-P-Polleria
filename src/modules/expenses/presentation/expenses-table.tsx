import Link from "next/link";

import type { Expense } from "../domain/expense";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatDateTime } from "@/shared/utils/format-datetime";

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">Todavía no hay gastos registrados.</p>
        <Button asChild variant="accent" className="mt-4">
          <Link href="/gastos/nuevo">Registrar primer gasto</Link>
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
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Desde caja</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b last:border-0">
                <td className="px-4 py-3 tabular-nums">
                  {formatDateTime(expense.occurredAt)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {expense.categoryName ?? "Sin categoría"}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3">
                  {expense.fromCash ? "Sí" : "No"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {expense.description.trim() ? expense.description : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
