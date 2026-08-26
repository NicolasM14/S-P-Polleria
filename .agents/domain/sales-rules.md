# Reglas de ventas

## Objetivo

Reglas de **venta en mostrador**: cantidades, pagos, anulación e impactos.

## Venta por kg (UI en gramos)

- En pantalla se ingresan **gramos enteros** (como la balanza: `1200` = 1,2 kg).
- Internamente se guarda en **kg** (`gramos / 1000`).
- Precio es **por kg**; total línea = (gramos/1000) × precio/kg.
- Validar gramos > 0 (enteros).

## Venta por unidad

- No usado en la operación actual (solo gramos/kg).

## Combos

- No se usan en la app actual.

## Descuentos

- Descuento sobre total o línea según diseño UI (documentar en implementación).
- Total final ≥ 0.
- Pagos deben igualar **total después de descuento**.

## Pagos múltiples

- Una venta puede tener N pagos.
- **Regla:** `sum(pagos) = total_venta` exacto.
- Métodos activos: **efectivo** y **transferencia** (sin tarjeta).
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
