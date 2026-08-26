/** Traduce errores comunes de Postgres/Supabase a mensajes de negocio. */
export function mapSupabaseBusinessError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("products_stock_check") || lower.includes("stock_check")) {
    return "Stock insuficiente. Cargá mercadería en Compras o ajustá stock antes de vender.";
  }
  if (lower.includes("stock insuficiente")) {
    return message;
  }
  if (lower.includes("pagos") && lower.includes("total")) {
    return "La suma de los pagos debe coincidir con el total.";
  }
  if (lower.includes("ya hay una caja abierta")) {
    return "Ya hay una caja abierta.";
  }
  if (lower.includes("no hay caja abierta")) {
    return "No hay caja abierta.";
  }
  if (lower.includes("venta ya anulada")) {
    return "Esa venta ya fue anulada.";
  }

  return message;
}
