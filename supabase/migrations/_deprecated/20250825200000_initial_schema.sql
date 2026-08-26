-- =============================================================================
-- S&F Pollería — Esquema inicial (idempotente: se puede re-ejecutar)
-- Pegar en Supabase → SQL Editor → Run
-- =============================================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tipos (omitir si ya existen)
-- -----------------------------------------------------------------------------
DO $$ BEGIN CREATE TYPE public.user_role AS ENUM ('owner', 'employee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.product_kind AS ENUM ('simple', 'combo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.product_unit AS ENUM ('kg', 'unit');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.payment_method AS ENUM ('cash', 'transfer', 'card', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.stock_movement_type AS ENUM (
    'purchase', 'sale', 'sale_cancel', 'adjustment'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.cash_session_status AS ENUM ('open', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.cash_movement_type AS ENUM (
    'opening', 'sale_cash', 'purchase_cash', 'expense_cash',
    'manual_in', 'manual_out', 'sale_cancel_cash'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------------
-- Perfiles (ligado a auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role public.user_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- -----------------------------------------------------------------------------
-- Productos y combos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  kind public.product_kind NOT NULL DEFAULT 'simple',
  unit public.product_unit,
  sale_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  -- Saldo materializado solo para simples (actualizado por trigger)
  stock_quantity NUMERIC(12, 3) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT products_simple_requires_unit CHECK (
    (kind = 'combo' AND unit IS NULL) OR (kind = 'simple' AND unit IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS public.combo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  component_product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  UNIQUE (combo_product_id, component_product_id),
  CONSTRAINT combo_items_no_self CHECK (combo_product_id <> component_product_id)
);

-- -----------------------------------------------------------------------------
-- Stock (movimientos inmutables)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  movement_type public.stock_movement_type NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity <> 0),
  reference_type TEXT,
  reference_id UUID,
  note TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reparar columnas faltantes si la tabla ya existía incompleta
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS movement_type public.stock_movement_type;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS quantity NUMERIC(12, 3);
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS product_id UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements (product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON public.stock_movements (reference_type, reference_id);

CREATE OR REPLACE FUNCTION public.apply_stock_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kind public.product_kind;
  v_new_qty NUMERIC(12, 3);
BEGIN
  SELECT kind INTO v_kind FROM public.products WHERE id = NEW.product_id FOR UPDATE;

  IF v_kind <> 'simple' THEN
    RAISE EXCEPTION 'Solo productos simples tienen stock';
  END IF;

  v_new_qty := (
    SELECT stock_quantity FROM public.products WHERE id = NEW.product_id
  ) + NEW.quantity;

  IF v_new_qty < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para producto %', NEW.product_id;
  END IF;

  UPDATE public.products
  SET stock_quantity = v_new_qty, updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_stock_movement ON public.stock_movements;
CREATE TRIGGER trg_apply_stock_movement
  AFTER INSERT ON public.stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_stock_movement();

-- -----------------------------------------------------------------------------
-- Compras
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL DEFAULT '',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products (id),
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE IF NOT EXISTS public.purchase_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES public.purchases (id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)
);

-- -----------------------------------------------------------------------------
-- Ventas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sold_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.profiles (id),
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sales_cancel_consistency CHECK (
    (cancelled_at IS NULL AND cancelled_by IS NULL)
    OR (cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products (id),
  quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE IF NOT EXISTS public.sale_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales (id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0)
);

-- -----------------------------------------------------------------------------
-- Caja
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_by UUID NOT NULL REFERENCES public.profiles (id),
  opening_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (opening_amount >= 0),
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES public.profiles (id),
  counted_amount NUMERIC(12, 2),
  expected_amount NUMERIC(12, 2),
  difference NUMERIC(12, 2),
  status public.cash_session_status NOT NULL DEFAULT 'open',
  CONSTRAINT cash_session_close_consistency CHECK (
    (status = 'open' AND closed_at IS NULL)
    OR (status = 'closed' AND closed_at IS NOT NULL AND counted_amount IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_open_cash_session ON public.cash_sessions ((status))
  WHERE status = 'open';

CREATE TABLE IF NOT EXISTS public.cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.cash_sessions (id),
  movement_type public.cash_movement_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount <> 0),
  reference_type TEXT,
  reference_id UUID,
  note TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS movement_type public.cash_movement_type;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS session_id UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_cash_movements_session ON public.cash_movements (session_id, created_at);

-- -----------------------------------------------------------------------------
-- Gastos
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.expense_categories (id),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method public.payment_method NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_by UUID NOT NULL REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed categorías
INSERT INTO public.expense_categories (name) VALUES
  ('Servicios'),
  ('Limpieza'),
  ('Mantenimiento'),
  ('Sueldos'),
  ('Otros')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Helpers auth / RLS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_authenticated_member()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid());
$$;

-- -----------------------------------------------------------------------------
-- RPC: Ajuste de stock
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.adjust_stock(
  p_product_id UUID,
  p_quantity NUMERIC,
  p_note TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_movement_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF p_quantity = 0 THEN
    RAISE EXCEPTION 'Cantidad no puede ser 0';
  END IF;

  INSERT INTO public.stock_movements (
    product_id, movement_type, quantity, reference_type, note, created_by
  ) VALUES (
    p_product_id, 'adjustment', p_quantity, 'adjustment', p_note, auth.uid()
  )
  RETURNING id INTO v_movement_id;

  RETURN v_movement_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Abrir caja
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.open_cash_session(p_opening_amount NUMERIC DEFAULT 0)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF EXISTS (SELECT 1 FROM public.cash_sessions WHERE status = 'open') THEN
    RAISE EXCEPTION 'Ya hay una caja abierta';
  END IF;

  INSERT INTO public.cash_sessions (opened_by, opening_amount)
  VALUES (auth.uid(), COALESCE(p_opening_amount, 0))
  RETURNING id INTO v_session_id;

  IF COALESCE(p_opening_amount, 0) > 0 THEN
    INSERT INTO public.cash_movements (
      session_id, movement_type, amount, reference_type, reference_id, created_by
    ) VALUES (
      v_session_id, 'opening', p_opening_amount, 'cash_session', v_session_id, auth.uid()
    );
  END IF;

  RETURN v_session_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Cerrar caja
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.close_cash_session(p_counted_amount NUMERIC)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session public.cash_sessions%ROWTYPE;
  v_expected NUMERIC(12, 2);
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  SELECT * INTO v_session FROM public.cash_sessions WHERE status = 'open' LIMIT 1 FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No hay caja abierta';
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_expected
  FROM public.cash_movements
  WHERE session_id = v_session.id;

  UPDATE public.cash_sessions
  SET
    status = 'closed',
    closed_at = NOW(),
    closed_by = auth.uid(),
    counted_amount = p_counted_amount,
    expected_amount = v_expected,
    difference = p_counted_amount - v_expected
  WHERE id = v_session.id;

  RETURN v_session.id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Registrar compra (atómica)
-- p_items: [{ "product_id", "quantity", "unit_cost" }]
-- p_payments: [{ "method", "amount" }]
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_purchase(
  p_supplier_name TEXT,
  p_items JSONB,
  p_payments JSONB,
  p_notes TEXT DEFAULT NULL,
  p_purchased_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase_id UUID;
  v_item JSONB;
  v_payment JSONB;
  v_total NUMERIC(12, 2) := 0;
  v_payments_sum NUMERIC(12, 2) := 0;
  v_line_total NUMERIC(12, 2);
  v_session_id UUID;
  v_product_id UUID;
  v_qty NUMERIC(12, 3);
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'La compra debe tener al menos un ítem';
  END IF;

  -- Calcular total
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_line_total := (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_cost')::NUMERIC;
    v_total := v_total + v_line_total;
  END LOOP;

  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    v_payments_sum := v_payments_sum + (v_payment ->> 'amount')::NUMERIC;
  END LOOP;

  IF v_payments_sum <> v_total THEN
    RAISE EXCEPTION 'La suma de pagos (%) debe igualar el total (%)', v_payments_sum, v_total;
  END IF;

  INSERT INTO public.purchases (supplier_name, purchased_at, total, notes, created_by)
  VALUES (COALESCE(p_supplier_name, ''), p_purchased_at, v_total, p_notes, auth.uid())
  RETURNING id INTO v_purchase_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item ->> 'product_id')::UUID;
    v_qty := (v_item ->> 'quantity')::NUMERIC;
    v_line_total := v_qty * (v_item ->> 'unit_cost')::NUMERIC;

    INSERT INTO public.purchase_items (purchase_id, product_id, quantity, unit_cost, line_total)
    VALUES (v_purchase_id, v_product_id, v_qty, (v_item ->> 'unit_cost')::NUMERIC, v_line_total);

    INSERT INTO public.stock_movements (
      product_id, movement_type, quantity, reference_type, reference_id, created_by
    ) VALUES (
      v_product_id, 'purchase', v_qty, 'purchase', v_purchase_id, auth.uid()
    );
  END LOOP;

  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    INSERT INTO public.purchase_payments (purchase_id, method, amount)
    VALUES (
      v_purchase_id,
      (v_payment ->> 'method')::public.payment_method,
      (v_payment ->> 'amount')::NUMERIC
    );

    IF (v_payment ->> 'method') = 'cash' THEN
      SELECT id INTO v_session_id FROM public.cash_sessions WHERE status = 'open' LIMIT 1;
      IF v_session_id IS NOT NULL THEN
        INSERT INTO public.cash_movements (
          session_id, movement_type, amount, reference_type, reference_id, created_by
        ) VALUES (
          v_session_id, 'purchase_cash', -(v_payment ->> 'amount')::NUMERIC,
          'purchase', v_purchase_id, auth.uid()
        );
      END IF;
    END IF;
  END LOOP;

  RETURN v_purchase_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Descontar stock de un ítem (simple o combo)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._deduct_stock_for_sale_item(
  p_product_id UUID,
  p_quantity NUMERIC,
  p_sale_id UUID,
  p_movement_type public.stock_movement_type
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kind public.product_kind;
  v_combo RECORD;
  v_sign NUMERIC := -1;
BEGIN
  IF p_movement_type = 'sale_cancel' THEN
    v_sign := 1;
  END IF;

  SELECT kind INTO v_kind FROM public.products WHERE id = p_product_id;

  IF v_kind = 'simple' THEN
    INSERT INTO public.stock_movements (
      product_id, movement_type, quantity, reference_type, reference_id, created_by
    ) VALUES (
      p_product_id, p_movement_type, v_sign * p_quantity, 'sale', p_sale_id, auth.uid()
    );
  ELSE
    FOR v_combo IN
      SELECT component_product_id, quantity AS component_qty
      FROM public.combo_items
      WHERE combo_product_id = p_product_id
    LOOP
      INSERT INTO public.stock_movements (
        product_id, movement_type, quantity, reference_type, reference_id, created_by
      ) VALUES (
        v_combo.component_product_id,
        p_movement_type,
        v_sign * (p_quantity * v_combo.component_qty),
        'sale',
        p_sale_id,
        auth.uid()
      );
    END LOOP;
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Registrar venta (atómica)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_sale(
  p_items JSONB,
  p_payments JSONB,
  p_discount_amount NUMERIC DEFAULT 0,
  p_sold_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sale_id UUID;
  v_item JSONB;
  v_payment JSONB;
  v_subtotal NUMERIC(12, 2) := 0;
  v_total NUMERIC(12, 2);
  v_payments_sum NUMERIC(12, 2) := 0;
  v_line_total NUMERIC(12, 2);
  v_session_id UUID;
  v_product_id UUID;
  v_qty NUMERIC(12, 3);
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'La venta debe tener al menos un ítem';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_line_total := (v_item ->> 'quantity')::NUMERIC * (v_item ->> 'unit_price')::NUMERIC;
    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  v_total := v_subtotal - COALESCE(p_discount_amount, 0);

  IF v_total < 0 THEN
    RAISE EXCEPTION 'Total inválido';
  END IF;

  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    v_payments_sum := v_payments_sum + (v_payment ->> 'amount')::NUMERIC;
  END LOOP;

  IF v_payments_sum <> v_total THEN
    RAISE EXCEPTION 'La suma de pagos (%) debe igualar el total (%)', v_payments_sum, v_total;
  END IF;

  INSERT INTO public.sales (sold_at, subtotal, discount_amount, total, created_by)
  VALUES (p_sold_at, v_subtotal, COALESCE(p_discount_amount, 0), v_total, auth.uid())
  RETURNING id INTO v_sale_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item ->> 'product_id')::UUID;
    v_qty := (v_item ->> 'quantity')::NUMERIC;
    v_line_total := v_qty * (v_item ->> 'unit_price')::NUMERIC;

    INSERT INTO public.sale_items (sale_id, product_id, quantity, unit_price, line_total)
    VALUES (v_product_id, v_qty, (v_item ->> 'unit_price')::NUMERIC, v_line_total);

    PERFORM public._deduct_stock_for_sale_item(v_product_id, v_qty, v_sale_id, 'sale');
  END LOOP;

  FOR v_payment IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    INSERT INTO public.sale_payments (sale_id, method, amount)
    VALUES (
      v_sale_id,
      (v_payment ->> 'method')::public.payment_method,
      (v_payment ->> 'amount')::NUMERIC
    );

    IF (v_payment ->> 'method') = 'cash' THEN
      SELECT id INTO v_session_id FROM public.cash_sessions WHERE status = 'open' LIMIT 1;
      IF v_session_id IS NOT NULL THEN
        INSERT INTO public.cash_movements (
          session_id, movement_type, amount, reference_type, reference_id, created_by
        ) VALUES (
          v_session_id, 'sale_cash', (v_payment ->> 'amount')::NUMERIC,
          'sale', v_sale_id, auth.uid()
        );
      END IF;
    END IF;
  END LOOP;

  RETURN v_sale_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Anular venta
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_sale(p_sale_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sale public.sales%ROWTYPE;
  v_item RECORD;
  v_payment RECORD;
  v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  SELECT * INTO v_sale FROM public.sales WHERE id = p_sale_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Venta no encontrada';
  END IF;

  IF v_sale.cancelled_at IS NOT NULL THEN
    RAISE EXCEPTION 'La venta ya está anulada';
  END IF;

  FOR v_item IN SELECT * FROM public.sale_items WHERE sale_id = p_sale_id
  LOOP
    PERFORM public._deduct_stock_for_sale_item(
      v_item.product_id, v_item.quantity, p_sale_id, 'sale_cancel'
    );
  END LOOP;

  FOR v_payment IN SELECT * FROM public.sale_payments WHERE sale_id = p_sale_id AND method = 'cash'
  LOOP
    SELECT id INTO v_session_id FROM public.cash_sessions WHERE status = 'open' LIMIT 1;
    IF v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (
        session_id, movement_type, amount, reference_type, reference_id, created_by
      ) VALUES (
        v_session_id, 'sale_cancel_cash', -v_payment.amount,
        'sale', p_sale_id, auth.uid()
      );
    END IF;
  END LOOP;

  UPDATE public.sales
  SET cancelled_at = NOW(), cancelled_by = auth.uid()
  WHERE id = p_sale_id;

  RETURN p_sale_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- RPC: Registrar gasto
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_expense(
  p_category_id UUID,
  p_amount NUMERIC,
  p_payment_method public.payment_method,
  p_description TEXT DEFAULT '',
  p_expense_date DATE DEFAULT CURRENT_DATE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expense_id UUID;
  v_session_id UUID;
BEGIN
  IF NOT public.is_authenticated_member() THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  INSERT INTO public.expenses (category_id, amount, payment_method, description, expense_date, created_by)
  VALUES (p_category_id, p_amount, p_payment_method, COALESCE(p_description, ''), p_expense_date, auth.uid())
  RETURNING id INTO v_expense_id;

  IF p_payment_method = 'cash' THEN
    SELECT id INTO v_session_id FROM public.cash_sessions WHERE status = 'open' LIMIT 1;
    IF v_session_id IS NOT NULL THEN
      INSERT INTO public.cash_movements (
        session_id, movement_type, amount, reference_type, reference_id, created_by
      ) VALUES (
        v_session_id, 'expense_cash', -p_amount, 'expense', v_expense_id, auth.uid()
      );
    END IF;
  END IF;

  RETURN v_expense_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- v1: miembros autenticados con perfil — acceso completo (dueños owner)
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS products_all ON public.products;
CREATE POLICY products_all ON public.products FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
DROP POLICY IF EXISTS combo_items_all ON public.combo_items;
CREATE POLICY combo_items_all ON public.combo_items FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
DROP POLICY IF EXISTS stock_movements_select ON public.stock_movements;
CREATE POLICY stock_movements_select ON public.stock_movements FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS purchases_select ON public.purchases;
CREATE POLICY purchases_select ON public.purchases FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS purchase_items_select ON public.purchase_items;
CREATE POLICY purchase_items_select ON public.purchase_items FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS purchase_payments_select ON public.purchase_payments;
CREATE POLICY purchase_payments_select ON public.purchase_payments FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS sales_select ON public.sales;
CREATE POLICY sales_select ON public.sales FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS sale_items_select ON public.sale_items;
CREATE POLICY sale_items_select ON public.sale_items FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS sale_payments_select ON public.sale_payments;
CREATE POLICY sale_payments_select ON public.sale_payments FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS cash_sessions_all ON public.cash_sessions;
CREATE POLICY cash_sessions_all ON public.cash_sessions FOR ALL TO authenticated
  USING (public.is_authenticated_member()) WITH CHECK (public.is_authenticated_member());
DROP POLICY IF EXISTS cash_movements_select ON public.cash_movements;
CREATE POLICY cash_movements_select ON public.cash_movements FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS expense_categories_select ON public.expense_categories;
CREATE POLICY expense_categories_select ON public.expense_categories FOR SELECT TO authenticated
  USING (public.is_authenticated_member());
DROP POLICY IF EXISTS expenses_select ON public.expenses;
CREATE POLICY expenses_select ON public.expenses FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

-- Grants RPC
GRANT EXECUTE ON FUNCTION public.adjust_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_purchase TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_expense TO authenticated;

-- =============================================================================
-- DESPUÉS DE EJECUTAR: crear usuarios en Authentication → Users
-- Ejemplo dueños (contraseña la definís vos):
--   dueno1@sf-polleria.test
--   dueno2@sf-polleria.test
-- Al crearlos, el trigger crea el perfil con role owner si pasás metadata:
--   User Metadata: { "role": "owner", "full_name": "Dueño 1" }
-- =============================================================================
