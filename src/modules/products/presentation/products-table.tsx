import Link from "next/link";

import { setProductActiveAction } from "./product.actions";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatQuantity } from "@/shared/utils/format-quantity";

interface ProductRow {
  id: string;
  categoryId: string | null;
  name: string;
  kind: "simple" | "combo";
  saleUnit: "kg" | "unit";
  price: number;
  stock: number;
  minStock: number;
  isActive: boolean;
}

interface ProductsTableProps {
  products: ProductRow[];
  categoryNames: Record<string, string>;
}

export function ProductsTable({ products, categoryNames }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No hay productos con estos filtros.</p>
        <Button asChild className="mt-4">
          <Link href="/productos/nuevo">Registrar primer producto</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 border-b bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Unidad</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowStock =
                product.kind === "simple" &&
                product.isActive &&
                product.stock <= product.minStock;
              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.categoryId
                        ? categoryNames[product.categoryId] ?? "Sin categoría"
                        : "Sin categoría"}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {product.kind === "simple" ? "Simple" : "Combo"}
                  </td>
                  <td className="px-4 py-3">{product.saleUnit === "kg" ? "kg" : "unidad"}</td>
                  <td className="px-4 py-3 tabular-nums">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {product.kind === "combo" ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <span className={lowStock ? "font-medium text-warning" : undefined}>
                        {formatQuantity(product.stock, product.saleUnit)}
                        {lowStock ? " · bajo" : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.isActive
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/productos/${product.id}`}>Editar</Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await setProductActiveAction({
                            id: product.id,
                            isActive: !product.isActive,
                          });
                        }}
                      >
                        <Button
                          type="submit"
                          variant={product.isActive ? "ghost" : "secondary"}
                          size="sm"
                        >
                          {product.isActive ? "Desactivar" : "Activar"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
