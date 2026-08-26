# Skill — Caja

## Objetivo

Gestionar **caja física diaria**: apertura, movimientos, cierre y arqueo.

## Responsabilidad del módulo

- Sesión de caja (turno/día)
- Saldo inicial
- Ingresos/egresos manuales
- Reflejo de ventas/compras/gastos en efectivo
- Cierre con efectivo esperado vs contado

## Flujo

```
Apertura (monto inicial) → operaciones del día → Cierre
  efectivo_esperado = inicial + entradas_efectivo - salidas_efectivo
  diferencia = contado - esperado
```

## Checklist

- [ ] Una caja abierta por usuario/turno según regla definida
- [ ] Movimientos inmutables; corrección vía contra-movimiento
- [ ] Cierre RPC atómico
- [ ] No mezclar transferencia/tarjeta en saldo físico
- [ ] Reporte post-cierre

## Archivos permitidos

`modules/cash/**`, `cash_sessions`, `cash_movements`, RPC cierre.

## Archivos prohibidos

- Calcular totales solo en UI sin persistir
- Editar movimiento histórico

## Errores comunes

| Error | Correcto |
|-------|----------|
| Sumar todos los pagos de venta a caja | Solo efectivo |
| Cierre sin sesión abierta | Validar estado |
| Dos cierres mismo día sin regla | Documentar política |

## Ejemplos

Apertura $50.000 → ventas efectivo +$200.000 → gasto efectivo -$30.000 → esperado $220.000.

## Notas

- `domain/cash-rules.md`, ADR-004.
