"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { closeCashSessionAction } from "./cash.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatCurrency } from "@/shared/utils/format-currency";

interface CloseCashFormProps {
  expectedBalance: number;
}

export function CloseCashForm({ expectedBalance }: CloseCashFormProps) {
  const router = useRouter();
  const [countedAmount, setCountedAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const counted = Number(countedAmount);
  const previewDifference =
    countedAmount !== "" && Number.isFinite(counted) ? counted - expectedBalance : null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await closeCashSessionAction({
      countedAmount: Number(countedAmount),
      notes: notes.trim() || null,
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Caja cerrada");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="countedAmount">Efectivo contado</Label>
        <Input
          id="countedAmount"
          type="number"
          min="0"
          step="0.01"
          required
          value={countedAmount}
          onChange={(e) => setCountedAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Diferencia estimada</Label>
        <p className="flex h-10 items-center text-sm tabular-nums text-muted-foreground">
          {previewDifference === null
            ? "—"
            : `${previewDifference >= 0 ? "+" : ""}${formatCurrency(previewDifference)}`}
        </p>
        <p className="text-xs text-muted-foreground">
          Esperado: {formatCurrency(expectedBalance)}
        </p>
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="closeNotes">Notas (opcional)</Label>
        <Input
          id="closeNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones del arqueo"
          maxLength={500}
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Cerrando…" : "Cerrar caja"}
        </Button>
      </div>
    </form>
  );
}
