# Skill — Ventas

## Objetivo

Registrar **ventas** por kg/unidad/combos con pagos múltiples, impacto stock y caja, y anulación.

## Responsabilidad del módulo

- POS interno (sin clientes registrados)
- Ítems con cantidad y precio
- Descuentos (si reglas lo permiten)
- Pagos múltiples
- Anulación con reversión

## Flujo

```
Nueva venta → ítems → total → pagos → RPC create_sale
  → descuenta stock (simples o componentes combo)
  → caja + efectivo
Anulación → RPC cancel_sale → movimientos inversos, marca anulada
```

## Checklist

- [ ] Kg: step 0.001
- [ ] Combo expande a componentes en RPC
- [ ] Pagos suman total (post-descuento)
- [ ] Anulación no borra fila; revierte efectos
- [ ] Solo efectivo mueve caja

## Archivos permitidos

`modules/sales/**`, `sales`, `sale_items`, `sale_payments`, RPC venta/anulación.

## Archivos prohibidos

- Stock update en TS multi-step sin transacción
- Módulo `customers/`

## Errores comunes

| Error | Consecuencia |
|-------|--------------|
| Vender combo descontando combo | Stock combo N/A |
| Anular sin revertir caja | Arqueo mal |
| Permitir editar venta cerrada | Usar anulación + nueva |

## Ejemplos

Venta 1,250 kg pollo a $X/kg + 1 gaseosa; pago $Y efectivo + $Z tarjeta (tarjeta no suma a caja física).

## Notas

- `domain/sales-rules.md`, ADR-003, ADR-004.
