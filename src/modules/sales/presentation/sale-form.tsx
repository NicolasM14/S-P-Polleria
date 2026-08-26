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

import { createSaleAction } from "./sale.actions";

interface ProductOption {
  id: string;
  name: string;
  kind: "simple" | "combo";
  saleUnit: "kg" | "unit";
  price: number;
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
    { productId: "", quantity: "1", unitPrice: "0" },
  ]);
  const [payments, setPayments] = useState<PaymentRow[]>([
    { method: "cash", amount: "" },
  ]);
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () =>
      roundMoney(
        items.reduce((sum, row) => {
          const qty = Number(row.quantity);
          const price = Number(row.unitPrice);
          if (!row.productId || !Number.isFinite(qty) || !Number.isFinite(price)) return sum;
          return sum + qty * price;
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
      unitPrice: product ? String(product.price) : "0",
      quantity: product?.saleUnit === "kg" ? "1" : "1",
    });
  }

  function updatePayment(index: number, patch: Partial<PaymentRow>) {
    setPayments((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await createSaleAction({
      items: items
        .filter((row) => row.productId)
        .map((row) => ({
          productId: row.productId,
          quantity: Number(row.quantity),
          unitPrice: Number(row.unitPrice),
        })),
      payments: payments.map((row) => ({
        method: row.method,
        amount: Number(row.amount),
      })),
      discount: discountValue,
      notes: notes.trim() || null,
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Ítems</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((rows) => [...rows, { productId: "", quantity: "1", unitPrice: "0" }])
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
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_110px_130px_auto]">
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
                          {p.name} · {p.kind === "combo" ? "combo" : p.saleUnit} ·{" "}
                          {formatCurrency(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    {index === 0 ? <Label>Cantidad</Label> : null}
                    <Input
                      type="number"
                      min={selected?.saleUnit === "unit" ? "1" : "0.001"}
                      step={selected?.saleUnit === "unit" ? "1" : "0.001"}
                      required
                      value={row.quantity}
                      onChange={(e) => updateItem(index, { quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {index === 0 ? <Label>Precio unit.</Label> : null}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={row.unitPrice}
                      onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                    />
                  </div>
                  <div className={index === 0 ? "pt-7" : ""}>
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
              );
            })
          )}
          <div className="space-y-1.5 sm:max-w-xs">
            <Label htmlFor="discount">Descuento</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="space-y-1 text-sm">
            <p className="tabular-nums">Subtotal: {formatCurrency(subtotal)}</p>
            <p className="font-medium tabular-nums">Total: {formatCurrency(total)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
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
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
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
              <div className={index === 0 ? "pt-7" : ""}>
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
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
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

      <Card>
        <CardHeader>
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
