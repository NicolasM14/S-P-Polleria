"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { createProductAction, updateProductAction } from "./product.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface CategoryOption {
  id: string;
  name: string;
}

interface SimpleProductOption {
  id: string;
  name: string;
  saleUnit: "kg" | "unit";
}

interface ComponentRow {
  componentId: string;
  quantity: string;
}

interface ProductFormInitial {
  id?: string;
  name: string;
  kind: "simple" | "combo";
  saleUnit: "kg" | "unit";
  price: number;
  minStock: number;
  stock?: number;
  categoryId: string | null;
  isActive: boolean;
  components: Array<{ componentId: string; quantity: number }>;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: CategoryOption[];
  simpleProducts: SimpleProductOption[];
  initial?: ProductFormInitial;
}

const emptyInitial: ProductFormInitial = {
  name: "",
  kind: "simple",
  saleUnit: "kg",
  price: 0,
  minStock: 0,
  categoryId: null,
  isActive: true,
  components: [],
};

export function ProductForm({ mode, categories, simpleProducts, initial }: ProductFormProps) {
  const router = useRouter();
  const base = initial ?? emptyInitial;
  const [name, setName] = useState(base.name);
  const [kind, setKind] = useState<"simple" | "combo">(base.kind);
  const [saleUnit, setSaleUnit] = useState<"kg" | "unit">(base.saleUnit);
  const [price, setPrice] = useState(String(base.price));
  const [minStock, setMinStock] = useState(String(base.minStock));
  const [initialStock, setInitialStock] = useState("0");
  const [categoryId, setCategoryId] = useState(base.categoryId ?? "");
  const [isActive, setIsActive] = useState(base.isActive);
  const [components, setComponents] = useState<ComponentRow[]>(
    base.components.length
      ? base.components.map((c) => ({
          componentId: c.componentId,
          quantity: String(c.quantity),
        }))
      : [{ componentId: "", quantity: "1" }]
  );
  const [loading, setLoading] = useState(false);

  const availableComponents = useMemo(
    () => simpleProducts.filter((p) => (mode === "edit" ? p.id !== base.id : true)),
    [simpleProducts, mode, base.id]
  );

  function addComponentRow() {
    setComponents((rows) => [...rows, { componentId: "", quantity: "1" }]);
  }

  function updateComponentRow(index: number, patch: Partial<ComponentRow>) {
    setComponents((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeComponentRow(index: number) {
    setComponents((rows) => rows.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payloadComponents =
      kind === "combo"
        ? components
            .filter((c) => c.componentId)
            .map((c) => ({
              componentId: c.componentId,
              quantity: Number(c.quantity),
            }))
        : [];

    const result =
      mode === "create"
        ? await createProductAction({
            name,
            kind,
            saleUnit,
            price: Number(price),
            minStock: Number(minStock),
            initialStock: kind === "simple" ? Number(initialStock) : 0,
            categoryId: categoryId || null,
            isActive,
            components: payloadComponents,
          })
        : await updateProductAction({
            id: base.id,
            name,
            price: Number(price),
            minStock: Number(minStock),
            categoryId: categoryId || null,
            isActive,
            components: kind === "combo" ? payloadComponents : undefined,
          });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Producto creado" : "Producto actualizado");
    router.push("/productos");
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
            placeholder="Pollo al spiedo"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kind">Tipo</Label>
          <select
            id="kind"
            value={kind}
            disabled={mode === "edit"}
            onChange={(e) => setKind(e.target.value as "simple" | "combo")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
          >
            <option value="simple">Simple</option>
            <option value="combo">Combo</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="saleUnit">Unidad de venta</Label>
          <select
            id="saleUnit"
            value={saleUnit}
            disabled={mode === "edit"}
            onChange={(e) => setSaleUnit(e.target.value as "kg" | "unit")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
          >
            <option value="kg">Kilogramo (kg)</option>
            <option value="unit">Unidad</option>
          </select>
          {mode === "edit" ? (
            <p className="text-xs text-muted-foreground">Tipo y unidad no se editan (historial).</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">Precio de venta</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="minStock">Stock mínimo {kind === "combo" ? "(opcional)" : ""}</Label>
          <Input
            id="minStock"
            type="number"
            min="0"
            step={saleUnit === "kg" ? "0.001" : "1"}
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            disabled={kind === "combo"}
          />
          <p className="text-xs text-muted-foreground">
            Alerta cuando el saldo baje de este valor.
          </p>
        </div>

        {mode === "create" && kind === "simple" ? (
          <div className="space-y-1.5">
            <Label htmlFor="initialStock">Stock inicial</Label>
            <Input
              id="initialStock"
              type="number"
              min="0"
              step={saleUnit === "kg" ? "0.001" : "1"}
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
              placeholder={saleUnit === "kg" ? "Ej. 25.000" : "Ej. 48"}
            />
            <p className="text-xs text-muted-foreground">
              Cantidad en {saleUnit === "kg" ? "kg" : "unidades"} al crear. Después usá Compras o
              Stock.
            </p>
          </div>
        ) : null}

        {mode === "edit" && kind === "simple" ? (
          <div className="space-y-1.5">
            <Label>Stock actual</Label>
            <p className="flex h-10 items-center rounded-md border border-input bg-secondary/40 px-3 text-sm tabular-nums">
              {base.stock ?? 0} {saleUnit === "kg" ? "kg" : "u."}
            </p>
            <p className="text-xs text-muted-foreground">
              Para subir o bajar stock andá a{" "}
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
        ) : null}

        {kind === "combo" ? (
          <div className="space-y-1.5 sm:col-span-2">
            <p className="text-xs text-muted-foreground">
              Los combos no tienen stock propio; se descuenta de los componentes al vender.
            </p>
          </div>
        ) : null}

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
          <p className="text-xs text-muted-foreground">
            Para crear categorías nuevas, usá el formulario en el listado de Productos.
          </p>
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

      {kind === "combo" ? (
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Receta del combo</h2>
              <p className="text-xs text-muted-foreground">
                Solo productos simples. Cantidad en la unidad del componente.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addComponentRow}>
              Agregar
            </Button>
          </div>

          {availableComponents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Primero creá al menos un producto simple activo para armar el combo.
            </p>
          ) : (
            <div className="space-y-3">
              {components.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                  <select
                    value={row.componentId}
                    onChange={(e) => updateComponentRow(index, { componentId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required={kind === "combo"}
                  >
                    <option value="">Elegir componente</option>
                    {availableComponents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.saleUnit})
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="0.001"
                    step="0.001"
                    required
                    value={row.quantity}
                    onChange={(e) => updateComponentRow(index, { quantity: e.target.value })}
                    placeholder="Cantidad"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponentRow(index)}
                    disabled={components.length <= 1}
                  >
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

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
