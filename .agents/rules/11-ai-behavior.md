# 11 — Comportamiento de la IA (Cursor)

## Objetivo

Definir **exactamente** cómo debe comportarse Cursor y cualquier agente al modificar este repositorio.

## Responsabilidades

Complementa `00-core.md` con un flujo operativo concreto. Prioridad: segunda solo después de core.

---

## Antes de escribir código

Siempre ejecutar este orden:

1. **Leer reglas aplicables** — mínimo: `00-core`, este archivo, `01-architecture`, módulo/skill relevante.
2. **Identificar módulo** — `products`, `sales`, etc.; si no encaja, preguntar.
3. **Identificar capa** — domain / application / infrastructure / presentation.
4. **Buscar reutilización** — grep en `shared/` y módulo antes de crear.
5. **Explicar plan** — archivos a tocar, enfoque, riesgos; esperar OK si la tarea es grande o ambigua.

### Plantilla de plan (tareas no triviales)

```markdown
## Plan
- Módulo: sales
- Capa: application + infrastructure
- Archivos: create-sale.use-case.ts, supabase-sale.repository.ts
- Reutiliza: createSaleSchema, MoneyInput
- No haré: módulos nuevos, deps nuevas, refactor colateral
```

---

## Prohibiciones

Nunca:

| # | Prohibición |
|---|-------------|
| 1 | Crear carpetas no listadas en `02-project-structure.md` |
| 2 | Mover archivos sin motivo documentado en el plan |
| 3 | Eliminar código sin explicar impacto y alternativa |
| 4 | Cambiar arquitectura de capas o dependencias |
| 5 | Cambiar reglas de negocio sin actualizar `domain/` + aprobación |
| 6 | Instalar dependencias npm sin justificar |
| 7 | Hacer cambios masivos no solicitados ("while I'm here") |
| 8 | Implementar features fuera de alcance (`business-model.md`) |
| 9 | Duplicar lógica existente |
| 10 | Commitear/pushear sin que el usuario lo pida |
| 11 | Exponer secretos en código, logs o respuestas |
| 12 | Saltarse RPC atómicas para operaciones críticas |

---

## Obligaciones

Siempre indicar al cerrar la tarea:

| Campo | Contenido |
|-------|-----------|
| **Archivos modificados** | Lista con paths |
| **Motivo** | Qué requerimiento cumple |
| **Impacto** | Módulos, DB, UI afectados |
| **Validaciones** | Tests, lint, prueba manual sugerida |

Actuar como **desarrollador senior**: conservador, explícito, mínimo diff.

---

## Durante la implementación

1. **Un concern por commit lógico** (si el usuario pide commits).
2. **Respetar convenciones** de `03-coding-standards.md`.
3. **Validar input** en Server Actions y APIs.
4. **Actualizar `.agents`** si la tarea introduce regla nueva acordada con el usuario.
5. **No TODOs vagos** — implementar o crear issue explícito.

---

## Cuándo preguntar al usuario

- Ambigüedad de negocio (ej. ¿anulación parcial permitida?)
- Nueva dependencia npm
- Nuevo módulo o carpeta
- Cambio que contradice `domain/`
- Operación destructiva (drop column, delete data)
- Scope creep detectado

---

## Skills vs Rules

| Usar | Cuándo |
|------|--------|
| `rules/` | Límites permanentes |
| `skills/` | Procedimiento paso a paso de una tarea |
| `domain/` | Verdad funcional del negocio |

Si skill y rule chocan → **gana rule**.

---

## Checklist de sesión

- [ ] Leí documentación obligatoria
- [ ] Plan comunicado (si aplica)
- [ ] Sin carpetas/archivos arbitrarios
- [ ] Cierre con archivos, motivo, impacto, validaciones

## Ejemplos

### Comportamiento correcto

> Usuario: "Agregar listado de gastos."
> Agente: Lee `skills/expenses.md`, `domain/expense-rules.md`, implementa en `modules/expenses/presentation/`, reutiliza tabla de `shared/`, reporta 3 archivos tocados y sugiere probar filtro por fecha.

### Comportamiento incorrecto

> Agente: Crea `src/pages/gastos.tsx`, agrega librería de charts, implementa export PDF no pedido, y commitea sin avisar.

## Notas

- Este proyecto vivirá meses con IA; la disciplina aquí evita deuda documental.
- Ante conflicto con instrucciones del usuario en chat: **priorizar instrucción explícita reciente**, pero advertir si viola core rules.
