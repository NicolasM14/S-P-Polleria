"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/shared/constants/payment-methods";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatCurrency } from "@/shared/utils/format-currency";
import { formatQuantity } from "@/shared/utils/format-quantity";
import { numberInputValue } from "@/shared/utils/number-input";
import { gramsToKg, kgToGrams } from "@/shared/utils/weight";

import { createSaleAction } from "./sale.actions";

interface ProductOption {
  id: string;
  name: string;
  saleUnit: "kg" | "unit";
  price: number;
  stock: number;
}

interface ItemRow {
  productId: string;
  quantity: string;
  unitPrice: string;
}

interface PaymentRow {
  method: PaymentMethod;
  amount: string;
}

interface SaleFormProps {
  products: ProductOption[];
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function SaleForm({ products }: SaleFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemRow[]>([
    { productId: "", quantity: "", unitPrice: "" },
  ]);
  const [payments, setPayments] = useState<PaymentRow[]>([
    { method: "cash", amount: "" },
  ]);
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () =>
      roundMoney(
        items.reduce((sum, row) => {
          const grams = Number(row.quantity);
          const price = Number(row.unitPrice);
          if (!row.productId || !Number.isFinite(grams) || !Number.isFinite(price)) return sum;
          return sum + gramsToKg(grams) * price;
        }, 0)
      ),
    [items]
  );

  const discountValue = useMemo(() => {
    const value = Number(discount);
    return Number.isFinite(value) && value > 0 ? roundMoney(value) : 0;
  }, [discount]);

  const total = useMemo(() => roundMoney(Math.max(0, subtotal - discountValue)), [
    subtotal,
    discountValue,
  ]);

  const paymentsSum = useMemo(
    () =>
      roundMoney(
        payments.reduce((sum, row) => {
          const amount = Number(row.amount);
          return Number.isFinite(amount) ? sum + amount : sum;
        }, 0)
      ),
    [payments]
  );

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function selectProduct(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    updateItem(index, {
      productId,
      unitPrice: product ? numberInputValue(product.price) : "",
      quantity: "",
    });
  }

  function updatePayment(index: number, patch: Partial<PaymentRow>) {
    setPayments((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    for (const row of items.filter((r) => r.productId)) {
      const product = products.find((p) => p.id === row.productId);
      const grams = Number(row.quantity);
      const qtyKg = gramsToKg(grams);
      if (!product || !Number.isFinite(grams) || !Number.isInteger(grams) || grams <= 0) {
        toast.error("Revisá las cantidades en gramos (enteros, como en la balanza).");
        return;
      }
      if (qtyKg > product.stock) {
        toast.error(
          `Stock insuficiente de ${product.name}: hay ${formatQuantity(product.stock, "kg")} g.`
        );
        return;
      }
    }

    setLoading(true);

    const result = await createSaleAction({
      items: items
        .filter((row) => row.productId)
        .map((row) => ({
          productId: row.productId,
          quantity: gramsToKg(Number(row.quantity)),
          unitPrice: Number(row.unitPrice),
        })),
      payments: payments.map((row) => ({
        method: row.method,
        amount: Number(row.amount),
      })),
      discount: discountValue,
      notes: notes.trim() || undefined,
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Venta registrada");
    router.push("/ventas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card className="min-h-[320px]">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3">
            <div>
              <CardTitle className="text-base">Ítems</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Ingresá los <span className="font-medium">gramos</span> de la balanza (ej. 1200 =
                1,2 kg). Se descuenta del stock.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() =>
                setItems((rows) => [...rows, { productId: "", quantity: "", unitPrice: "" }])
              }
            >
              Agregar ítem
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay productos activos. Creá productos antes de vender.
              </p>
            ) : (
              items.map((row, index) => {
                const selected = products.find((p) => p.id === row.productId);
                return (
                  <div key={index} className="space-y-2 rounded-md border border-border/70 p-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_100px_110px_auto]">
                      <div className="space-y-1.5">
                        {index === 0 ? <Label>Producto</Label> : null}
                        <select
                          value={row.productId}
                          required
                          onChange={(e) => selectProduct(index, e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Elegir producto</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {formatQuantity(p.stock, "kg")} g ·{" "}
                              {formatCurrency(p.price)}/kg
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        {index === 0 ? <Label>Cantidad (g)</Label> : null}
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={row.quantity}
                          onChange={(e) => updateItem(index, { quantity: e.target.value })}
                          placeholder="Ej. 1200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        {index === 0 ? <Label>Precio / kg</Label> : null}
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={row.unitPrice}
                          onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                          placeholder="Ej. 8500"
                        />
                      </div>
                      <div className={index === 0 ? "flex items-end pb-0.5" : "flex items-center"}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={items.length <= 1}
                          onClick={() => setItems((rows) => rows.filter((_, i) => i !== index))}
                        >
                          Quitar
                        </Button>
                      </div>
                    </div>
                    {selected ? (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        Stock disponible:{" "}
                        <span className="font-medium text-foreground">
                          {formatQuantity(selected.stock, selected.saleUnit)} g
                        </span>
                        {row.quantity && Number(row.quantity) > 0 ? (
                          <>
                            {" "}
                            → quedan aprox.{" "}
                            <span className="font-medium text-foreground">
                              {Math.max(
                                0,
                                kgToGrams(selected.stock) - Number(row.quantity)
                              ).toLocaleString("es-AR")}{" "}
                              g
                            </span>
                          </>
                        ) : null}
                      </p>
                    ) : null}
                  </div>
                );
              })
            )}
            <div className="flex flex-wrap items-end justify-between gap-3 border-t pt-3">
              <div className="w-full space-y-1.5 sm:max-w-[220px]">
                <Label htmlFor="discount">Descuento ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Ej. 1000"
                />
                <p className="text-xs text-muted-foreground">
                  Promos del flyer: ej. 2 kg milanesa → subtotal $18.000, descuento $1.000.
                </p>
              </div>
              <div className="space-y-0.5 text-right text-sm">
                <p className="tabular-nums text-muted-foreground">
                  Subtotal: {formatCurrency(subtotal)}
                </p>
                <p className="font-semibold tabular-nums">Total: {formatCurrency(total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[320px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Pagos</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setPayments((rows) => [...rows, { method: "cash", amount: String(total || "") }])
              }
            >
              Agregar pago
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.map((row, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                <div className="space-y-1.5">
                  {index === 0 ? <Label>Método</Label> : null}
                  <select
                    value={row.method}
                    onChange={(e) =>
                      updatePayment(index, { method: e.target.value as PaymentMethod })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {PAYMENT_METHOD_LABELS[method]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  {index === 0 ? <Label>Monto</Label> : null}
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={row.amount}
                    onChange={(e) => updatePayment(index, { amount: e.target.value })}
                  />
                </div>
                <div className={index === 0 ? "flex items-end pb-0.5" : "flex items-center"}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={payments.length <= 1}
                    onClick={() => setPayments((rows) => rows.filter((_, i) => i !== index))}
                  >
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
              <span className="tabular-nums">Pagos: {formatCurrency(paymentsSum)}</span>
              {Math.abs(total - paymentsSum) > 0.01 ? (
                <span className="text-destructive">
                  Diferencia: {formatCurrency(total - paymentsSum)}
                </span>
              ) : (
                <span className="text-success">Pagos = total</span>
              )}
            </div>
            {payments.length === 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setPayments([{ method: payments[0]?.method ?? "cash", amount: String(total) }])
                }
              >
                Completar con total
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Opcional"
            maxLength={500}
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" variant="accent" disabled={loading || products.length === 0}>
          {loading ? "Guardando…" : "Registrar venta"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/ventas")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
