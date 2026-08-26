# Skill — Crear módulo

## Objetivo

Crear un **nuevo módulo de dominio** cuando esté aprobado explícitamente (caso excepcional).

## Responsabilidades

Estructura exacta de cuatro capas; actualizar documentación.

## Precondiciones

- [ ] Usuario aprobó nuevo módulo
- [ ] ADR creado o `02-project-structure.md` actualizado
- [ ] No duplica módulo existente (preferir extender)

## Estructura obligatoria

```text
src/modules/{nombre}/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

**No agregar** otras subcarpetas (`services/`, `utils/`, `api/`).

## Checklist

1. [ ] Crear las 4 carpetas vacías o con README interno opcional
2. [ ] Agregar rutas en `src/app/(dashboard)/` si tiene UI
3. [ ] Documentar en `.agents` usando `templates/module-template.md`
4. [ ] Actualizar `02-project-structure.md` vía ADR
5. [ ] Crear skill de negocio si el módulo es funcional (`skills/{nombre}.md`)
6. [ ] Seeds/migraciones iniciales vía `supabase.md`

## Archivos permitidos

`src/modules/{nombre}/**`, rutas asociadas, migraciones, `.agents/`.

## Archivos prohibidos

Cualquier quinta subcarpeta dentro del módulo.

## Errores comunes

- Crear módulo `inventory` cuando `stock` + `products` bastan
- Poner lógica en `shared/` para evitar crear capas

## Ejemplos

Módulos válidos actuales: auth, products, stock, purchases, sales, cash, expenses, reports.

## Notas

- En la práctica casi nunca se crean módulos nuevos en v1; extender los existentes.
