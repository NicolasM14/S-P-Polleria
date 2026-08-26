"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createExpenseAction } from "./expense.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface CategoryOption {
  id: string;
  name: string;
}

interface ExpenseFormProps {
  categories: CategoryOption[];
}

function defaultOccurredAtLocal(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function ExpenseForm({ categories }: ExpenseFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [fromCash, setFromCash] = useState(false);
  const [occurredAt, setOccurredAt] = useState(defaultOccurredAtLocal);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await createExpenseAction({
      categoryId,
      amount: Number(amount),
      description: description.trim() || "",
      fromCash,
      occurredAt: occurredAt || null,
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Gasto registrado");
    router.push("/gastos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="categoryId">Categoría</Label>
        <select
          id="categoryId"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Elegir categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Monto</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej. pago de gas, limpieza…"
          maxLength={500}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="occurredAt">Fecha</Label>
        <Input
          id="occurredAt"
          type="datetime-local"
          required
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
        />
      </div>

      <div className="space-y-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
        <p className="text-sm font-medium text-foreground">Caja</p>
        <p className="text-xs text-muted-foreground">
          Por defecto el gasto <span className="font-medium">no</span> se descuenta del cajón.
          Marcá la opción solo si salió plata en efectivo.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fromCash}
            onChange={(e) => setFromCash(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Descontar de caja (efectivo)
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          variant="accent"
          disabled={loading || categories.length === 0}
        >
          {loading ? "Guardando…" : "Registrar gasto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/gastos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
