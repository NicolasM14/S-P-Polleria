import Link from "next/link";

import { listSalesUseCase } from "../application/list-sales.use-case";
import { createSupabaseSaleRepository } from "../infrastructure/supabase-sale.repository";
import { SalesTable } from "./sales-table";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

export async function SalesPage() {
  const supabase = await createClient();
  const repo = createSupabaseSaleRepository(supabase);
  const sales = await listSalesUseCase(repo);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Ventas</h1>
          <p className="text-muted-foreground">Ventas de mostrador con pagos múltiples.</p>
        </div>
        <Button asChild variant="accent">
          <Link href="/ventas/nueva">Nueva venta</Link>
        </Button>
      </div>

      <SalesTable sales={sales} />
    </div>
  );
}
