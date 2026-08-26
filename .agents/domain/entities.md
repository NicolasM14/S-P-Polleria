# Entidades del dominio

## Objetivo

Describir **entidades** y sus responsabilidades conceptuales, sin SQL.

## Entidades principales

### Usuario / Perfil

- Identidad de login (Auth externo)
- Nombre visible
- Rol: owner | employee

### Producto

- Nombre, código opcional, activo/inactivo
- Tipo: simple | combo
- Unidad de medida (simples): kg | unit
- Precio referencia venta
- **Simple:** tiene saldo de stock
- **Combo:** tiene receta (lista componente + cantidad)

### Receta (ComboItem)

- Producto combo → producto componente + cantidad
- Cantidad en unidad del componente

### StockMovement

- Producto simple afectado
- Cantidad (+ entrada / − salida)
- Tipo: purchase, sale, sale_cancel, adjustment, ...
- Referencia a operación origen
- Usuario, timestamp, nota opcional

### Compra

- Fecha, proveedor (texto), total
- Ítems: producto, cantidad, costo unitario
- Pagos múltiples
- Genera entradas de stock

### Venta

- Fecha, total, descuento opcional
- Ítems: producto, cantidad, precio aplicado
- Pagos múltiples
- Estado: activa | anulada
- Genera salidas de stock (directas o vía combo)

### Pago (compra/venta)

- Método: cash, transfer, card, ...
- Monto
- Pertenece a una compra o venta

### Sesión de caja

- Apertura: fecha/hora, monto inicial, usuario
- Cierre: fecha/hora, contado, esperado, diferencia
- Estado: open | closed

### Movimiento de caja

- Sesión
- Tipo: opening, sale_cash, purchase_cash, expense_cash, manual_in, manual_out, ...
- Monto (+ / −)
- Referencia opcional

### Gasto

- Fecha, monto, categoría, descripción
- Método de pago
- Impacto caja si efectivo

### Categoría de gasto

- Nombre (ej. Servicios, Limpieza, Otros)

## Relaciones conceptuales

```
Producto (combo) ──< Receta >── Producto (simple)
Producto (simple) ──< StockMovement
Compra ──< ÍtemCompra
Compra ──< PagoCompra
Venta ──< ÍtemVenta
Venta ──< PagoVenta
SesiónCaja ──< MovimientoCaja
Gasto ── optional → MovimientoCaja
```

## Reglas

- Combo no tiene entidad Stock propia
- Anulación es evento sobre Venta, no delete
- Pagos siempre ligados a una operación padre

## Checklist

- [ ] ¿La entidad nueva es necesaria o extiende una existente?

## Notas

- Nombres físicos de tablas se deciden en migraciones; conceptos permanecen aquí.
