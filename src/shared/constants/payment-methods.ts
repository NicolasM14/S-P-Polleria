/** Métodos que se pueden elegir al registrar venta/compra. */
export const PAYMENT_METHODS = ["cash", "transfer"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Valores históricos en DB (tarjeta/otro) por si aparecen en listados. */
export type StoredPaymentMethod = PaymentMethod | "card" | "other";

export const PAYMENT_METHOD_LABELS: Record<StoredPaymentMethod, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  other: "Otro",
};
