import Link from "next/link";

import { listExpensesUseCase } from "../application/list-expenses.use-case";
import { createSupabaseExpenseRepository } from "../infrastructure/supabase-expense.repository";
import { ExpensesTable } from "./expenses-table";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

export async function ExpensesPage() {
  const supabase = await createClient();
  const repo = createSupabaseExpenseRepository(supabase);
  const expenses = await listExpensesUseCase(repo);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Gastos</h1>
          <p className="text-muted-foreground">
            Gastos operativos por categoría. El efectivo descuenta de la caja abierta.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/gastos/nuevo">Nuevo gasto</Link>
        </Button>
      </div>

      <ExpensesTable expenses={expenses} />
    </div>
  );
}
