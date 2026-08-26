# Flujos de negocio

## Objetivo

Diagramas **ASCII** de los flujos principales del sistema.

---

## Compra (ingreso mercadería)

```
[Usuario dueño]
      │
      ▼
[Cargar ítems + costos]
      │
      ▼
[Definir pagos múltiples] ── suma = total ?
      │ sí
      ▼
[Confirmar compra] ──RPC──► [purchase + items + payments]
      │
      ├──► stock_movements (+) por ítem
      └──► cash_movement (−) por parte en efectivo
```

---

## Venta

```
[Usuario]
      │
      ▼
[Agregar productos / combos]
      │
      ▼
[Aplicar descuento opcional]
      │
      ▼
[Pagos múltiples] ── suma = total ?
      │ sí
      ▼
[Confirmar venta] ──RPC──► [sale + items + payments]
      │
      ├──► stock: − simples
      ├──► stock: − componentes si combo
      └──► cash: + parte efectivo
```

---

## Anulación de venta

```
[Venta activa seleccionada]
      │
      ▼
[Confirmar anulación]
      │
      ▼
[RPC cancel_sale]
      │
      ├──► marca venta anulada (no DELETE)
      ├──► stock_movements reversa
      └──► cash_movement reversa (efectivo)
```

---

## Ajuste de stock

```
[Producto simple]
      │
      ▼
[Cantidad +/- y motivo]
      │
      ▼
[movement type=adjustment]
      │
      └──► actualiza saldo vía movimiento
```

---

## Caja diaria

```
[Apertura: monto inicial]
      │
      ▼
[Operaciones del día: ventas/compras/gastos/manuales]
      │        (solo efectivo mueve caja)
      ▼
[Cierre: contar efectivo]
      │
      ▼
[Calcular esperado vs contado → diferencia]
      │
      └──► cerrar sesión (inmutable)
```

---

## Gasto

```
[Registrar gasto + categoría]
      │
      ▼
{¿pago efectivo?}
   sí │     │ no
      ▼     ▼
 cash (−)  solo expense
```

## Checklist

- [ ] ¿El flujo implementado coincide con el diagrama?

## Notas

- Variantes futuras (anular compra) requieren actualizar este documento.
