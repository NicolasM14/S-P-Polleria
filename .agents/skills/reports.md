# Skill — Reportes

## Objetivo

Consultas **agregadas y exportables** sin mutar estado del sistema.

## Responsabilidad del módulo

- Ventas por período
- Compras por período
- Stock valorizado / bajo mínimo (si se define mínimo)
- Resumen caja
- Gastos por categoría

## Flujo

```
Filtros (fecha, producto, etc.) → query read-only → tabla/gráfico
Export CSV opcional (fase 2)
```

## Checklist

- [ ] Solo lectura (SELECT / vistas)
- [ ] RLS aplicado
- [ ] Paginación en listados grandes
- [ ] Performance: índices en fechas
- [ ] No recalcular stock desde reporte; leer saldos/movimientos

## Archivos permitidos

`modules/reports/**`, vistas SQL en migraciones, páginas `/reportes/*`.

## Archivos prohibidos

- INSERT/UPDATE desde reportes
- Lógica de negocio duplicada (usar mismas fuentes que operaciones)

## Errores comunes

| Error | Correcto |
|-------|----------|
| Reporte ventas incluye anuladas sin filtrar | Flag `cancelled_at` |
| Agregar chart library sin ADR | Tablas primero |
| Full scan sin límite | Paginar |

## Ejemplos

"Ventas del mes" → sum total, count, por día; excluye anuladas.

## Notas

- Gráficos son opcionales v1; tablas exportables prioritarias.
