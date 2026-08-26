import { notFound } from "next/navigation";

import { getProductUseCase } from "../application/get-product.use-case";
import { listCategoriesUseCase } from "../application/list-catalog.use-case";
import { createSupabaseProductRepository } from "../infrastructure/supabase-product.repository";
import { ProductForm } from "./product-form";
import { createClient } from "@/shared/lib/supabase/server";

interface EditProductPageProps {
  productId: string;
}

export async function EditProductPage({ productId }: EditProductPageProps) {
  const supabase = await createClient();
  const repo = createSupabaseProductRepository(supabase);
  const [product, categories] = await Promise.all([
    getProductUseCase(repo, productId),
    listCategoriesUseCase(repo),
  ]);

  if (!product || product.kind !== "simple") notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Editar producto</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm
        mode="edit"
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          name: product.name,
          saleUnit: product.saleUnit,
          price: product.price,
          minStock: product.minStock,
          stock: product.stock,
          categoryId: product.categoryId,
          isActive: product.isActive,
        }}
      />
    </div>
  );
}
