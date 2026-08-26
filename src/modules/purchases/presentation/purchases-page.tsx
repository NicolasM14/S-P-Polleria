import Link from "next/link";

import { listPurchasesUseCase } from "../application/list-purchases.use-case";
import { createSupabasePurchaseRepository } from "../infrastructure/supabase-purchase.repository";
import { PurchasesTable } from "./purchases-table";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

export async function PurchasesPage() {
  const supabase = await createClient();
  const repo = createSupabasePurchaseRepository(supabase);
  const purchases = await listPurchasesUseCase(repo);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Compras</h1>
          <p className="text-muted-foreground">
            Ingreso de mercadería con pagos múltiples.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/compras/nueva">Nueva compra</Link>
        </Button>
      </div>

      <PurchasesTable purchases={purchases} />
    </div>
  );
}
