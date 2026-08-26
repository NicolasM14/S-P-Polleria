-- =============================================================================
-- S&F Pollería — Esquema REAL en Supabase (Cloud Agent)
-- SOLO REFERENCIA — NO ejecutar si las tablas ya existen
-- Exportado desde Supabase Table Editor
-- =============================================================================

-- Enums esperados (verificar en Database → Types):
--   user_role, product_kind, sale_unit, sale_status, payment_method
--   stock_movement_type (columna stock_movements.type)
--   cash_session_status, cash_movement_type (columna cash_movements.type)

-- Tablas:
--   profiles, categories, products, combo_components
--   purchases, purchase_items, purchase_payments
--   sales, sale_items, sale_payments
--   stock_movements, cash_sessions, cash_movements
--   expense_categories, expenses

-- Diferencias vs migración local 20250825200000:
--   • products.stock (no stock_quantity), price (no sale_price), sale_unit (no unit)
--   • combo_components (no combo_items)
--   • stock_movements: type, stock_after, sale_id, purchase_id (no reference_type)
--   • sales: voided_at/voided_by, status (no cancelled_at)
--   • cash_movements: cash_session_id, type, FKs directos (no reference_type)
--   • expenses: from_cash, occurred_at (no payment_method)
--   • categories para productos
