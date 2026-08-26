import { listCategoriesUseCase, listSimpleProductsUseCase } from "../application/list-catalog.use-case";
import { createSupabaseProductRepository } from "../infrastructure/supabase-product.repository";
import { ProductForm } from "./product-form";
import { createClient } from "@/shared/lib/supabase/server";

export async function NewProductPage() {
  const supabase = await createClient();
  const repo = createSupabaseProductRepository(supabase);
  const [categories, simpleProducts] = await Promise.all([
    listCategoriesUseCase(repo),
    listSimpleProductsUseCase(repo),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Nuevo producto</h1>
        <p className="text-muted-foreground">Alta de producto simple o combo.</p>
      </div>
      <ProductForm
        mode="create"
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        simpleProducts={simpleProducts.map((p) => ({
          id: p.id,
          name: p.name,
          saleUnit: p.saleUnit,
        }))}
      />
    </div>
  );
}
