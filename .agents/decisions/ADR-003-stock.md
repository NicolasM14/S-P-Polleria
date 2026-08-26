# ADR-003 — Stock por movimientos

## Estado

Aceptado

## Contexto

El inventario de una pollería mezcla kg (3 decimales) y unidades. Editar un campo `stock` directo impide auditoría y genera errores en concurrencia. Combos no tienen stock propio.

## Decisión

1. **Stock = suma de movimientos** (materializado o calculado).
2. Tabla/registro de movimientos **inmutable** (correcciones vía contra-movimiento).
3. Productos **simples** únicamente tienen saldo.
4. **Combos** descuentan componentes al vender.
5. Precisión **NUMERIC(12,3)** para kg.
6. Cambios de stock en operaciones comerciales solo vía **RPC** (venta, compra, anulación, ajuste).

## Motivo

- Trazabilidad completa para dueños.
- Reversión clara en anulaciones.
- Una sola vía de verdad.

## Consecuencias

### Positivas

- Historial consultable.
- Reconciliación posible.
- Menos bugs de "stock fantasma".

### Negativas

- Más filas que un campo único.
- RPC obligatoria para operaciones compuestas.

## Checklist

- [ ] Sin UPDATE directo a saldo
- [ ] Combo expande componentes
- [ ] 3 decimales kg

## Ejemplos

Compra +10 kg → movement +10. Venta −0,750 kg → movement −0,750.

## Notas

- Ver `domain/stock-rules.md`.
