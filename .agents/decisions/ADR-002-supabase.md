# ADR-002 — Supabase como backend

## Estado

Aceptado

## Contexto

Se requiere autenticación, base relacional, APIs y políticas de acceso sin operar un backend propio. El equipo quiere velocidad de desarrollo y hosting gestionado.

## Decisión

Usar **Supabase** para:

- Auth (email/password)
- PostgreSQL
- Row Level Security
- Funciones RPC para operaciones transaccionales críticas
- Migraciones versionadas en `supabase/migrations/`

Stack frontend: **Next.js** en el mismo repo (monolito).

## Motivo

- Un solo proveedor para auth + DB.
- RLS en DB como defensa en profundidad.
- RPC evita race conditions en stock/caja.

## Consecuencias

### Positivas

- Menos infra propia.
- Cliente SSR oficial para Next.js.
- SQL atómico para ventas/compras.

### Negativas

- Vendor lock-in moderado.
- Lógica crítica repartida TS + SQL.

### Mitigación

- Repositorios encapsulan Supabase en infrastructure.
- Domain no importa SDK.

## Checklist

- [ ] RLS en tablas nuevas
- [ ] Operaciones críticas en RPC
- [ ] Sin service_role en cliente

## Notas

- Edge Functions solo si ADR futuro lo justifica.
