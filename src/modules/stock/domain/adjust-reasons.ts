export const STOCK_ADJUST_REASONS = [
  { value: "Inventario inicial", label: "Inventario inicial" },
  { value: "Corrección de conteo", label: "Corrección de conteo" },
  { value: "Merma / vencido", label: "Merma / vencido" },
  { value: "Rotura / descarte", label: "Rotura / descarte" },
  { value: "Diferencia de inventario", label: "Diferencia de inventario" },
  { value: "Devolución / reingreso", label: "Devolución / reingreso" },
  { value: "other", label: "Otro (especificar)" },
] as const;

export type StockAdjustReasonValue = (typeof STOCK_ADJUST_REASONS)[number]["value"];

export const STOCK_ADJUST_REASON_VALUES = STOCK_ADJUST_REASONS.map((r) => r.value) as [
  StockAdjustReasonValue,
  ...StockAdjustReasonValue[],
];
