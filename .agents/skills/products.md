# Skill — Productos

## Objetivo

Implementar ABM de **productos** con stock (principalmente **kg**).

## Responsabilidad del módulo

- Catálogo de productos activos/inactivos
- Unidad de medida: kg (preferido) o unidad
- Precios de venta (referencia)
- **Sin combos** en operación actual (el stock se mide por producto)

## Flujo

```
Alta producto → kind=simple, unit=kg|unit, stock inicial opcional
Editar → no romper historial; preferir desactivar; no editar unidad
Listar → filtros activo, búsqueda nombre
```

## Checklist

- [ ] Validar unit (`kg` | `unit`)
- [ ] Kg: hasta 3 decimales
- [ ] Precio >= 0
- [ ] Soft delete / `is_active`
- [ ] No ofrecer alta de combos

## Archivos permitidos

`modules/products/**`, rutas `/productos`, migraciones `products`.

## Archivos prohibidos

- Lógica de descuento stock aquí (es en ventas)
- Módulo separado `combos/`
- UI de recetas / combo_components en formularios

## Errores comunes

| Error | Correcto |
|-------|----------|
| Editar stock en ficha producto | Usar Compras o ajuste de Stock |
| Editar unidad con movimientos | Bloquear |

## Ejemplos

- "Milanesa" → kg, stock vía compras/ajustes
- "Gaseosa" → unit (si aplica)

## Notas

- Ver `domain/entities.md`, `domain/stock-rules.md`.
- Combos fuera del alcance operativo actual.
