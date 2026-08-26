-- =============================================================================
-- Reparar esquema a medias (ejecutar ANTES de re-correr la migración principal)
-- Supabase → SQL Editor → Run
-- =============================================================================

-- stock_movements
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS product_id UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS movement_type public.stock_movement_type;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS quantity NUMERIC(12, 3);
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.stock_movements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- cash_movements
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS session_id UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS movement_type public.cash_movement_type;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.cash_movements ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity NUMERIC(12, 3) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS kind public.product_kind DEFAULT 'simple';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit public.product_unit;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
