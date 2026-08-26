# 00 — Reglas core

## Objetivo

Establecer las reglas **inviolables** del proyecto. Tienen prioridad máxima sobre cualquier otra documentación, skill o sugerencia del agente.

## Responsabilidades

Este archivo protege:

- La arquitectura acordada
- El alcance del negocio
- La calidad y mantenibilidad del código
- La confianza del equipo en cambios incrementales

## Reglas

### Alcance y negocio

| # | Regla |
|---|-------|
| 1 | **Nunca inventar funcionalidades** no solicitadas ni documentadas en `domain/`. |
| 2 | **Nunca crear módulos** no listados en `02-project-structure.md` sin ADR + aprobación. |
| 3 | **Siempre preguntar** cuando exista ambigüedad de negocio; no asumir. |
| 4 | El sistema es **gestión interna**; no agregar WhatsApp, clientes, reparto, ARCA/AFIP ni multi-sucursal sin autorización explícita. |

### Arquitectura y código

| # | Regla |
|---|-------|
| 5 | **Nunca modificar arquitectura** (capas, dependencias, estructura de módulos) sin ADR aprobado. |
| 6 | **Nunca duplicar lógica**; buscar en `shared/` y módulos existentes antes de crear. |
| 7 | **Siempre reutilizar** componentes, validaciones y utilidades existentes. |
| 8 | **Cambios mínimos necesarios** para cumplir el requerimiento; no expandir scope. |
| 9 | **No hacer refactors ocultos** dentro de una tarea que pide otra cosa. |
| 10 | **No crear dependencias npm** innecesarias; justificar cada nueva librería. |

### Estructura y archivos

| # | Regla |
|---|-------|
| 11 | **Nunca crear carpetas** no documentadas en `02-project-structure.md`. |
| 12 | **Nunca mover archivos** sin motivo de negocio o arquitectura documentado. |
| 13 | **Nunca eliminar código** sin explicar impacto y alternativa. |
| 14 | Cada archivo tiene **una responsabilidad**; no mezclar capas en un solo archivo. |

### Datos e integridad

| # | Regla |
|---|-------|
| 15 | **Nunca modificar stock directamente** en tablas; siempre vía movimientos o funciones atómicas. |
| 16 | **Nunca usar `service_role`** en cliente ni en código expuesto al navegador. |
| 17 | Operaciones críticas (venta, anulación, cierre de caja) **solo vía RPC/funciones SQL** atómicas. |

### IA y comunicación

| # | Regla |
|---|-------|
| 18 | Antes de codificar: leer reglas aplicables, identificar módulo/capa, buscar reutilización, **explicar plan**. |
| 19 | Al terminar: indicar archivos modificados, motivo, impacto y validaciones. |
| 20 | Actuar como **desarrollador senior** que respeta el contrato, no como generador de código a ciegas. |

## Checklist

- [ ] ¿La tarea está explícitamente solicitada?
- [ ] ¿Existe documentación en `domain/` o `rules/` que la cubra?
- [ ] ¿Puedo reutilizar algo existente?
- [ ] ¿El cambio es el mínimo necesario?
- [ ] ¿Necesito un ADR antes de proceder?

## Ejemplos

### Correcto

> Usuario pide "listado de productos activos". El agente lee `skills/products.md`, implementa en `modules/products/presentation/` reutilizando la tabla de `shared/components/`, y consulta el repositorio existente en `infrastructure/`.

### Incorrecto

> Usuario pide "listado de productos". El agente crea `src/services/ProductService.ts` fuera de módulos, agrega módulo `inventory/` no documentado, e instala una librería de tablas nueva.

## Notas

- Ante duda entre velocidad y contrato: **gana el contrato**.
- Si una regla de este archivo entra en conflicto con una skill, **gana este archivo**.
- Cambios a este documento requieren aprobación explícita del responsable del proyecto.
