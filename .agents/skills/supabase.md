# Skill — Supabase

## Objetivo

Procedimiento para **migraciones, RLS, seeds y RPC** de forma segura y trazable.

## Responsabilidades

Cambios en `supabase/` sin romper producción ni exponer secretos.

## Checklist

### Nueva tabla

- [ ] Migración con timestamp: `YYYYMMDDHHMMSS_descripcion.sql`
- [ ] PK, FK, índices necesarios
- [ ] RLS enabled + políticas por rol
- [ ] Comentario SQL breve en tabla/columnas críticas
- [ ] Types TS regenerados si usan codegen (cuando exista)

### Nueva RPC

- [ ] Función en SQL transaccional (`BEGIN`/`EXCEPTION`)
- [ ] Validaciones dentro de la función
- [ ] `SECURITY DEFINER` solo si documentado y justificado
- [ ] Grant execute a `authenticated`
- [ ] Wrapper en `infrastructure/` del módulo

### Modificar columna

- [ ] Migración forward-only (no editar migraciones viejas)
- [ ] Backfill si hay datos existentes
- [ ] Actualizar mappers y schemas Zod

### Seed

- [ ] Solo dev en `seed.sql`
- [ ] Sin passwords reales ni service keys

### Validar

- [ ] `supabase db reset` local (cuando CLI configurado)
- [ ] Probar RLS con dos roles si aplica
- [ ] Documentar en PR usando `templates/migration-template.md`

## Archivos permitidos

`supabase/migrations/`, `supabase/seed.sql`, repos en `modules/*/infrastructure/`, `src/config/env.ts`.

## Archivos prohibidos

- SQL en componentes React
- Editar migraciones ya aplicadas en prod
- service_role en cliente

## Errores comunes

| Error | Fix |
|-------|-----|
| Stock update directo en trigger mal diseñado | Usar patrón movimientos |
| RLS olvidado | Tabla expuesta |
| Lógica crítica solo en TS | Mover a RPC |

## Ejemplos

`create_sale(...)` RPC: inserta sale, items, payments, movimientos stock, movimiento caja si efectivo — todo en una transacción.

## Notas

- Ver `05-supabase.md` y ADR-002, ADR-003, ADR-004.
