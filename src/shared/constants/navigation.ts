const MODULES = [
  "auth",
  "products",
  "stock",
  "purchases",
  "sales",
  "cash",
  "expenses",
  "reports",
] as const;

export const APP_MODULES = MODULES;

export type AppModule = (typeof MODULES)[number];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/stock", label: "Stock" },
  { href: "/compras", label: "Compras" },
  { href: "/ventas", label: "Ventas" },
  { href: "/caja", label: "Caja" },
  { href: "/gastos", label: "Gastos" },
  { href: "/reportes", label: "Reportes" },
] as const;
