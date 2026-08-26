# 10 — Git workflow

## Objetivo

Flujo Git claro para trabajo continuo con Scrum y revisión de cambios.

## Responsabilidades

Ramas, commits, PRs y merges. Preparado para equipo pequeño (1–2 dueños + IA).

## Ramas

| Rama | Uso |
|------|-----|
| `main` | Producción / estable; siempre deployable |
| `develop` | Integración (opcional si el equipo crece) |
| `feature/*` | Nueva funcionalidad: `feature/ventas-pagos-multiples` |
| `fix/*` | Corrección: `fix/stock-decimal-rounding` |
| `chore/*` | Tooling, deps: `chore/setup-vitest` |
| `docs/*` | Solo `.agents` o README: `docs/adr-stock` |

Regla: **no commitear directo a `main`** salvo hotfix acordado.

## Commits

Formato **Conventional Commits**:

```
tipo(alcance): descripción breve en imperativo

[cuerpo opcional]
```

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Bugfix |
| `docs` | Documentación |
| `refactor` | Sin cambio funcional |
| `test` | Tests |
| `chore` | Mantenimiento |

Ejemplos:

```
feat(sales): add multi-payment support on checkout
fix(stock): round kg quantities to 3 decimals
docs(agents): add purchase-rules to domain
```

## Pull Requests

- Título = primera línea del commit principal
- Descripción: qué, por qué, cómo probar
- Tamaño: preferir PRs < 400 líneas
- Referenciar issue/tarea Scrum si existe
- Checklist de `09-testing.md` en descripción

## Merges

- **Squash merge** a `main` para historial limpio (preferido)
- Resolver conflictos localmente; no force push a `main`
- Borrar rama feature después del merge

## Scrum

| Evento | Git |
|--------|-----|
| Sprint planning | Crear ramas `feature/*` por ítem |
| Durante sprint | Commits frecuentes en rama feature |
| Review | PR hacia `main` |
| Release | Tag semver opcional: `v0.1.0` |

## Reglas

1. Commits atómicos y descriptivos.
2. No mezclar refactor masivo + feature en un PR.
3. No commitear `.env.local`, `node_modules`, secrets.
4. `.agents/` cambia en PRs `docs/*` o junto a la feature que documenta.
5. La IA no hace push/merge sin solicitud explícita del usuario.

## Checklist

- [ ] ¿Rama con prefijo correcto?
- [ ] ¿Commit conventional?
- [ ] ¿PR con descripción y test plan?
- [ ] ¿Sin archivos sensibles?

## Ejemplos

### Mal

```
fix stuff
updated files
wip
```

### Bien

```
feat(cash): implement daily cash register close
```

## Notas

- GitHub repo: `S-P-Polleria` (sin `&` por restricción de GitHub).
- Hooks pre-commit (lint/test) se agregarán en setup del proyecto.
