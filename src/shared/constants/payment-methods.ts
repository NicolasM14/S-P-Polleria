export const PAYMENT_METHODS = ["cash", "transfer", "card", "other"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  other: "Otro",
};
