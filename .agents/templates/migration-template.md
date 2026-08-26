# Migración — {YYYYMMDDHHMMSS_nombre}

## Objetivo

¿Qué cambio de esquema o lógica DB introduce esta migración?

## Archivo

`supabase/migrations/{timestamp}_{nombre}.sql`

## Cambios

### Tablas

| Tabla | Acción | Descripción |
|-------|--------|-------------|
| | CREATE / ALTER / DROP | |

### RLS

| Tabla | Política | Roles |
|-------|----------|-------|
| | | |

### Funciones RPC

| Función | Propósito |
|---------|-----------|
| | |

### Índices

- 

## Dependencias

- Migración anterior requerida:
- Módulo de aplicación:

## Rollback (manual)

¿Cómo revertir en emergencia? (forward-only; documentar pasos manuales)

## Checklist

- [ ] Probado en local (`db reset`)
- [ ] RLS verificado
- [ ] RPC probada con casos feliz + error
- [ ] Mappers TS actualizados
- [ ] Schemas Zod actualizados
- [ ] Sin secretos en SQL

## Datos existentes

- [ ] Backfill necesario: sí / no
- Script:

## Notas

- PR:
- Autor:
