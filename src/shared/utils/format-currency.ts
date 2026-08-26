export function formatCurrency(amount: number, locale = "es-AR", currency = "ARS") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
