# 07 — Reglas de negocio (resumen)

## Objetivo

Punto de entrada a las **reglas funcionales** del sistema. No duplica detalle; enlaza a `domain/`.

## Responsabilidades

Resumir por área y dirigir a la documentación de dominio correspondiente.

## Resumen por área

| Área | Documento detallado | Regla clave |
|------|---------------------|-------------|
| **Productos** | `domain/entities.md`, skill `products.md` | Simples (kg/unidad) y combos con receta |
| **Stock** | `domain/stock-rules.md` | Movimientos obligatorios; nunca editar saldo directo |
| **Compras** | `domain/purchase-rules.md` | Pagos múltiples; impacto stock + caja (efectivo) |
| **Ventas** | `domain/sales-rules.md` | Kg (3 dec.), unidad, combos, pagos múltiples, anulación |
| **Caja** | `domain/cash-rules.md` | Solo efectivo mueve caja física; apertura/cierre |
| **Gastos** | `domain/expense-rules.md` | Categorías; egreso de caja si es efectivo |
| **Usuarios** | `domain/business-model.md`, ADR-005 | Dos dueños owner; empleados futuros |
| **Reportes** | skill `reports.md` | Lectura agregada; no muta estado |

## Flujo principal del negocio

```
Compra → Stock ↑ → Venta → Stock ↓ + Caja (efectivo)
                ↓
              Gasto → Caja ↓ (si efectivo)
                ↓
         Cierre de caja (arqueo)
```

Ver diagramas completos en `domain/business-flows.md`.

## Reglas transversales

1. **Pagos múltiples:** compras y ventas pueden dividirse en varios métodos; la suma debe igualar el total.
2. **Efectivo y caja:** solo pagos en efectivo afectan el saldo de caja física.
3. **Historial:** movimientos de stock y operaciones de caja quedan registrados; anulaciones revierten sin borrar.
4. **Combos:** no tienen stock propio; al vender se descuentan componentes según receta.
5. **Precisión kg:** hasta 3 decimales en cantidades por kilogramo.

## Fuera de alcance

No implementar sin autorización explícita:

- Pedidos WhatsApp, clientes, reparto, mapas
- Facturación electrónica ARCA/AFIP
- Multi-sucursal
- Inventario en tiempo real multi-dispositivo (fase inicial)

Ver `domain/business-model.md`.

## Checklist

- [ ] ¿Consulté el documento de dominio del módulo?
- [ ] ¿La feature respeta pagos múltiples y regla de efectivo?
- [ ] ¿Stock pasa por movimientos?
- [ ] ¿Estoy inventando algo fuera de alcance?

## Ejemplos

| Escenario | Dónde leer |
|-----------|------------|
| Anular venta pagada mixto | `domain/sales-rules.md` + `domain/cash-rules.md` |
| Compra 60% efectivo 40% transferencia | `domain/purchase-rules.md` |
| Combo "Pollo entero + papas" | `domain/entities.md` + skill `products.md` |

## Notas

- Ante conflicto entre código y `domain/`, **gana domain** hasta que el usuario cambie la regla.
- Cambios de reglas de negocio requieren actualizar `domain/` y posiblemente un ADR.
