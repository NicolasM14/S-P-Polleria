# Skill — Stock

## Objetivo

Gestionar **saldos y movimientos** de stock sin modificar cantidades directamente.

## Responsabilidad del módulo

- Consulta saldos actuales
- Historial de movimientos
- Ajustes manuales autorizados
- Entrada por compras / salida por ventas (vía otros módulos + RPC)

## Flujo

```
Cualquier cambio → INSERT stock_movement → trigger/RPC actualiza saldo
Tipos: purchase, sale, sale_cancel, adjustment, ...
```

## Checklist

- [ ] Nunca `UPDATE products SET stock = ...` directo
- [ ] Cantidad kg: NUMERIC(12,3)
- [ ] Movimiento con referencia (sale_id, purchase_id, etc.)
- [ ] Usuario y timestamp en movimiento
- [ ] Validar saldo no negativo si regla de negocio lo prohíbe

## Archivos permitidos

`modules/stock/**`, `stock_movements` migraciones, RPC relacionadas.

## Archivos prohibidos

- Descuento stock en módulo sales sin pasar por movimiento/RPC
- Pantalla que edite saldo como input libre sin tipo ajuste

## Errores comunes

| Error | Riesgo |
|-------|--------|
| Doble descuento en venta + manual | Inventario incorrecto |
| Redondeo a 2 dec en kg | Pérdida de gramos |
| Sin auditoría | Imposible reconciliar |

## Ejemplos

Ajuste: "Encontré 0,500 kg menos en cámara" → movimiento `adjustment` -0.500 con nota.

## Notas

- Ver ADR-003, `domain/stock-rules.md`.
