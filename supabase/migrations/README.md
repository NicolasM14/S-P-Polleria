# Migraciones Supabase

## ✅ Migraciones a ejecutar en Supabase SQL Editor

1. **Primera vez / reset:** `20250825220000_reset_full_setup.sql` (borra datos de `public`)
2. **Mejora mensaje stock:** `20250825230000_stock_insufficient_message.sql` (si ya corriste el reset)

## ❌ No ejecutar

- `_deprecated/` — borradores viejos

## Después del setup

1. Authentication → Users
2. `npm run dev` → http://localhost:3000/login
