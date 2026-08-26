"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { adjustStockAction } from "./stock.actions";
import { STOCK_ADJUST_REASONS } from "../domain/adjust-reasons";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatQuantity } from "@/shared/utils/format-quantity";

interface ProductOption {
  id: string;
  name: string;
  saleUnit: "kg" | "unit";
  stock: number;
}

interface AdjustStockFormProps {
  products: ProductOption[];
}

export function AdjustStockForm({ products }: AdjustStockFormProps) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<string>(STOCK_ADJUST_REASONS[0].value);
  const [otherDetail, setOtherDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await adjustStockAction({
      productId,
      quantity: Number(quantity),
      reason,
      otherDetail: reason === "other" ? otherDetail : "",
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Ajuste de stock registrado");
    setQuantity("");
    setReason(STOCK_ADJUST_REASONS[0].value);
    setOtherDetail("");
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay productos simples activos para ajustar.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="productId">Producto</Label>
        <select
          id="productId"
          required
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.saleUnit}) — stock{" "}
              {formatQuantity(product.stock, product.saleUnit)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quantity">Cantidad (+ / −)</Label>
        <Input
          id="quantity"
          type="number"
          required
          step={selected?.saleUnit === "kg" ? "0.001" : "1"}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={selected?.saleUnit === "kg" ? "Ej. -0.500" : "Ej. -2"}
        />
        <p className="text-xs text-muted-foreground">
          Positivo suma stock; negativo descuenta. No puede ser 0.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reason">Motivo</Label>
        <select
          id="reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {STOCK_ADJUST_REASONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {reason === "other" ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="otherDetail">Detalle</Label>
          <Input
            id="otherDetail"
            required
            value={otherDetail}
            onChange={(e) => setOtherDetail(e.target.value)}
            placeholder="Describí el motivo"
            maxLength={200}
          />
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Registrando…" : "Registrar ajuste"}
        </Button>
      </div>
    </form>
  );
}
