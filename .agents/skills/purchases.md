# Skill — Compras

## Objetivo

Registrar **ingreso de mercadería** con pagos múltiples e impacto en stock y caja.

## Responsabilidad del módulo

- Cabecera compra (proveedor texto libre v1, fecha, total)
- Ítems (producto, cantidad, costo)
- Pagos múltiples (efectivo, transferencia, etc.)
- Generar movimientos stock (+) y caja (- efectivo)

## Flujo

```
Crear compra → ítems → pagos (suma = total) → RPC atómica
  → stock_movements (+)
  → cash_movements (-) solo por parte efectivo
  → purchase_payments registrados
```

## Checklist

- [ ] Suma pagos = total compra
- [ ] Al menos un ítem
- [ ] Cantidades respetan unit del producto
- [ ] RPC transaccional
- [ ] Historial consultable; anulación futura vía movimiento inverso (si se implementa)

## Archivos permitidos

`modules/purchases/**`, tablas `purchases`, `purchase_items`, `purchase_payments`.

## Archivos prohibidos

- Incrementar stock sin movimiento
- Registrar transferencia como egreso de caja física

## Errores comunes

| Error | Correcto |
|-------|----------|
| Pago 60+40 ≠ total | Validar antes RPC |
| Olvidar decimales kg | 3 decimales |
| Compra sin usuario | Audit user_id |

## Ejemplos

Compra $100.000: $60.000 efectivo + $40.000 transferencia → caja -$60.000 only.

## Notas

- `domain/purchase-rules.md`
