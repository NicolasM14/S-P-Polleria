# Skill — Productos

## Objetivo

Implementar ABM de **productos simples y combos** con recetas.

## Responsabilidad del módulo

- Catálogo de productos activos/inactivos
- Unidad de medida: kg o unidad
- Combos: receta de componentes (otros productos)
- Precios de venta (referencia; venta puede tener ajustes según reglas)

## Flujo

```
Alta producto simple → kind=simple, unit=kg|unit
Alta combo → kind=combo + combo_items (componente, cantidad)
Editar → no romper historial; preferir desactivar
Listar → filtros activo, tipo, búsqueda nombre
```

## Checklist

- [ ] Validar unit (`kg` | `unit`)
- [ ] Combo: al menos un componente; cantidades con 3 dec. si kg
- [ ] Combo **no tiene stock propio**
- [ ] Precio >= 0
- [ ] Soft delete / `is_active` vs hard delete

## Archivos permitidos

`modules/products/**`, rutas `/productos`, migraciones `products`, `combo_items`.

## Archivos prohibidos

- Lógica de descuento stock aquí (es en ventas)
- Módulo separado `combos/`

## Errores comunes

| Error | Correcto |
|-------|----------|
| Stock en tabla productos para combos | Solo simples tienen saldo |
| Componente combo es otro combo anidado profundo | Validar profundidad 1 en v1 |
| Editar unidad con movimientos históricos | Bloquear o migración explícita |

## Ejemplos

- "Pollo kg" → simple, unit kg, stock vía movimientos
- "Promo familia" → combo: 1kg pollo + 2 unidades gaseosa

## Notas

- Ver `domain/entities.md`, `domain/stock-rules.md`.
