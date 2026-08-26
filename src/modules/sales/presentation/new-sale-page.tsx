import { listProductsUseCase } from "@/modules/products/application/list-products.use-case";
import { createSupabaseProductRepository } from "@/modules/products/infrastructure/supabase-product.repository";
import { createClient } from "@/shared/lib/supabase/server";

import { SaleForm } from "./sale-form";

export async function NewSalePage() {
  const supabase = await createClient();
  const productRepo = createSupabaseProductRepository(supabase);
  const products = await listProductsUseCase(productRepo, { active: "active" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Nueva venta</h1>
        <p className="text-muted-foreground">
          Productos activos (simples y combos). Los pagos deben igualar el total con descuento.
        </p>
      </div>
      <SaleForm
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          kind: p.kind,
          saleUnit: p.saleUnit,
          price: p.price,
        }))}
      />
    </div>
  );
}
