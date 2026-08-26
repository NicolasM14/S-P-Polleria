"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { openCashSessionAction } from "./cash.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { parseOptionalNumber } from "@/shared/utils/number-input";

export function OpenCashForm() {
  const router = useRouter();
  const [openingAmount, setOpeningAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const result = await openCashSessionAction({
      openingAmount: parseOptionalNumber(openingAmount),
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
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="openingAmount">Efectivo inicial</Label>
        <Input
          id="openingAmount"
          type="number"
          min="0"
          step="0.01"
          value={openingAmount}
          onChange={(e) => setOpeningAmount(e.target.value)}
          placeholder="Ej. 10000"
          className="tabular-nums"
        />
      </div>
      <Button type="submit" variant="accent" disabled={loading} className="shrink-0">
        {loading ? "Abriendo…" : "Abrir caja"}
      </Button>
    </form>
  );
}
