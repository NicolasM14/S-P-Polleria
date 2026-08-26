"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createCategoryAction } from "./product.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface CategoryOption {
  id: string;
  name: string;
}

interface CreateCategoryFormProps {
  categories: CategoryOption[];
}

export function CreateCategoryForm({ categories }: CreateCategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await createCategoryAction({ name });
    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Categoría creada");
    setName("");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">Categorías</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Predeterminadas: {categories.map((c) => c.name).join(", ") || "ninguna"}.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
        <div className="min-w-[200px] flex-1 space-y-1.5">
          <Label htmlFor="category-name">Nueva categoría</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Postres"
            required
          />
        </div>
        <Button type="submit" variant="outline" disabled={loading}>
          {loading ? "Creando…" : "Agregar"}
        </Button>
      </form>
    </div>
  );
}
