-- =============================================================================
-- Mejora mensaje de stock insuficiente (antes fallaba el CHECK products_stock_check)
-- Supabase SQL Editor → Run
-- =============================================================================

CREATE OR REPLACE FUNCTION public._apply_product_stock(
  p_product_id UUID,
  p_delta NUMERIC,
  p_movement_type public.stock_movement_type,
  p_sale_id UUID DEFAULT NULL,
  p_purchase_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_kind public.product_kind;
  v_name TEXT;
  v_stock NUMERIC;
  v_stock_after NUMERIC;
  v_combo RECORD;
BEGIN
  SELECT kind, name, stock INTO v_kind, v_name, v_stock
  FROM public.products WHERE id = p_product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;

  IF v_kind = 'simple' THEN
    v_stock_after := v_stock + p_delta;

    IF v_stock_after < 0 THEN
      RAISE EXCEPTION
        'Stock insuficiente para "%" (disponible: %, intento: %)',
        v_name, v_stock, p_delta;
    END IF;

    UPDATE public.products
    SET stock = v_stock_after, updated_at = NOW()
    WHERE id = p_product_id;

    INSERT INTO public.stock_movements (
      product_id, quantity, type, stock_after, sale_id, purchase_id, notes, created_by
    ) VALUES (
      p_product_id, p_delta, p_movement_type, v_stock_after,
      p_sale_id, p_purchase_id, p_notes, auth.uid()
    );
  ELSE
    FOR v_combo IN
      SELECT component_id, quantity AS component_qty
      FROM public.combo_components WHERE combo_id = p_product_id
    LOOP
      PERFORM public._apply_product_stock(
        v_combo.component_id, p_delta * v_combo.component_qty,
        p_movement_type, p_sale_id, p_purchase_id, p_notes
      );
    END LOOP;
  END IF;
END;
$$;
