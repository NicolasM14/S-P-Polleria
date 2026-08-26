import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface ProductsFiltersProps {
  search?: string;
  kind?: string;
  active?: string;
}

export function ProductsFilters({ search, kind = "all", active = "active" }: ProductsFiltersProps) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-4">
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          name="search"
          placeholder="Nombre del producto"
          defaultValue={search ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="kind">Tipo</Label>
        <select
          id="kind"
          name="kind"
          defaultValue={kind}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">Todos</option>
          <option value="simple">Simples</option>
          <option value="combo">Combos</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="active">Estado</Label>
        <select
          id="active"
          name="active"
          defaultValue={active}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="all">Todos</option>
        </select>
      </div>
      <div className="flex items-end gap-2 md:col-span-4">
        <Button type="submit">Filtrar</Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/productos">Limpiar</Link>
        </Button>
      </div>
    </form>
  );
}
