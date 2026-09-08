-- =============================================================================
-- S&F Pollería — Endurecer RLS: tablas críticas = SELECT only para authenticated
-- Las escrituras las hacen las RPC SECURITY DEFINER (bypass RLS).
--
-- Supabase → SQL Editor → pegar TODO → Run
-- Seguro re-ejecutar (DROP POLICY IF EXISTS).
--
-- Decisiones v1 (entrega):
-- 1) Cierra el bypass de RPC (INSERT directo en sales/caja/stock).
-- 2) profiles: solo SELECT para authenticated (la app no actualiza perfiles).
-- 3) Trigger bloquea cambio de role aunque alguien reabra UPDATE más adelante.
-- 4) NO distingue owner vs employee en lectura (todos los miembros ven todo).
--    Eso queda como pendiente de negocio / v2.
-- =============================================================================

-- Quitar policies abiertas FOR ALL en tablas transaccionales
DROP POLICY IF EXISTS purchases_all ON public.purchases;
DROP POLICY IF EXISTS purchase_items_all ON public.purchase_items;
DROP POLICY IF EXISTS purchase_payments_all ON public.purchase_payments;
DROP POLICY IF EXISTS sales_all ON public.sales;
DROP POLICY IF EXISTS sale_items_all ON public.sale_items;
DROP POLICY IF EXISTS sale_payments_all ON public.sale_payments;
DROP POLICY IF EXISTS stock_movements_all ON public.stock_movements;
DROP POLICY IF EXISTS cash_sessions_all ON public.cash_sessions;
DROP POLICY IF EXISTS cash_movements_all ON public.cash_movements;
DROP POLICY IF EXISTS expenses_all ON public.expenses;
DROP POLICY IF EXISTS expense_categories_all ON public.expense_categories;

-- SELECT only (miembros autenticados con profile)
CREATE POLICY purchases_select ON public.purchases
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY purchase_items_select ON public.purchase_items
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY purchase_payments_select ON public.purchase_payments
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY sales_select ON public.sales
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY sale_items_select ON public.sale_items
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY sale_payments_select ON public.sale_payments
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY stock_movements_select ON public.stock_movements
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY cash_sessions_select ON public.cash_sessions
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY cash_movements_select ON public.cash_movements
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY expenses_select ON public.expenses
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

CREATE POLICY expense_categories_select ON public.expense_categories
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

-- Catálogo: la app escribe directo (products / categories / combo_components)
DROP POLICY IF EXISTS products_all ON public.products;
DROP POLICY IF EXISTS categories_all ON public.categories;
DROP POLICY IF EXISTS combo_components_all ON public.combo_components;

CREATE POLICY products_all ON public.products
  FOR ALL TO authenticated
  USING (public.is_authenticated_member())
  WITH CHECK (public.is_authenticated_member());

CREATE POLICY categories_all ON public.categories
  FOR ALL TO authenticated
  USING (public.is_authenticated_member())
  WITH CHECK (public.is_authenticated_member());

CREATE POLICY combo_components_all ON public.combo_components
  FOR ALL TO authenticated
  USING (public.is_authenticated_member())
  WITH CHECK (public.is_authenticated_member());

-- Profiles: SOLO lectura. INSERT lo hace handle_new_user (SECURITY DEFINER).
-- Cambio de role / full_name: solo desde SQL Editor / service_role / futuro RPC admin.
DROP POLICY IF EXISTS profiles_all ON public.profiles;
DROP POLICY IF EXISTS profiles_select ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

CREATE POLICY profiles_select ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_authenticated_member());

-- Defensa en profundidad: nadie (ni con policy UPDATE mal puesta) cambia role
-- vía cliente. Un UPDATE de role solo debería hacerse como superuser/service_role
-- deshabilitando el trigger o con función SECURITY DEFINER admin.
CREATE OR REPLACE FUNCTION public.trg_profiles_block_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'No se puede cambiar el rol del perfil desde el cliente'
      USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_role_escalation ON public.profiles;
CREATE TRIGGER profiles_block_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_profiles_block_role_escalation();

-- Asegurar grants RPC (idempotente)
GRANT EXECUTE ON FUNCTION public.adjust_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_cash_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_purchase TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.void_sale TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_expense TO authenticated;
