# ADR-004 — Caja solo efectivo físico

## Estado

Aceptado

## Contexto

En el local coexisten pagos en efectivo, transferencia y tarjeta. El arqueo diario es **solo del dinero en caja física**. Mezclar transferencias distorsiona el conteo.

## Decisión

1. **Sesiones de caja** con apertura y cierre.
2. **Movimientos de caja** registran solo impacto de pagos **cash**.
3. Ventas/compras/gastos con pagos múltiples: **solo la porción cash** genera movimiento de caja.
4. Cierre calcula **efectivo esperado** vs **contado** y guarda **diferencia**.
5. Cierre vía **RPC atómica**.

## Motivo

- Refleja operación real del negocio.
- Dueños arquean billetes, no transferencias del banco.

## Consecuencias

### Positivas

- Arqueo confiable.
- Pagos mixtos soportados sin confusión.

### Negativas

- Reporte "total vendido" ≠ "caja" (documentar en UI).

## Checklist

- [ ] Transferencia no mueve caja
- [ ] Pagos múltiples prorrateados correctamente en parte cash

## Ejemplos

Venta $100: $40 cash → caja +$40. Resto transferencia → sin movimiento caja.

## Notas

- Ver `domain/cash-rules.md`.
