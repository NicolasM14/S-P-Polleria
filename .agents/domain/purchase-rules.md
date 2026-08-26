# Reglas de compras

## Objetivo

Reglas de **ingreso de mercadería** y su impacto financiero/stock.

## Compra

- Representa llegada de productos al local.
- Proveedor: texto libre v1 (sin ABM proveedores obligatorio).
- Fecha de compra registrable (default hoy).

## Ítems

- Solo **productos simples** (no combos).
- Cantidad según unidad del producto (kg 3 dec., unidad entera).
- Costo unitario ≥ 0; extiende valorización de stock.

## Total

- `total = sum(cantidad × costo_unitario)` por línea (+ impuestos si se agregan después).

## Pagos múltiples

- **Obligatorio:** suma de pagos = total compra.
- Ejemplo: 60% efectivo, 40% transferencia.
- Efectivo → egreso de caja; transferencia → no afecta caja física.

## Impacto stock

- Por cada ítem: movimiento `purchase` (+ cantidad).

## Impacto caja

- Por cada pago `cash`: movimiento caja (− monto).

## Historial

- Compras listadas con ítems y pagos.
- Anulación de compra: feature futura; si se implementa, usar reversa simétrica a ventas.

## Checklist

- [ ] Ítems solo simples
- [ ] Pagos = total
- [ ] Stock y caja vía RPC
- [ ] Usuario auditoría

## Ejemplos

Compra 50 kg pollo a $X/kg, total $T, pago 100% efectivo → stock +50 kg, caja −$T.

## Notas

- Skill `purchases.md`.
