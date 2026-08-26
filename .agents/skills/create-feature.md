# Skill — Crear funcionalidad

## Objetivo

Proceso estándar para implementar una **nueva funcionalidad** respetando Clean Architecture y `.agents`.

## Responsabilidades

Guía desde el requerimiento hasta el cierre, sin saltar capas ni inventar scope.

## Flujo

```
Requerimiento → Dominio → Plan → Capas (domain→app→infra→presentation) → Ruta → Tests → Cierre
```

## Checklist

### 1. Entender

- [ ] Requerimiento explícito del usuario (no inferir extras)
- [ ] Leer `domain/` del módulo afectado
- [ ] Verificar módulo existe en `02-project-structure.md`
- [ ] Buscar código similar reutilizable

### 2. Planificar

- [ ] Identificar módulo y capas
- [ ] Listar archivos nuevos/modificados
- [ ] ¿Necesita migración Supabase? → skill `supabase.md`
- [ ] ¿Necesita ADR? (solo si cambia arquitectura/stack)
- [ ] Comunicar plan si la tarea es mediana/grande

### 3. Domain (si aplica)

- [ ] Entidades / reglas puras
- [ ] Ports (interfaces repositorio)
- [ ] Sin imports de React o Supabase

### 4. Application

- [ ] Use case(s) con input/output tipados
- [ ] Orquestación; delega persistencia a ports

### 5. Infrastructure

- [ ] Implementación repositorio Supabase
- [ ] Mappers DB ↔ domain
- [ ] RPC si operación crítica

### 6. Presentation

- [ ] Componentes UI según `08-ui-ux.md`
- [ ] Server Actions con Zod
- [ ] Estados loading/error/vacío

### 7. App Router

- [ ] Ruta delgada en `src/app/`
- [ ] Layout/metadata si corresponde

### 8. Validar

- [ ] Tests según `09-testing.md`
- [ ] Lint/typecheck
- [ ] Prueba manual documentada en cierre

### 9. Cerrar

- [ ] Reportar archivos, motivo, impacto, validaciones
- [ ] Actualizar `.agents` solo si cambió regla acordada

## Archivos permitidos

Todo bajo el módulo afectado + `src/app/` + `shared/` (si reutilizable) + `supabase/migrations/` si aplica.

## Archivos prohibidos

- Carpetas nuevas no documentadas
- Lógica de negocio en `page.tsx`
- Queries sueltas fuera de infrastructure

## Errores comunes

| Error | Evitar |
|-------|--------|
| Feature creep | Stick to requerimiento |
| UI primero | Domain/application antes si hay reglas |
| Skip RPC | Ventas/compras/caja = atómico |
| God component | Dividir presentation |

## Ejemplos

**Pedido:** "Formulario de gasto con categoría y monto."

→ Módulo `expenses` → schema Zod → `create-expense.use-case.ts` → repo → `ExpenseForm` → ruta `/gastos/nuevo`.

## Notas

- Funcionalidades pequeñas pueden omitir domain nuevo si solo componen existentes; justificar en plan.
