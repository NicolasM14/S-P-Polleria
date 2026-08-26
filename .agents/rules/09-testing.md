# 09 — Testing

## Objetivo

Definir **qué probar**, qué no, y el checklist antes de cerrar una tarea.

## Responsabilidades

Guía para unit, integration y e2e (cuando existan). Prioriza casos críticos de negocio.

## Qué probar

| Prioridad | Qué | Dónde |
|-----------|-----|-------|
| Alta | Reglas de dominio puras | `modules/*/domain/*.test.ts` |
| Alta | Validaciones Zod | `shared/validations/*.test.ts` |
| Alta | Funciones RPC (integración DB) | `tests/integration/` |
| Media | Use cases con repos mockeados | `modules/*/application/*.test.ts` |
| Media | Mappers infrastructure | `modules/*/infrastructure/*.test.ts` |
| Baja | Snapshots de UI | Solo componentes complejos |

## Qué no probar

- Implementación interna de shadcn/ui
- Getters/setters triviales
- Config de Tailwind/Next
- Código generado

## Casos críticos obligatorios (cuando exista el módulo)

| Módulo | Casos |
|--------|-------|
| Stock | Movimiento aumenta/disminuye; no saldo negativo no permitido |
| Ventas | Venta kg 3 dec.; combo descuenta componentes; pagos suman total |
| Ventas | Anulación revierte stock y caja |
| Caja | Solo efectivo en movimientos; cierre calcula diferencia |
| Compras | Pagos múltiples; stock incrementa |
| Auth | Rutas protegidas sin sesión |

## Estructura

```text
tests/
├── unit/           # Dominio y utils
├── integration/    # Supabase local / test project
└── e2e/            # Flujos completos (opcional fase 2)
```

## Herramientas (cuando se configure)

- Vitest para unit/integration
- Testing Library para componentes si hace falta
- Supabase CLI para DB local en integración

## Reglas

1. Tests determinísticos; no depender de fecha/hora sin mock.
2. Nombre descriptivo: `should reject sale when payment sum differs from total`.
3. Un assert principal por test cuando sea posible.
4. Mockear Supabase en unit de application; DB real en integration crítica.
5. No skip tests sin issue/ticket referenciado.

## Checklist antes de cerrar tarea

- [ ] ¿Hay regla de dominio nueva? → test unitario
- [ ] ¿Hay RPC nueva? → test integración
- [ ] ¿Caso feliz + al menos un error path?
- [ ] ¿Tests pasan localmente?
- [ ] ¿No agregué tests triviales?

## Ejemplos

```typescript
describe('validatePaymentTotal', () => {
  it('should reject when payments do not sum to sale total', () => {
    expect(() => validatePayments(total, payments)).toThrow('PAYMENT_MISMATCH');
  });
});
```

## Notas

- Cobertura numérica no es meta; **casos de negocio críticos** sí lo son.
- CI ejecutará tests cuando se configure pipeline (ver `10-git-workflow.md`).
