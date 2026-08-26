-- Borra productos de oferta si se cargaron antes (las promos van como descuento en la venta).
BEGIN;

DELETE FROM public.combo_components
WHERE combo_id IN (
  SELECT id FROM public.products
  WHERE name IN ('2 kg Milanesa (oferta)', '2 kg Menudo (oferta)')
);

DELETE FROM public.products
WHERE name IN ('2 kg Milanesa (oferta)', '2 kg Menudo (oferta)');

DELETE FROM public.categories
WHERE name = 'Ofertas especiales'
  AND NOT EXISTS (
    SELECT 1 FROM public.products p WHERE p.category_id = categories.id
  );

COMMIT;
