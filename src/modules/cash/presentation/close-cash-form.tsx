"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { closeCashSessionAction } from "./cash.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatCurrency } from "@/shared/utils/format-currency";
import { cn } from "@/shared/lib/utils";

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

  const diffLabel =
    previewDifference === null
      ? null
      : previewDifference === 0
        ? "Cuadra"
        : previewDifference > 0
          ? "Sobra"
          : "Falta";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="countedAmount">Contado en el cajón</Label>
          <Input
            id="countedAmount"
            type="number"
            min="0"
            step="0.01"
            required
            value={countedAmount}
            onChange={(e) => setCountedAmount(e.target.value)}
            placeholder="Ej. 25400"
            className="tabular-nums"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Diferencia</Label>
          <div
            className={cn(
              "flex h-10 items-center rounded-md border px-3 text-sm tabular-nums",
              previewDifference === null
                ? "border-input text-muted-foreground"
                : previewDifference === 0
                  ? "border-success/40 bg-success/5 font-semibold text-success"
                  : previewDifference > 0
                    ? "border-success/40 bg-success/5 font-semibold text-success"
                    : "border-destructive/40 bg-destructive/5 font-semibold text-destructive"
            )}
          >
            {previewDifference === null
              ? "—"
              : `${diffLabel} ${previewDifference > 0 ? "+" : ""}${formatCurrency(previewDifference)}`}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="closeNotes">Nota (opcional)</Label>
        <Input
          id="closeNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones del arqueo"
          maxLength={500}
        />
      </div>

      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? "Cerrando…" : "Cerrar caja"}
      </Button>
    </form>
  );
}
