import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface ReportsFiltersProps {
  from: string;
  to: string;
}

export function ReportsFilters({ from, to }: ReportsFiltersProps) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="from">Desde</Label>
        <Input id="from" name="from" type="date" defaultValue={from} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to">Hasta</Label>
        <Input id="to" name="to" type="date" defaultValue={to} required />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit">Filtrar</Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/reportes">Hoy</Link>
        </Button>
      </div>
    </form>
  );
}
