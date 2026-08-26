-- =============================================================================
-- S&F Pollería — Catálogo según lista de precios (flyer)
-- =============================================================================
-- Dónde: Supabase → SQL Editor → New query → pegar → Run
--
-- Carga categorías y productos con precios del local.
-- Idempotente: no duplica productos que ya existan con el mismo nombre.
-- Stock inicial: 0 (cargar con Compras o ajustes en Stock).
-- =============================================================================

BEGIN;

-- Categorías (como en el flyer)
INSERT INTO public.categories (name, sort_order) VALUES
  ('Por kilo', 1),
  ('Elaborados', 2),
  ('Huevos', 3)
ON CONFLICT (name) DO UPDATE SET sort_order = EXCLUDED.sort_order;

-- Por kilo ($/kg)
INSERT INTO public.products (category_id, name, kind, sale_unit, price, stock, min_stock, is_active)
SELECT c.id, v.name, 'simple', 'kg', v.price, 0, 0, TRUE
FROM public.categories c
CROSS JOIN (VALUES
  ('Milanesa', 9000::numeric),
  ('Alitas', 4000),
  ('Pata muslo', 5000),
  ('Trozado de pollo', 5800),
  ('Pechuga', 14000),
  ('Menudo', 2500),
  ('Puchero', 2000),
  ('Pollo entero', 5500)
) AS v(name, price)
WHERE c.name = 'Por kilo'
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.name = v.name);

-- Elaborados ($/kg)
INSERT INTO public.products (category_id, name, kind, sale_unit, price, stock, min_stock, is_active)
SELECT c.id, v.name, 'simple', 'kg', v.price, 0, 0, TRUE
FROM public.categories c
CROSS JOIN (VALUES
  ('Albóndigas', 6500::numeric),
  ('Albóndigas rellenas', 7000),
  ('Kupi común', 7500),
  ('Kupi relleno', 8000),
  ('Crocantes común', 7500),
  ('Crocantes rellenos', 7500)
) AS v(name, price)
WHERE c.name = 'Elaborados'
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.name = v.name);

-- Huevos: maple 30 unidades — precio por unidad (maple)
INSERT INTO public.products (category_id, name, kind, sale_unit, price, stock, min_stock, is_active)
SELECT c.id, 'Maple huevos selección (30 u.)', 'simple', 'unit', 6000, 0, 0, TRUE
FROM public.categories c
WHERE c.name = 'Huevos'
  AND NOT EXISTS (
    SELECT 1 FROM public.products p WHERE p.name = 'Maple huevos selección (30 u.)'
  );

COMMIT;

-- Verificación:
-- SELECT c.name AS categoria, p.name, p.price, p.sale_unit, p.stock
-- FROM products p
-- LEFT JOIN categories c ON c.id = p.category_id
-- ORDER BY c.sort_order, p.name;
