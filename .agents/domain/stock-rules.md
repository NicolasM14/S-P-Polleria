# Reglas de stock

## Objetivo

Reglas **exclusivas** de inventario para productos simples.

## Reglas fundamentales

1. **Solo productos simples** tienen stock; combos **nunca**.
2. **Nunca modificar saldo directamente** en pantalla o SQL ad hoc; siempre vía `stock_movement`.
3. **Kg:** precision **3 decimales** (ej. 1,250 kg).
4. **Unidad:** cantidades enteras salvo definición contraria explícita.
5. Todo movimiento tiene **tipo**, **referencia**, **usuario** y **timestamp**.

## Tipos de movimiento

| Tipo | Origen | Signo |
|------|--------|-------|
| purchase | Compra confirmada | + |
| sale | Venta confirmada | − |
| sale_cancel | Anulación venta | + (reversa) |
| adjustment | Ajuste manual autorizado | + / − |

## Saldo

- Saldo actual = suma algebraica de movimientos (o cache mantenido por trigger/RPC).
- Consultas de stock leen saldo calculado o materializado, no editan.

## Ajustes manuales

- Requieren motivo/nota.
- Solo usuarios owner (v1).
- Ejemplo real: "Merma 0,300 kg pollo — vencido".

## Combos y stock

Al vender combo "Promo":

```
Venta 1 × Promo
  → −1,000 kg pollo (componente)
  → −2 unidades gaseosa (componente)
```

No existe fila de stock para "Promo".

## Prohibiciones

- Stock negativo: **no permitido** por defecto (validar en RPC).
- Editar movimiento histórico: prohibido; crear contra-movimiento.
- Inventario sin auditoría.

## Checklist

- [ ] ¿Movimiento registrado?
- [ ] ¿3 decimales en kg?
- [ ] ¿Combo expandió componentes?

## Ejemplos

| Acción | Resultado |
|--------|-----------|
| Compra 10 kg pollo | +10,000 kg en movimientos |
| Venta 0,750 kg | −0,750 kg |
| Ajuste −0,500 kg | movement adjustment |

## Notas

- ADR-003. Skill `stock.md`.
