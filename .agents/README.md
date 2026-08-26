# `.agents` — Contrato de desarrollo S&F Pollería

## Objetivo

`.agents` es la **fuente de verdad** para cualquier persona o agente de IA que modifique este proyecto. Define arquitectura, reglas de negocio, convenciones y procedimientos. Ninguna implementación puede contradecir lo documentado aquí sin un ADR aprobado.

## Qué es `.agents`

| Directorio | Propósito |
|------------|-----------|
| `rules/` | Reglas permanentes del proyecto (prioridad alta) |
| `skills/` | Procedimientos paso a paso para tareas concretas |
| `domain/` | Modelo de negocio, glosario y reglas funcionales |
| `decisions/` | Architecture Decision Records (ADRs) |
| `templates/` | Plantillas reutilizables para módulos, features, ADRs y migraciones |

## Orden obligatorio de lectura

Antes de escribir código, leer en este orden:

1. [`rules/00-core.md`](rules/00-core.md) — Reglas inviolables
2. [`rules/11-ai-behavior.md`](rules/11-ai-behavior.md) — Comportamiento de la IA
3. [`rules/01-architecture.md`](rules/01-architecture.md) — Capas y dependencias
4. [`rules/02-project-structure.md`](rules/02-project-structure.md) — Árbol de carpetas
5. [`domain/business-model.md`](domain/business-model.md) — Qué es y qué no es el sistema
6. Reglas del módulo afectado (`rules/07-business-rules.md` → `domain/`)
7. Skill aplicable (`skills/`) si existe para la tarea

## Prioridad entre reglas

```
00-core.md          ← Máxima prioridad
11-ai-behavior.md
01-architecture.md
02-project-structure.md
03-coding-standards.md
04-nextjs.md / 05-supabase.md / 06-security.md
07-business-rules.md → domain/
skills/             ← Procedimientos, no override de rules
decisions/ (ADRs)   ← Modifican rules solo tras aprobación explícita
```

En caso de conflicto: **gana el archivo de menor número en `rules/`**. Si el conflicto es de negocio, consultar `domain/` y preguntar al usuario.

## Cómo agregar nuevas reglas

1. Identificar si es regla permanente (`rules/`) o procedimiento (`skills/`).
2. Elegir el archivo existente más específico; no crear archivos nuevos en `rules/` sin autorización.
3. Seguir el formato: Objetivo → Reglas → Checklist → Ejemplos → Notas.
4. Si la regla cambia arquitectura o stack, crear un ADR primero.
5. Actualizar este README si cambia el índice o el orden de lectura.

## Cómo agregar ADRs

1. Copiar [`templates/adr-template.md`](templates/adr-template.md).
2. Numerar secuencialmente: `ADR-00N-titulo-corto.md`.
3. Guardar en `decisions/`.
4. Actualizar [`decisions/README.md`](decisions/README.md).
5. Referenciar el ADR desde la regla afectada si aplica.

## Cómo agregar Skills

1. Copiar la estructura de una skill existente del mismo tipo.
2. Guardar en `skills/` con nombre kebab-case descriptivo.
3. Actualizar [`skills/README.md`](skills/README.md).
4. Las skills **no reemplazan** reglas; complementan procedimientos.

---

## Índice navegable

### Reglas

| Archivo | Tema |
|---------|------|
| [00-core.md](rules/00-core.md) | Principios inviolables |
| [01-architecture.md](rules/01-architecture.md) | Clean Architecture |
| [02-project-structure.md](rules/02-project-structure.md) | Estructura de carpetas |
| [03-coding-standards.md](rules/03-coding-standards.md) | TypeScript, naming, convenciones |
| [04-nextjs.md](rules/04-nextjs.md) | App Router, RSC, Server Actions |
| [05-supabase.md](rules/05-supabase.md) | Auth, RLS, RPC, migraciones |
| [06-security.md](rules/06-security.md) | Seguridad y permisos |
| [07-business-rules.md](rules/07-business-rules.md) | Resumen de negocio |
| [08-ui-ux.md](rules/08-ui-ux.md) | Identidad visual y componentes |
| [09-testing.md](rules/09-testing.md) | Estrategia de pruebas |
| [10-git-workflow.md](rules/10-git-workflow.md) | Ramas, commits, PR |
| [11-ai-behavior.md](rules/11-ai-behavior.md) | Comportamiento de Cursor |

### Skills

| Archivo | Tema |
|---------|------|
| [README.md](skills/README.md) | Qué son y cuándo usarlas |
| [create-feature.md](skills/create-feature.md) | Nueva funcionalidad |
| [refactor-feature.md](skills/refactor-feature.md) | Refactor seguro |
| [create-module.md](skills/create-module.md) | Nuevo módulo de dominio |
| [supabase.md](skills/supabase.md) | Cambios en base de datos |
| [products.md](skills/products.md) | Productos y combos |
| [stock.md](skills/stock.md) | Stock y movimientos |
| [purchases.md](skills/purchases.md) | Compras |
| [sales.md](skills/sales.md) | Ventas |
| [cash.md](skills/cash.md) | Caja |
| [expenses.md](skills/expenses.md) | Gastos |
| [reports.md](skills/reports.md) | Reportes |
| [auth.md](skills/auth.md) | Autenticación |

### Dominio

| Archivo | Tema |
|---------|------|
| [README.md](domain/README.md) | Introducción al dominio |
| [glossary.md](domain/glossary.md) | Glosario |
| [business-model.md](domain/business-model.md) | Modelo de negocio |
| [entities.md](domain/entities.md) | Entidades |
| [business-flows.md](domain/business-flows.md) | Flujos principales |
| [stock-rules.md](domain/stock-rules.md) | Reglas de stock |
| [sales-rules.md](domain/sales-rules.md) | Reglas de ventas |
| [cash-rules.md](domain/cash-rules.md) | Reglas de caja |
| [purchase-rules.md](domain/purchase-rules.md) | Reglas de compras |
| [expense-rules.md](domain/expense-rules.md) | Reglas de gastos |

### Decisiones

| Archivo | Tema |
|---------|------|
| [README.md](decisions/README.md) | Índice de ADRs |
| [ADR-001-architecture.md](decisions/ADR-001-architecture.md) | Clean Architecture |
| [ADR-002-supabase.md](decisions/ADR-002-supabase.md) | Supabase como backend |
| [ADR-003-stock.md](decisions/ADR-003-stock.md) | Modelo de stock |
| [ADR-004-cash.md](decisions/ADR-004-cash.md) | Modelo de caja |
| [ADR-005-auth.md](decisions/ADR-005-auth.md) | Autenticación y roles |

### Plantillas

| Archivo | Uso |
|---------|-----|
| [module-template.md](templates/module-template.md) | Documentar un módulo |
| [adr-template.md](templates/adr-template.md) | Nuevo ADR |
| [feature-template.md](templates/feature-template.md) | Nueva funcionalidad |
| [migration-template.md](templates/migration-template.md) | Migración Supabase |

---

## Checklist — Antes de cualquier tarea

- [ ] Leí `00-core.md` y `11-ai-behavior.md`
- [ ] Identifiqué módulo y capa afectados
- [ ] Consulté `domain/` si hay reglas de negocio
- [ ] Busqué skill aplicable
- [ ] No voy a crear carpetas no documentadas en `02-project-structure.md`

## Notas

- Este proyecto se desarrolla con **Cursor** y agentes de IA durante meses; `.agents` evita deriva arquitectónica.
- La implementación de código vive fuera de `.agents` (en `src/`, `supabase/`, etc.) y debe obedecer este contrato.
- S&F Pollería: gestión interna de stock, ventas, caja, compras y gastos. Ver `domain/business-model.md`.
