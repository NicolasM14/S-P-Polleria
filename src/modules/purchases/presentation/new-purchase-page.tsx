import { listSimpleProductsUseCase } from "@/modules/products/application/list-catalog.use-case";
import { createSupabaseProductRepository } from "@/modules/products/infrastructure/supabase-product.repository";
import { createClient } from "@/shared/lib/supabase/server";

import { PurchaseForm } from "./purchase-form";

export async function NewPurchasePage() {
  const supabase = await createClient();
  const productRepo = createSupabaseProductRepository(supabase);
  const products = await listSimpleProductsUseCase(productRepo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Nueva compra</h1>
        <p className="text-muted-foreground">
          Comprá en <span className="font-medium">gramos</span>. El costo es por kg. Solo efectivo o
          transferencia. Los pagos deben igualar el total.
        </p>
      </div>
      <PurchaseForm
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
        }))}
      />
    </div>
  );
}
