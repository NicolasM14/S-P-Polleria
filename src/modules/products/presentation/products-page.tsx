import Link from "next/link";

import { listCategoriesUseCase } from "../application/list-catalog.use-case";
import { listProductsUseCase } from "../application/list-products.use-case";
import { productListFiltersSchema } from "../application/product.schema";
import { createSupabaseProductRepository } from "../infrastructure/supabase-product.repository";
import { CreateCategoryForm } from "./create-category-form";
import { ProductsFilters } from "./products-filters";
import { ProductsTable } from "./products-table";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

interface ProductsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const filters = productListFiltersSchema.parse({
    search: typeof params.search === "string" ? params.search : undefined,
    kind: typeof params.kind === "string" ? params.kind : "all",
    active: typeof params.active === "string" ? params.active : "active",
  });

  const supabase = await createClient();
  const repo = createSupabaseProductRepository(supabase);
  const [products, categories] = await Promise.all([
    listProductsUseCase(repo, filters),
    listCategoriesUseCase(repo),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Productos</h1>
          <p className="text-muted-foreground">
            Catálogo de productos simples y combos con receta.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      <ProductsFilters
        search={filters.search}
        kind={filters.kind ?? "all"}
        active={filters.active ?? "active"}
      />

      <CreateCategoryForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <ProductsTable products={products} categoryNames={categoryNames} />
    </div>
  );
}
