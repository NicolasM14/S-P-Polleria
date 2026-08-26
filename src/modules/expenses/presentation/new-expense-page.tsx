import { listExpenseCategoriesUseCase } from "../application/list-expense-categories.use-case";
import { createSupabaseExpenseRepository } from "../infrastructure/supabase-expense.repository";
import { ExpenseForm } from "./expense-form";
import { createClient } from "@/shared/lib/supabase/server";

export async function NewExpensePage() {
  const supabase = await createClient();
  const repo = createSupabaseExpenseRepository(supabase);
  const categories = await listExpenseCategoriesUseCase(repo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Nuevo gasto</h1>
        <p className="text-muted-foreground">
          Gastos operativos (no mercadería). Usá compras para ingreso de stock.
        </p>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay categorías de gasto. Revisá la configuración en la base de datos.
        </p>
      ) : (
        <ExpenseForm categories={categories} />
      )}
    </div>
  );
}
