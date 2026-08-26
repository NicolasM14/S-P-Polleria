-- =============================================================================
-- S&F Pollería — RESET COMPLETO + esquema + RLS + RPC
-- ⚠️ BORRA TODAS las tablas y datos de public. Los usuarios Auth se conservan.
-- Supabase → SQL Editor → pegar TODO → Run (una sola vez)
-- =============================================================================

-- 1) Limpiar schema public
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Enums
CREATE TYPE public.user_role AS ENUM ('owner', 'employee');
CREATE TYPE public.product_kind AS ENUM ('simple', 'combo');
CREATE TYPE public.sale_unit AS ENUM ('kg', 'unit');
CREATE TYPE public.payment_method AS ENUM ('cash', 'transfer', 'card', 'other');
CREATE TYPE public.sale_status AS ENUM ('completed', 'voided');
CREATE TYPE public.stock_movement_type AS ENUM ('purchase', 'sale', 'sale_void', 'adjustment');
CREATE TYPE public.cash_session_status AS ENUM ('open', 'closed');
CREATE TYPE public.cash_movement_type AS ENUM (
  'opening', 'sale', 'purchase', 'expense', 'manual_in', 'manual_out'
);

-- 3) Tablas
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role public.user_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories (id),
  name TEXT NOT NULL,
  kind public.product_kind NOT NULL DEFAULT 'simple',
  sale_unit public.sale_unit NOT NULL DEFAULT 'kg',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.combo_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  UNIQUE (combo_id, component_id),
  CHECK (combo_id <> component_id)
);

CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products (id),
  product_name TEXT NOT NULL,
  sale_unit public.sale_unit NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE public.purchase_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases (id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)
);

CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sold_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status public.sale_status NOT NULL DEFAULT 'completed',
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  voided_at TIMESTAMPTZ,
  voided_by UUID REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (voided_at IS NULL AND voided_by IS NULL)
    OR (voided_at IS NOT NULL AND voided_by IS NOT NULL)
  )
);

CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products (id),
  product_name TEXT NOT NULL,
  product_kind public.product_kind NOT NULL,
  sale_unit public.sale_unit NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
  recipe_snapshot JSONB
);

CREATE TABLE public.sale_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)
);

CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id),
  quantity NUMERIC(12, 3) NOT NULL,
  type public.stock_movement_type NOT NULL,
  stock_after NUMERIC(12, 3) NOT NULL,
  sale_id UUID REFERENCES public.sales (id),
  purchase_id UUID REFERENCES public.purchases (id),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_product ON public.stock_movements (product_id, created_at DESC);

CREATE TABLE public.cash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status public.cash_session_status NOT NULL DEFAULT 'open',
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_by UUID NOT NULL REFERENCES public.profiles (id),
  opening_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (opening_amount >= 0),
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES public.profiles (id),
  expected_amount NUMERIC(12, 2),
  counted_amount NUMERIC(12, 2),
  difference NUMERIC(12, 2),
  notes TEXT
);

CREATE UNIQUE INDEX idx_one_open_cash_session ON public.cash_sessions (status)
  WHERE status = 'open';

CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.expense_categories (id),
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  from_cash BOOLEAN NOT NULL DEFAULT TRUE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_session_id UUID NOT NULL REFERENCES public.cash_sessions (id),
  type public.cash_movement_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  sale_id UUID REFERENCES public.sales (id),
  purchase_id UUID REFERENCES public.purchases (id),
  expense_id UUID REFERENCES public.expenses (id),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cash_movements_session ON public.cash_movements (cash_session_id, created_at);

-- 4) Trigger perfil al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::public.user_role, 'owner')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Recrear perfiles para usuarios Auth ya existentes
INSERT INTO public.profiles (id, full_name, role)
SELECT
  id,
  COALESCE(raw_user_meta_data ->> 'full_name', split_part(email, '@', 1)),
  COALESCE((raw_user_meta_data ->> 'role')::public.user_role, 'owner')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 5) Helpers
CREATE OR REPLACE FUNCTION public.is_authenticated_member()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()); $$;

CREATE OR REPLACE FUNCTION public.get_open_cash_session_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT id FROM public.cash_sessions WHERE status = 'open' LIMIT 1; $$;

-- 6) Stock (simple o combo)
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

CREATE OR REPLACE FUNCTION public.adjust_stock(
  p_product_id UUID, p_quantity NUMERIC, p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_movement_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  IF p_quantity = 0 THEN RAISE EXCEPTION 'Cantidad no puede ser 0'; END IF;
  PERFORM public._apply_product_stock(p_product_id, p_quantity, 'adjustment', NULL, NULL, p_notes);
  SELECT id INTO v_movement_id FROM public.stock_movements
  WHERE product_id = p_product_id ORDER BY created_at DESC LIMIT 1;
  RETURN v_movement_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.open_cash_session(p_opening_amount NUMERIC DEFAULT 0)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  IF EXISTS (SELECT 1 FROM public.cash_sessions WHERE status = 'open') THEN
    RAISE EXCEPTION 'Ya hay una caja abierta';
  END IF;
  INSERT INTO public.cash_sessions (opened_by, opening_amount, status)
  VALUES (auth.uid(), COALESCE(p_opening_amount, 0), 'open')
  RETURNING id INTO v_session_id;
  IF COALESCE(p_opening_amount, 0) <> 0 THEN
    INSERT INTO public.cash_movements (cash_session_id, type, amount, notes, created_by)
    VALUES (v_session_id, 'opening', p_opening_amount, 'Apertura', auth.uid());
  END IF;
  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.close_cash_session(p_counted_amount NUMERIC, p_notes TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_session public.cash_sessions%ROWTYPE; v_expected NUMERIC;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  SELECT * INTO v_session FROM public.cash_sessions WHERE status = 'open' LIMIT 1 FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'No hay caja abierta'; END IF;
  SELECT COALESCE(SUM(amount), 0) INTO v_expected FROM public.cash_movements WHERE cash_session_id = v_session.id;
  UPDATE public.cash_sessions SET
    status = 'closed', closed_at = NOW(), closed_by = auth.uid(),
    counted_amount = p_counted_amount, expected_amount = v_expected,
    difference = p_counted_amount - v_expected, notes = p_notes
  WHERE id = v_session.id;
  RETURN v_session.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_purchase(
  p_items JSONB, p_payments JSONB, p_notes TEXT DEFAULT NULL, p_purchased_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_purchase_id UUID; v_item JSONB; v_payment JSONB;
  v_total NUMERIC := 0; v_payments_sum NUMERIC := 0; v_line_total NUMERIC;
  v_product RECORD; v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  IF jsonb_array_length(p_items) = 0 THEN RAISE EXCEPTION 'La compra debe tener al menos un ítem'; END IF;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_total := v_total + (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_cost')::NUMERIC;
  END LOOP;
  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments) LOOP
    v_payments_sum := v_payments_sum + (v_payment ->> 'amount')::NUMERIC;
  END LOOP;
  IF v_payments_sum <> v_total THEN RAISE EXCEPTION 'Pagos (%) ≠ total (%)', v_payments_sum, v_total; END IF;
  INSERT INTO public.purchases (purchased_at, total, notes, created_by)
  VALUES (p_purchased_at, v_total, p_notes, auth.uid()) RETURNING id INTO v_purchase_id;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, sale_unit, kind INTO v_product FROM public.products WHERE id = (v_item ->> 'product_id')::UUID;
    IF v_product.kind <> 'simple' THEN RAISE EXCEPTION 'Solo productos simples en compras'; END IF;
    v_line_total := (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_cost')::NUMERIC;
    INSERT INTO public.purchase_items (purchase_id, product_id, product_name, sale_unit, quantity, unit_cost, line_total)
    VALUES (v_purchase_id, v_product.id, v_product.name, v_product.sale_unit,
      (v_item ->> 'quantity')::NUMERIC, (v_item ->> 'unit_cost')::NUMERIC, v_line_total);
    PERFORM public._apply_product_stock(v_product.id, (v_item ->> 'quantity')::NUMERIC, 'purchase', NULL, v_purchase_id, NULL);
  END LOOP;
  v_session_id := public.get_open_cash_session_id();
  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments) LOOP
    INSERT INTO public.purchase_payments (purchase_id, method, amount)
    VALUES (v_purchase_id, (v_payment ->> 'method')::public.payment_method, (v_payment ->> 'amount')::NUMERIC);
    IF (v_payment ->> 'method') = 'cash' AND v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (cash_session_id, type, amount, purchase_id, created_by)
      VALUES (v_session_id, 'purchase', -(v_payment ->> 'amount')::NUMERIC, v_purchase_id, auth.uid());
    END IF;
  END LOOP;
  RETURN v_purchase_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_sale(
  p_items JSONB, p_payments JSONB, p_discount NUMERIC DEFAULT 0,
  p_notes TEXT DEFAULT NULL, p_sold_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_sale_id UUID; v_item JSONB; v_payment JSONB;
  v_subtotal NUMERIC := 0; v_total NUMERIC; v_payments_sum NUMERIC := 0; v_line_total NUMERIC;
  v_product RECORD; v_recipe JSONB; v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_subtotal := v_subtotal + (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_price')::NUMERIC;
  END LOOP;
  v_total := v_subtotal - COALESCE(p_discount, 0);
  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments) LOOP
    v_payments_sum := v_payments_sum + (v_payment ->> 'amount')::NUMERIC;
  END LOOP;
  IF v_payments_sum <> v_total THEN RAISE EXCEPTION 'Pagos (%) ≠ total (%)', v_payments_sum, v_total; END IF;
  INSERT INTO public.sales (sold_at, status, subtotal, discount, total, notes, created_by)
  VALUES (p_sold_at, 'completed', v_subtotal, COALESCE(p_discount, 0), v_total, p_notes, auth.uid())
  RETURNING id INTO v_sale_id;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT * INTO v_product FROM public.products WHERE id = (v_item ->> 'product_id')::UUID;
    v_line_total := (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_price')::NUMERIC;
    v_recipe := NULL;
    IF v_product.kind = 'combo' THEN
      SELECT jsonb_agg(jsonb_build_object('component_id', component_id, 'quantity', quantity))
      INTO v_recipe FROM public.combo_components WHERE combo_id = v_product.id;
    END IF;
    INSERT INTO public.sale_items (
      sale_id, product_id, product_name, product_kind, sale_unit, quantity, unit_price, line_total, recipe_snapshot
    ) VALUES (
      v_sale_id, v_product.id, v_product.name, v_product.kind, v_product.sale_unit,
      (v_item ->> 'quantity')::NUMERIC, (v_item ->> 'unit_price')::NUMERIC, v_line_total, v_recipe
    );
    PERFORM public._apply_product_stock(
      v_product.id, -(v_item ->> 'quantity')::NUMERIC, 'sale', v_sale_id, NULL, NULL
    );
  END LOOP;
  v_session_id := public.get_open_cash_session_id();
  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments) LOOP
    INSERT INTO public.sale_payments (sale_id, method, amount)
    VALUES (v_sale_id, (v_payment ->> 'method')::public.payment_method, (v_payment ->> 'amount')::NUMERIC);
    IF (v_payment ->> 'method') = 'cash' AND v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (cash_session_id, type, amount, sale_id, created_by)
      VALUES (v_session_id, 'sale', (v_payment ->> 'amount')::NUMERIC, v_sale_id, auth.uid());
    END IF;
  END LOOP;
  RETURN v_sale_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.void_sale(p_sale_id UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_sale public.sales%ROWTYPE; v_item RECORD; v_payment RECORD; v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  SELECT * INTO v_sale FROM public.sales WHERE id = p_sale_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Venta no encontrada'; END IF;
  IF v_sale.voided_at IS NOT NULL THEN RAISE EXCEPTION 'Venta ya anulada'; END IF;
  FOR v_item IN SELECT * FROM public.sale_items WHERE sale_id = p_sale_id LOOP
    PERFORM public._apply_product_stock(v_item.product_id, v_item.quantity, 'sale_void', p_sale_id, NULL, 'Anulación');
  END LOOP;
  v_session_id := public.get_open_cash_session_id();
  FOR v_payment IN SELECT * FROM public.sale_payments WHERE sale_id = p_sale_id AND method = 'cash' LOOP
    IF v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (cash_session_id, type, amount, sale_id, created_by, notes)
      VALUES (v_session_id, 'sale', -v_payment.amount, p_sale_id, auth.uid(), 'Anulación venta');
    END IF;
  END LOOP;
  UPDATE public.sales SET status = 'voided', voided_at = NOW(), voided_by = auth.uid() WHERE id = p_sale_id;
  RETURN p_sale_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_expense(
  p_category_id UUID, p_amount NUMERIC, p_description TEXT,
  p_from_cash BOOLEAN DEFAULT TRUE, p_occurred_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_expense_id UUID; v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN RAISE EXCEPTION 'No autenticado'; END IF;
  INSERT INTO public.expenses (category_id, description, amount, from_cash, occurred_at, created_by)
  VALUES (p_category_id, p_description, p_amount, COALESCE(p_from_cash, TRUE), p_occurred_at, auth.uid())
  RETURNING id INTO v_expense_id;
  IF COALESCE(p_from_cash, TRUE) THEN
    v_session_id := public.get_open_cash_session_id();
    IF v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (cash_session_id, type, amount, expense_id, created_by)
      VALUES (v_session_id, 'expense', -p_amount, v_expense_id, auth.uid());
    END IF;
  END IF;
  RETURN v_expense_id;
END;
$$;

-- 7) RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_all ON public.profiles FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY categories_all ON public.categories FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY products_all ON public.products FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY combo_components_all ON public.combo_components FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY purchases_all ON public.purchases FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY purchase_items_all ON public.purchase_items FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY purchase_payments_all ON public.purchase_payments FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY sales_all ON public.sales FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY sale_items_all ON public.sale_items FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY sale_payments_all ON public.sale_payments FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY stock_movements_all ON public.stock_movements FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY cash_sessions_all ON public.cash_sessions FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY cash_movements_all ON public.cash_movements FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY expense_categories_all ON public.expense_categories FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
CREATE POLICY expenses_all ON public.expenses FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());

GRANT EXECUTE ON FUNCTION public.adjust_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_purchase TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.void_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_expense TO authenticated;

-- 8) Seeds
INSERT INTO public.expense_categories (name) VALUES
  ('Servicios'), ('Limpieza'), ('Mantenimiento'), ('Sueldos'), ('Otros');

INSERT INTO public.categories (name, sort_order) VALUES
  ('Pollos', 1), ('Guarniciones', 2), ('Bebidas', 3), ('Combos', 4), ('Otros', 99);

-- =============================================================================
-- Listo. Usuarios Auth existentes ya tienen perfil recreado.
-- Si no hay usuarios: Authentication → Users → Add user
--   Metadata: {"role":"owner","full_name":"Dueño 1"}
-- =============================================================================
