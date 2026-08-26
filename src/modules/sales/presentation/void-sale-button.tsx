"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import { voidSaleAction } from "./sale.actions";

interface VoidSaleButtonProps {
  saleId: string;
}

export function VoidSaleButton({ saleId }: VoidSaleButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      "¿Anular esta venta? Se revertirá stock y el efectivo en caja (si hay sesión abierta)."
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await voidSaleAction({ saleId });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Venta anulada");
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? "Anulando…" : "Anular"}
    </Button>
  );
}
