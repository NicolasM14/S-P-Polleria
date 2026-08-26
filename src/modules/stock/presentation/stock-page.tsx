import { listSimpleForAdjustUseCase } from "../application/list-simple-for-adjust.use-case";
import { listStockMovementsUseCase } from "../application/list-stock-movements.use-case";
import { listStockUseCase } from "../application/list-stock.use-case";
import { createSupabaseStockRepository } from "../infrastructure/supabase-stock.repository";
import { AdjustStockForm } from "./adjust-stock-form";
import { StockBalancesTable } from "./stock-balances-table";
import { StockMovementsTable } from "./stock-movements-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { createClient } from "@/shared/lib/supabase/server";

export async function StockPage() {
  const supabase = await createClient();
  const repo = createSupabaseStockRepository(supabase);
  const [balances, movements, products] = await Promise.all([
    listStockUseCase(repo),
    listStockMovementsUseCase(repo),
    listSimpleForAdjustUseCase(repo),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Stock</h1>
        <p className="text-muted-foreground">
          Saldos de productos simples, movimientos recientes y ajustes manuales.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Saldos actuales</h2>
        <StockBalancesTable balances={balances} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajuste de stock</CardTitle>
          <CardDescription>
            Solo productos simples. Se registra vía movimiento tipo ajuste (nunca edita el
            saldo a mano).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdjustStockForm products={products} />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Movimientos recientes</h2>
        <p className="text-sm text-muted-foreground">Últimos 50 movimientos.</p>
        <StockMovementsTable movements={movements} />
      </section>
    </div>
  );
}
