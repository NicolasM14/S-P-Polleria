export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Cargando">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded-md bg-muted" />
        <div className="h-4 w-64 max-w-full rounded-md bg-muted/70" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-28 rounded-lg border border-border bg-card" />
        <div className="h-28 rounded-lg border border-border bg-card" />
        <div className="h-28 rounded-lg border border-border bg-card" />
      </div>
      <div className="h-64 rounded-lg border border-border bg-card" />
    </div>
  );
}
