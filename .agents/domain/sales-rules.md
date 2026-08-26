# Reglas de ventas

## Objetivo

Reglas de **venta en mostrador**: cantidades, pagos, anulación e impactos.

## Venta por kg

- Cantidad con **hasta 3 decimales**.
- Precio puede ser por kg; total línea = cantidad × precio unitario.
- Validar cantidad > 0.

## Venta por unidad

- Cantidades **enteras** (salvo excepción documentada).
- Total línea = cantidad × precio unitario.

## Combos

- Se venden como un ítem de combo.
- Stock se descuenta de **cada componente** según receta × cantidad vendida.
- Si falta stock de un componente → rechazar venta.

## Descuentos

- Descuento sobre total o línea según diseño UI (documentar en implementación).
- Total final ≥ 0.
- Pagos deben igualar **total después de descuento**.

## Pagos múltiples

- Una venta puede tener N pagos.
- **Regla:** `sum(pagos) = total_venta` exacto.
- Métodos: efectivo, transferencia, tarjeta, etc.
- **Solo efectivo** impacta caja física (ver cash-rules).

## Anulación

- Solo ventas no anuladas previamente.
- **No DELETE** del registro de venta.
- Marca anulada + movimientos inversos stock y caja (efectivo).
- Requiere confirmación UI.

## Impacto stock

- Simple: movimiento `sale` (−).
- Combo: movimientos `sale` por cada componente.
- Anulación: movimientos `sale_cancel` (+).

## Impacto caja

- Suma de pagos `cash` → movimiento `sale_cash` (+).
- Anulación revierte parte efectivo.

## Checklist

- [ ] Pagos = total
- [ ] Kg 3 dec / unidad entera
- [ ] Combo validó componentes
- [ ] Anulación revierte todo

## Ejemplos

Venta $10.000: $6.000 efectivo + $4.000 transferencia → caja +$6.000 only.

Anular → caja −$6.000; stock repuesto.

## Notas

- No hay cliente asociado a la venta en v1.
