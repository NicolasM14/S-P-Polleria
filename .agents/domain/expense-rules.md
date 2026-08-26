# Reglas de gastos

## Objetivo

Registro de **gastos operativos** no mercadería.

## Gasto

- Monto > 0
- Fecha (no futura)
- Categoría obligatoria
- Descripción/nota recomendada
- Método de pago

## Categorías (iniciales sugeridas)

| Categoría | Ejemplos |
|-----------|----------|
| Servicios | Luz, gas, internet |
| Limpieza | Insumos limpieza |
| Mantenimiento | Reparaciones |
| Sueldos | Pagos personal (futuro) |
| Otros | Misceláneo |

Extensible por dueños; no categorías por compra de mercadería (usar compras).

## Impacto caja

| Método | Caja |
|--------|------|
| Efectivo | Egreso (−) |
| Transferencia / otro | Sin movimiento caja |

## Historial

- Listado filtrable por fecha y categoría.
- No eliminar; anular/reversar si se implementa (movimiento contra).

## Diferencia vs compra

| | Compra | Gasto |
|---|--------|-------|
| Afecta stock mercadería | Sí | No |
| Ítems producto | Sí | No |
| Categoría gasto | No | Sí |

## Checklist

- [ ] Categoría asignada
- [ ] Efectivo → movimiento caja
- [ ] No duplicar en compras

## Ejemplos

"Pago gas enero $45.000 transferencia" → solo registro gasto, caja sin cambio.

"Compra detergente $3.000 efectivo" → gasto + caja −$3.000.

## Notas

- Skill `expenses.md`.
