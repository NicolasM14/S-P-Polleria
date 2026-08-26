# Reglas de caja

## Objetivo

Control del **efectivo físico** en el local.

## Conceptos

| Concepto | Definición |
|----------|------------|
| Sesión | Período operativo con apertura y cierre |
| Saldo inicial | Efectivo al abrir |
| Efectivo esperado | Inicial + entradas efectivo − salidas efectivo |
| Contado | Lo que cuenta el dueño al cerrar |
| Diferencia | Contado − esperado |

## Apertura

- Un usuario abre sesión con monto inicial (puede ser 0).
- Registra movimiento `opening`.
- v1: **una sesión abierta** a la vez (política simple).

## Qué mueve la caja (efectivo físico)

| Origen | Efecto |
|--------|--------|
| Venta — pago cash | + |
| Compra — pago cash | − |
| Gasto — pago cash | − |
| Ingreso manual | + |
| Egreso manual | − |
| Transferencia / tarjeta | **No mueve caja** |

## Pagos múltiples

Solo la porción **cash** de cada operación afecta caja.

Ejemplo venta: 60% efectivo, 40% transferencia → solo 60% suma a caja.

## Cierre

- Usuario ingresa **efectivo contado**.
- Sistema calcula **esperado** desde movimientos.
- Guarda **diferencia** (sobrante/faltante).
- Sesión pasa a `closed`; no editar movimientos cerrados.

## Ingresos / egresos manuales

- Para casos no cubiertos por venta/compra/gasto automatizado.
- Requieren nota.
- Owner only v1.

## Checklist

- [ ] ¿Solo cash en movimientos de caja automáticos?
- [ ] ¿Sesión abierta antes de operar?
- [ ] ¿Cierre atómico vía RPC?

## Ejemplos

Apertura $20.000 → venta efectivo +$50.000 → gasto efectivo −$5.000 → esperado $65.000.

Si cuenta $64.500 → diferencia −$500.

## Notas

- ADR-004. Skill `cash.md`.
