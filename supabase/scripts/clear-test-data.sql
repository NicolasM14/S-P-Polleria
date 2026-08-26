-- =============================================================================
-- S&F Pollería — Borrar datos de prueba (operaciones)
-- =============================================================================
-- Dónde: Supabase → SQL Editor → New query → pegar → Run
--
-- ✅ BORRA: ventas, compras, gastos, caja, movimientos de stock
-- ✅ DEJA: usuarios (Auth), perfiles, categorías, productos (stock → 0)
-- ❌ NO toca: esquema, funciones RPC, RLS
--
-- ⚠️ IRREVERSIBLE. Hacé backup o exportá antes si dudás.
-- =============================================================================

BEGIN;

-- 1) Caja y movimientos (dependen de ventas/compras/gastos)
DELETE FROM public.cash_movements;
DELETE FROM public.cash_sessions;

-- 2) Historial de stock (referencia ventas/compras)
DELETE FROM public.stock_movements;

-- 3) Ventas y compras (ítems y pagos se borran en cascada)
DELETE FROM public.sale_payments;
DELETE FROM public.sale_items;
DELETE FROM public.sales;

DELETE FROM public.purchase_payments;
DELETE FROM public.purchase_items;
DELETE FROM public.purchases;

-- 4) Gastos
DELETE FROM public.expenses;

-- 5) Stock de productos en cero (catálogo queda)
UPDATE public.products SET stock = 0, updated_at = NOW();

COMMIT;

-- Verificación rápida (deberían dar 0):
-- SELECT COUNT(*) FROM sales;
-- SELECT COUNT(*) FROM purchases;
-- SELECT COUNT(*) FROM expenses;
-- SELECT COUNT(*) FROM cash_sessions;
-- SELECT COUNT(*) FROM stock_movements;
-- SELECT SUM(stock) FROM products;


-- =============================================================================
-- OPCIONAL — También borrar productos y categorías de prueba
-- Descomentá SOLO si querés empezar el catálogo de cero.
-- Las categorías seed (Pollos, Guarniciones, etc.) se pueden volver a crear
-- desde la app o con el INSERT del final.
-- =============================================================================

/*
BEGIN;

DELETE FROM public.combo_components;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Categorías iniciales (como en la migración)
INSERT INTO public.categories (name, sort_order) VALUES
  ('Pollos', 1),
  ('Guarniciones', 2),
  ('Bebidas', 3),
  ('Otros', 99)
ON CONFLICT (name) DO NOTHING;

COMMIT;
*/
