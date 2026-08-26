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
import { gramsToKg } from "@/shared/utils/weight";

import { createPurchaseAction } from "./purchase.actions";

interface ProductOption {
  id: string;
  name: string;
}

interface ItemRow {
  productId: string;
  quantity: string;
  unitCost: string;
}

interface PaymentRow {
  method: PaymentMethod;
  amount: string;
}

interface PurchaseFormProps {
  products: ProductOption[];
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function PurchaseForm({ products }: PurchaseFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemRow[]>([
    { productId: "", quantity: "", unitCost: "" },
  ]);
  const [payments, setPayments] = useState<PaymentRow[]>([
    { method: "cash", amount: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () =>
      roundMoney(
        items.reduce((sum, row) => {
          const grams = Number(row.quantity);
          const cost = Number(row.unitCost);
          if (!row.productId || !Number.isFinite(grams) || !Number.isFinite(cost)) return sum;
          return sum + gramsToKg(grams) * cost;
        }, 0)
      ),
    [items]
  );

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

  function updatePayment(index: number, patch: Partial<PaymentRow>) {
    setPayments((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await createPurchaseAction({
      items: items
        .filter((row) => row.productId)
        .map((row) => ({
          productId: row.productId,
          quantity: gramsToKg(Number(row.quantity)),
          unitCost: Number(row.unitCost),
        })),
      payments: payments.map((row) => ({
        method: row.method,
        amount: Number(row.amount),
      })),
      notes: notes.trim() || null,
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Compra registrada");
    router.push("/compras");
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
                Ingresá los <span className="font-medium">gramos</span> (ej. 10000 = 10 kg). Suma al
                stock.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() =>
                setItems((rows) => [...rows, { productId: "", quantity: "", unitCost: "" }])
              }
            >
              Agregar ítem
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay productos simples activos. Creá productos antes de comprar.
              </p>
            ) : (
              items.map((row, index) => (
                <div key={index} className="space-y-2 rounded-md border border-border/70 p-3">
                  <div className="grid gap-2 sm:grid-cols-[1fr_100px_110px_auto]">
                    <div className="space-y-1.5">
                      {index === 0 ? <Label>Producto</Label> : null}
                      <select
                        value={row.productId}
                        required
                        onChange={(e) => updateItem(index, { productId: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Elegir producto</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
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
                        placeholder="Ej. 10000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      {index === 0 ? <Label>Costo / kg</Label> : null}
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={row.unitCost}
                        onChange={(e) => updateItem(index, { unitCost: e.target.value })}
                        placeholder="Ej. 6000"
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
                </div>
              ))
            )}
            <div className="border-t pt-3 text-right text-sm">
              <p className="font-semibold tabular-nums">Total: {formatCurrency(total)}</p>
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
            placeholder="Proveedor, remito, etc. (opcional)"
            maxLength={500}
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" variant="accent" disabled={loading || products.length === 0}>
          {loading ? "Guardando…" : "Registrar compra"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/compras")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
