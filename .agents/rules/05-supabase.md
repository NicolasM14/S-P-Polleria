# 05 — Supabase

## Objetivo

Reglas para **Auth, PostgreSQL, RLS, RPC y migraciones**. Supabase es la única fuente de persistencia.

## Responsabilidades

| Área | Dónde vive en código |
|------|----------------------|
| Cliente browser | `shared/lib/supabase/client.ts` |
| Cliente server | `shared/lib/supabase/server.ts` |
| Repositorios | `modules/*/infrastructure/` |
| SQL / RLS / RPC | `supabase/migrations/` |

## Auth

- Supabase Auth con email/password (dueños iniciales; empleados futuros).
- Perfil extendido en tabla `profiles` ligada a `auth.users`.
- Sesión refrescada vía middleware.
- **Nunca** almacenar passwords en tablas propias.

## PostgreSQL

| Regla | Detalle |
|-------|---------|
| Migraciones | Una migración por cambio lógico; timestamp en nombre |
| Naming tablas | snake_case plural: `products`, `sale_items` |
| Naming columnas | snake_case |
| FK | Siempre explícitas con ON DELETE documentado |
| Índices | En columnas de búsqueda/filtro frecuente |

## RLS (Row Level Security)

- **Habilitado en todas las tablas** con datos de negocio.
- Políticas por rol (`owner`, `employee` futuro).
- Probar políticas con usuarios de prueba distintos.
- Documentar cada política en comentario SQL o migration-template.

## RPC / Funciones SQL

Operaciones **obligatorias** vía funciones atómicas:

| Operación | Motivo |
|-----------|--------|
| Registrar venta | Stock + pagos + caja en una transacción |
| Anular venta | Reversión consistente |
| Registrar compra | Stock + pagos + caja |
| Cierre de caja | Cálculo atómico de totales |
| Ajuste de stock | Movimiento + saldo |

Las funciones viven en migraciones; TypeScript las invoca vía `supabase.rpc()`.

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo server-side admin scripts**, nunca en cliente |

Validar en `src/config/env.ts` con Zod.

## Reglas inviolables

1. **Nunca `service_role` en cliente** ni en bundles expuestos.
2. **Nunca consultar Supabase desde domain** (ni importar cliente).
3. **Consultas centralizadas** en repositorios de infrastructure.
4. **Operaciones críticas = RPC**; no multi-query desde TS sin transacción.
5. **Seeds** solo datos de dev; no passwords reales en repo.
6. Storage: no usar hasta ADR que lo autorice.

## Checklist

- [ ] ¿RLS definido para la tabla nueva?
- [ ] ¿Operación crítica es RPC atómica?
- [ ] ¿Repositorio encapsula la query?
- [ ] ¿Env vars validadas y sin secretos en git?

## Ejemplos

### Repositorio

```typescript
// modules/products/infrastructure/supabase-product.repository.ts
export class SupabaseProductRepository implements ProductRepository {
  async findActive(): Promise<Product[]> {
    const { data, error } = await this.client.from('products').select('*').eq('is_active', true);
    if (error) throw mapSupabaseError(error);
    return data.map(toProduct);
  }
}
```

### Incorrecto

```typescript
// ❌ En domain/sale.entity.ts
import { createClient } from '@supabase/supabase-js';
```

## Notas

- Ver ADR-002 para decisión de stack.
- Ver skill `supabase.md` para procedimiento de migraciones.
