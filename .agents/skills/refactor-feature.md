# Skill — Refactorizar funcionalidad

## Objetivo

Mejorar estructura o legibilidad **sin cambiar comportamiento observable** ni violar arquitectura.

## Responsabilidades

Refactors localizados, reversibles, con tests pasando antes y después.

## Checklist

### Antes

- [ ] Comportamiento actual entendido (o tests existentes)
- [ ] Refactor solicitado o claramente necesario (no "while I'm here")
- [ ] No mezclar con feature nueva en mismo PR

### Durante

- [ ] Mover código entre capas solo si corrige violación de `01-architecture.md`
- [ ] Extraer a `shared/` solo si es genérico (sin reglas de negocio)
- [ ] Renombrar con búsqueda global; actualizar imports
- [ ] Mantener commits/ diff acotado

### Después

- [ ] Mismo comportamiento (tests + smoke manual)
- [ ] Sin carpetas nuevas no documentadas
- [ ] Documentar si el refactor habilita feature futura

## Archivos permitidos

Archivos del módulo/feature afectados; `shared/` si extracción justificada.

## Archivos prohibidos

- Cambiar firmas RPC sin migración
- Alterar reglas de negocio disfrazadas de refactor
- `domain/` imports hacia infrastructure

## Errores comunes

| Error | Consecuencia |
|-------|--------------|
| Refactor + feature | PR imposible de revisar |
| Mover sin tests | Regresiones silenciosas |
| Abstracción prematura | Complejidad innecesaria |

## Ejemplos

**OK:** Extraer `formatCurrency` duplicado a `shared/utils/currency.ts`.

**NO OK:** Renombrar módulo `sales` a `orders` sin ADR.

## Notas

- Si el refactor revela bug, fix en commit/PR separado.
