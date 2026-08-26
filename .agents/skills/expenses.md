# Skill — Gastos

## Objetivo

Registrar **gastos operativos** con categoría e impacto en caja cuando corresponda.

## Responsabilidad del módulo

- ABM gastos (monto, categoría, fecha, nota)
- Método de pago
- Egreso de caja si efectivo
- Historial y filtros

## Flujo

```
Registrar gasto → si payment=cash → cash_movement (-)
                → si no cash → solo registro contable interno
```

## Checklist

- [ ] Categorías predefinidas + posible "Otros"
- [ ] Monto > 0
- [ ] Fecha no futura (validar)
- [ ] Usuario registrador
- [ ] No duplicar egreso caja y gasto

## Archivos permitidos

`modules/expenses/**`, `expenses`, `expense_categories`.

## Archivos prohibidos

- Gastos como compras de mercadería (usar purchases)
- Modificar caja sin pasar por cash module/RPC

## Errores comunes

| Error | Correcto |
|-------|----------|
| Gasto transferencia resta caja física | Solo efectivo |
| Sin categoría | Obligatoria o default |
| Borrar gasto | Anular/registrar reversa |

## Ejemplos

"Gas" $15.000 efectivo → expense + cash_movement -$15.000.

## Notas

- `domain/expense-rules.md`
