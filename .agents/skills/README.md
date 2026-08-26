# Skills — Procedimientos

## Objetivo

Las **skills** son guías paso a paso para ejecutar tareas concretas. No reemplazan las reglas en `rules/`.

## Responsabilidades

| Skill | Cuándo usarla |
|-------|---------------|
| [create-feature.md](create-feature.md) | Nueva funcionalidad end-to-end |
| [refactor-feature.md](refactor-feature.md) | Mejorar código sin cambiar comportamiento |
| [create-module.md](create-module.md) | Nuevo módulo de dominio (raro; requiere aprobación) |
| [supabase.md](supabase.md) | Migraciones, RLS, RPC |
| [products.md](products.md) | ABM productos y combos |
| [stock.md](stock.md) | Movimientos y saldos |
| [purchases.md](purchases.md) | Ingreso de mercadería |
| [sales.md](sales.md) | Ventas y anulaciones |
| [cash.md](cash.md) | Caja diaria |
| [expenses.md](expenses.md) | Gastos operativos |
| [reports.md](reports.md) | Reportes y exportaciones |
| [auth.md](auth.md) | Login, perfiles, roles |

## Cómo usar una skill

1. Confirmar que la tarea coincide con la skill.
2. Leer reglas previas: `00-core`, `11-ai-behavior`, módulo en `domain/`.
3. Seguir el checklist de la skill en orden.
4. Marcar errores comunes al revisar.

## Reglas

- Una skill por tarea principal; no mezclar procedimientos.
- Si la skill pide algo que viola `rules/`, detenerse y preguntar.
- Actualizar la skill si el procedimiento cambió por ADR.

## Checklist

- [ ] ¿Existe skill para esta tarea?
- [ ] ¿Leí la skill completa antes de codear?
- [ ] ¿Consulté domain del módulo?

## Notas

- Skills de negocio listan archivos **permitidos** y **prohibidos** por capa.
- Para tareas no cubiertas: usar `create-feature.md` genérico.
