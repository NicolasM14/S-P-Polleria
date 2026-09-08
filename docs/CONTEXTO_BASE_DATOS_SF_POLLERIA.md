# Contexto de Base de Datos — S&F Pollería (Supabase)

Este documento describe la estructura y el funcionamiento de la base de datos de Supabase del proyecto **S&F Pollería**, para que Cursor (o cualquier agente/dev) entienda el dominio antes de tocar código.

> **Revisión:** 8 sep 2026 — corregido vs código real (`src/`) y migración canónica `supabase/migrations/20250825220000_reset_full_setup.sql`.

## 1. Datos del proyecto

| Campo | Valor |
|---|---|
| Nombre del proyecto | S&F Polleria |
| Project ref / ID | `xaktlzdabmkbgzvdrdve` |
| Región | `sa-east-1` |
| Host DB | `db.xaktlzdabmkbgzvdrdve.supabase.co` |
| Motor Postgres | 17 (versión `17.6.1.155`) |
| Estado | ACTIVE_HEALTHY |
| Migraciones CLI remotas | Ninguna registrada vía `supabase migration` |
| SQL canónico en el repo | `supabase/migrations/20250825220000_reset_full_setup.sql` (+ `20250825230000_stock_insufficient_message.sql`, + endurecimiento RLS si se aplicó `20250908200000_harden_rls_rpc_only.sql`). Se pegan en **SQL Editor**, no por CLI. |

**Variables de entorno (Next.js):**

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto (obligatoria) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` **o** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Key pública; el código acepta cualquiera de las dos (`src/config/env.ts`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo scripts admin (ej. seed); **nunca** en el cliente ni en `NEXT_PUBLIC_*` |

**Nota de seguridad:** este documento no incluye API keys ni connection strings. Tomarlas del dashboard o de `.env.local` / Vercel. No hardcodearlas ni subirlas al repo.

## 2. Qué es el sistema

Es un **punto de venta (POS) + gestión de inventario y caja para una pollería**. Cubre:
- Catálogo de productos (simples; combos existen en DB pero la app v1 **rechaza** crear/editar combos).
- Ventas (con anulación) y medios de pago (UI: `cash` / `transfer`; enum también tiene `card` / `other`).
- Compras a proveedores y sus medios de pago.
- Movimientos de stock (auditoría de cada entrada/salida).
- Sesiones de caja (apertura/cierre) con movimientos asociados a ventas, compras y gastos.
- Gastos categorizados.
- Perfiles con rol (`owner` / `employee`) vinculados a `auth.users`. **El rol aún no restringe UI ni RLS** (cualquier miembro autenticado con `profiles` ve/opera todo).

## 3. Extensiones de Postgres instaladas

Solo estas están **instaladas** (el resto del catálogo de Supabase está disponible pero no activado):
- `pgcrypto` (schema `extensions`)
- `uuid-ossp` (schema `extensions`)
- `pg_stat_statements` (schema `extensions`)
- `supabase_vault` (schema `vault`)
- `plpgsql` (schema `pg_catalog`)

## 4. Esquema de tablas (schema `public`)

Todas las tablas usan `uuid` como PK (mayormente `gen_random_uuid()`) y tienen **RLS habilitado**.

### `profiles`
Extiende a `auth.users` (FK 1 a 1 con `id`).
- `id uuid` (PK, FK → `auth.users.id`)
- `full_name text`
- `role user_role` enum: `owner` | `employee` (default `owner`)
- `created_at timestamptz`
- `updated_at timestamptz` (**sí existe**)

### `categories`
- `id`, `name` (único), `sort_order int`, `created_at`

### `products`
- `id`, `category_id` (FK → categories, nullable)
- `name`
- `kind product_kind` enum: `simple` | `combo`
- `sale_unit sale_unit` enum: `kg` | `unit`
- `price numeric` (>= 0)
- `stock numeric` (>= 0) — saldo cacheado; combos no usan stock propio
- `min_stock numeric` (>= 0)
- `is_active boolean`
- `created_at`, `updated_at`

> **Nota UI:** la app de ventas/compras está pensada en **gramos → kg**. Productos con `sale_unit = 'unit'` (ej. maple de huevos) pueden comportarse mal en el POS hasta que se implemente UI unit-aware.

### `combo_components`
Receta de un combo (productos simples + cantidad).
- `id`, `combo_id` (FK → products), `component_id` (FK → products), `quantity` (> 0)

### `sales`
- `id`, `sold_at`, `status sale_status` enum: `completed` | `voided`
- `subtotal`, `discount` (default 0), `total`
- `notes`, `created_by` (FK → profiles)
- `voided_at`, `voided_by` (FK → profiles)

### `sale_items`
Snapshot al vender.
- `sale_id`, `product_id`, `product_name`, `product_kind`, `sale_unit`
- `quantity`, `unit_price`, `line_total`
- `recipe_snapshot jsonb` (componentes si era combo)

### `sale_payments`
- `sale_id`, `method payment_method` (`cash` | `transfer` | `card` | `other`), `amount` (> 0)

### `purchases`
- `id`, `purchased_at`, `notes`, `total`, `created_by`

### `purchase_items`
- `purchase_id`, `product_id`, `product_name`, `sale_unit`
- `quantity` (> 0), `unit_cost` (>= 0), `line_total`

### `purchase_payments`
- `purchase_id`, `method payment_method`, `amount` (> 0)

### `stock_movements`
- `product_id`, `quantity` (delta, puede ser negativo)
- `type stock_movement_type`: `purchase` | `sale` | `sale_void` | `adjustment`
- `stock_after`, `sale_id`, `purchase_id` (opcionales)
- `notes`, `created_by`, `created_at`

### `cash_sessions`
- `id`, `status cash_session_status`: `open` | `closed`
- `opened_at`, `opened_by`, `opening_amount`
- `closed_at`, `closed_by`
- `expected_amount`, `counted_amount`, `difference`
- `notes`
- Índice parcial: **solo una sesión `open` a la vez**

### `cash_movements`
- `cash_session_id`
- `type cash_movement_type`: `opening` | `sale` | `purchase` | `expense` | `manual_in` | `manual_out`
- `amount` (positivo = ingreso, negativo = egreso)
- `sale_id`, `purchase_id`, `expense_id` (opcionales)
- `notes`, `created_by`, `created_at`

> `manual_in` / `manual_out` existen en el enum pero **no hay RPC ni UI** en v1.

### `expense_categories`
- `id`, `name` (único)

### `expenses`
- `category_id` (nullable), `description`, `amount` (> 0)
- `from_cash boolean`
- `occurred_at`, `created_by`, `created_at`

## 5. Relaciones clave

```
auth.users ─1:1─ profiles
profiles ─1:N─ sales / purchases / expenses / stock_movements / cash_sessions / cash_movements

categories ─1:N─ products
products ─1:N─ combo_components (combo_id)
products ─1:N─ combo_components (component_id)

sales ─1:N─ sale_items ─N:1─ products
sales ─1:N─ sale_payments
sales ─1:N─ stock_movements / cash_movements (por sale_id)

purchases ─1:N─ purchase_items ─N:1─ products
purchases ─1:N─ purchase_payments
purchases ─1:N─ stock_movements / cash_movements (por purchase_id)

expense_categories ─1:N─ expenses
expenses ─1:N─ cash_movements (por expense_id)

cash_sessions ─1:N─ cash_movements
```

## 6. Lógica de negocio (funciones `SECURITY DEFINER`)

Las escrituras críticas de la **app** van por RPC (`supabase.rpc(...)`). Con el script de endurecimiento RLS aplicado, el cliente **authenticated** solo puede **SELECT** en tablas transaccionales; los INSERT los hacen las funciones (bypass RLS por `SECURITY DEFINER`).

### Helpers / internas (no llamar desde el cliente)

| Función | Rol |
|---|---|
| `is_authenticated_member()` | `true` si `auth.uid()` tiene fila en `profiles` |
| `handle_new_user()` | Trigger en `auth.users` → crea `profiles` desde `raw_user_meta_data` (`full_name`, `role`; default `owner`) |
| `get_open_cash_session_id()` | Id de la caja `open` o `NULL` |
| `_apply_product_stock(...)` | Aplica delta: `simple` actualiza `stock` + `stock_movements`; `combo` recurse sobre componentes (sin stock propio) |

### RPC públicas (prefijo `p_`)

| RPC | Qué hace |
|---|---|
| `adjust_stock(p_product_id, p_quantity, p_notes)` | Ajuste manual (merma, conteo, stock inicial) |
| `create_sale(p_items, p_payments, p_discount, p_notes, p_sold_at)` | Venta completa + stock + pagos; cash → `cash_movements` si hay caja abierta |
| `void_sale(p_sale_id)` | Anula: repone stock (`sale_void`); revierte cash con monto negativo tipo `sale` si hay caja |
| `create_purchase(p_items, p_payments, p_notes, p_purchased_at)` | Compra solo `simple`; suma stock; cash → egreso si efectivo |
| `open_cash_session(p_opening_amount)` | Abre caja; falla si ya hay una abierta |
| `close_cash_session(p_counted_amount, p_notes)` | Cierra; `expected` = suma de `cash_movements`; guarda diferencia |
| `create_expense(p_category_id, p_amount, p_description, p_from_cash, p_occurred_at)` | Gasto; egreso de caja si `from_cash` y hay sesión abierta |

**Forma de los JSON:**

```json
// items venta
[{ "product_id": "uuid", "quantity": 2, "unit_price": 1500 }]
// items compra
[{ "product_id": "uuid", "quantity": 10, "unit_cost": 900 }]
// payments
[{ "method": "cash", "amount": 3000 }]
```

- `quantity` en venta/compra es en la **unidad de venta del producto** (para kg la UI manda kg, no gramos).
- La suma de `payments` debe ser **exactamente** igual al total (`<>` en SQL); si no, excepción.
- Sin caja abierta, ventas/compras/gastos **igual se registran**; solo se omiten `cash_movements`.

## 7. Seguridad (RLS)

### Estado base (migración `…220000…`)
- RLS ON en todas las tablas `public`.
- Una policy `*_all` `FOR ALL` a `authenticated` con `is_authenticated_member()`.
- **Implicancia:** cualquier miembro podía insertar ventas/caja/stock **sin** pasar por RPC (la app no lo hacía, pero la DB lo permitía).

### Estado endurecido (migración `…harden_rls_rpc_only…`, si se aplicó)
| Tabla | `authenticated` |
|---|---|
| `sales`, `sale_items`, `sale_payments` | **SELECT** only |
| `purchases`, `purchase_items`, `purchase_payments` | **SELECT** only |
| `stock_movements`, `cash_sessions`, `cash_movements`, `expenses` | **SELECT** only |
| `expense_categories` | **SELECT** only |
| `products`, `categories`, `combo_components` | SELECT + INSERT/UPDATE/DELETE (catálogo desde app) |
| `profiles` | **SELECT only** (sin UPDATE desde cliente). Trigger `profiles_block_role_escalation` impide cambiar `role` aunque se reabra UPDATE. |

- `owner` vs `employee` **todavía no** se usa en policies de lectura (todos los miembros ven caja/gastos/ventas). Pendiente v2 si se suman empleados.
- Desactivar **signup público** en Auth; usuarios solo por dashboard / SQL admin.
- No confiar en que el frontend “no llame” inserts directos: con RLS endurecido la DB lo bloquea.

## 8. Convenciones al programar

1. **Escrituras críticas:** solo RPC (`create_sale`, `create_purchase`, `void_sale`, `adjust_stock`, `open_cash_session`, `close_cash_session`, `create_expense`).
2. **Catálogo:** `products` / `categories` / `combo_components` sí pueden ir con `.from()` directo; stock inicial positivo → `adjust_stock`, no `UPDATE products.stock` a mano.
3. **Combos:** sin stock propio; disponibilidad = mínimo de componentes (no hay función SQL de “stock disponible combo” — calcular en FE o nueva RPC). La app v1 no opera combos.
4. **Pagos = total** exacto; validar en FE antes del RPC.
5. **Caja única global** (no por usuario/sucursal).
6. **Auditoría de stock** siempre en `stock_movements` con `stock_after`.
7. Empezar a versionar cambios con archivos en `supabase/migrations/` (aunque se apliquen pegando en SQL Editor).
8. **No ejecutar** archivos en `supabase/migrations/_deprecated/` (esquemas viejos / destructivos).

## 9. Para Cursor: cómo usar esto

- Cliente: `@supabase/supabase-js` / `@supabase/ssr`.
- Escrituras: `supabase.rpc('create_sale', { p_items: [...], p_payments: [...], p_discount: 0 })`.
- Lecturas de listados: `.from('products' | 'sales' | ...).select(...)` con sesión autenticada.
- Tipos enum: generar con `supabase gen types typescript` cuando haya CLI configurado.
- Archivos de referencia en el repo:
  - `supabase/migrations/20250825220000_reset_full_setup.sql` — esquema + RPC + RLS base
  - `supabase/migrations/20250825230000_stock_insufficient_message.sql` — mensaje stock
  - `supabase/migrations/20250908200000_harden_rls_rpc_only.sql` — RLS SELECT-only en tablas críticas
  - `MANUAL-DE-USO.md` — flujo operativo
