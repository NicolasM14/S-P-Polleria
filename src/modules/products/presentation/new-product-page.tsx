import { listCategoriesUseCase } from "../application/list-catalog.use-case";
import { createSupabaseProductRepository } from "../infrastructure/supabase-product.repository";
import { ProductForm } from "./product-form";
import { createClient } from "@/shared/lib/supabase/server";

export async function NewProductPage() {
  const supabase = await createClient();
  const repo = createSupabaseProductRepository(supabase);
  const categories = await listCategoriesUseCase(repo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Nuevo producto</h1>
        <p className="text-muted-foreground">
          Alta de producto. Las cantidades se cargan en gramos; el precio es por kg.
        </p>
      </div>
      <ProductForm
        mode="create"
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
