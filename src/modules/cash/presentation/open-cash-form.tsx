"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { openCashSessionAction } from "./cash.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function OpenCashForm() {
  const router = useRouter();
  const [openingAmount, setOpeningAmount] = useState("0");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await openCashSessionAction({
      openingAmount: Number(openingAmount),
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Caja abierta");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-md gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="openingAmount">Monto de apertura</Label>
        <Input
          id="openingAmount"
          type="number"
          min="0"
          step="0.01"
          required
          value={openingAmount}
          onChange={(e) => setOpeningAmount(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Efectivo físico al iniciar el turno. Puede ser 0.
        </p>
      </div>
      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? "Abriendo…" : "Abrir caja"}
      </Button>
    </form>
  );
}
