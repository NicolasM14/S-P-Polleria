# Architecture Decision Records (ADRs)

## Objetivo

Índice de **decisiones arquitectónicas** irreversibles o costosas de cambiar.

## ADRs vigentes

| ID | Título | Estado |
|----|--------|--------|
| [ADR-001](ADR-001-architecture.md) | Clean Architecture modular | Aceptado |
| [ADR-002](ADR-002-supabase.md) | Supabase como backend | Aceptado |
| [ADR-003](ADR-003-stock.md) | Stock por movimientos | Aceptado |
| [ADR-004](ADR-004-cash.md) | Caja solo efectivo físico | Aceptado |
| [ADR-005](ADR-005-auth.md) | Auth y roles | Aceptado |

## Cómo agregar

1. Copiar [`templates/adr-template.md`](../templates/adr-template.md)
2. Numerar secuencialmente
3. Estado: Propuesto → Aceptado | Rechazado | Supersedido
4. Actualizar esta tabla

## Reglas

- ADR aceptado modifica reglas solo tras actualizar `rules/` referenciadas.
- No borrar ADRs; marcar supersedido y enlazar reemplazo.

## Checklist

- [ ] ¿El cambio propuesto requiere ADR?

## Notas

- Fecha de creación inicial: 2026-08.
