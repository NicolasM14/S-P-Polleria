"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createProductAction, updateProductAction } from "./product.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatGramsFromKg, gramsToKg, kgToGrams } from "@/shared/utils/weight";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormInitial {
  id?: string;
  name: string;
  saleUnit: "kg" | "unit";
  price: number;
  minStock: number;
  stock?: number;
  categoryId: string | null;
  isActive: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initial?: ProductFormInitial;
}

const emptyInitial: ProductFormInitial = {
  name: "",
  saleUnit: "kg",
  price: 0,
  minStock: 0,
  categoryId: null,
  isActive: true,
};

export function ProductForm({ mode, categories, initial }: ProductFormProps) {
  const router = useRouter();
  const base = initial ?? emptyInitial;
  const [name, setName] = useState(base.name);
  const [price, setPrice] = useState(mode === "create" ? "" : String(base.price));
  const [minStock, setMinStock] = useState(
    mode === "create" ? "" : String(kgToGrams(base.minStock))
  );
  const [categoryId, setCategoryId] = useState(base.categoryId ?? "");
  const [isActive, setIsActive] = useState(base.isActive);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result =
      mode === "create"
        ? await createProductAction({
            name,
            kind: "simple",
            saleUnit: "kg",
            price: Number(price),
            minStock: gramsToKg(Number(minStock || "0")),
            initialStock: 0,
            categoryId: categoryId || null,
            isActive,
            components: [],
          })
        : await updateProductAction({
            id: base.id,
            name,
            price: Number(price),
            minStock: gramsToKg(Number(minStock || "0")),
            categoryId: categoryId || null,
            isActive,
          });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "create"
        ? "Producto creado. Cargá el stock en Stock o Compras."
        : "Producto actualizado"
    );
    router.push(mode === "create" ? "/stock" : "/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Milanesa / Pollo"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Unidad</Label>
          <p className="flex h-10 items-center rounded-md border border-input bg-secondary/40 px-3 text-sm">
            Gramos (g)
          </p>
          <p className="text-xs text-muted-foreground">
            En pantalla se cargan gramos como en la balanza (1200 g = 1,2 kg). El precio es por kg.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">Precio por kg</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej. 8500"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="minStock">Stock mínimo (g)</Label>
          <Input
            id="minStock"
            type="number"
            min="0"
            step="1"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            placeholder="Ej. 2000"
          />
          <p className="text-xs text-muted-foreground">Alerta cuando queden pocos gramos.</p>
        </div>

        {mode === "create" ? (
          <div className="space-y-1.5 sm:col-span-2 rounded-md border border-dashed border-border bg-secondary/30 p-3">
            <p className="text-sm font-medium text-foreground">Stock al crear: 0 g</p>
            <p className="text-xs text-muted-foreground">
              Después de guardar, cargá lo que hay ahora en{" "}
              <span className="font-medium">Stock</span> (motivo Inventario inicial) o en{" "}
              <span className="font-medium">Compras</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label>Stock actual</Label>
            <p className="flex h-10 items-center rounded-md border border-input bg-secondary/40 px-3 text-sm tabular-nums">
              {formatGramsFromKg(base.stock ?? 0)} g
            </p>
            <p className="text-xs text-muted-foreground">
              Para reponer:{" "}
              <button
                type="button"
                className="text-accent underline-offset-2 hover:underline"
                onClick={() => router.push("/stock")}
              >
                Stock
              </button>{" "}
              o{" "}
              <button
                type="button"
                className="text-accent underline-offset-2 hover:underline"
                onClick={() => router.push("/compras/nueva")}
              >
                Compras
              </button>
              .
            </p>
          </div>
        )}

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="categoryId">Categoría</Label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Producto activo
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando…" : mode === "create" ? "Crear producto" : "Guardar cambios"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/productos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
