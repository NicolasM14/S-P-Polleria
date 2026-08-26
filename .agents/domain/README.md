# Dominio — Negocio S&F Pollería

## Objetivo

Documentar el **modelo de negocio** sin detalle técnico. Es la referencia funcional para producto, reglas y validaciones.

## Responsabilidades

| Archivo | Contenido |
|---------|-----------|
| [glossary.md](glossary.md) | Términos |
| [business-model.md](business-model.md) | Alcance del sistema |
| [entities.md](entities.md) | Entidades y responsabilidades |
| [business-flows.md](business-flows.md) | Flujos ASCII |
| [stock-rules.md](stock-rules.md) | Stock |
| [sales-rules.md](sales-rules.md) | Ventas |
| [cash-rules.md](cash-rules.md) | Caja |
| [purchase-rules.md](purchase-rules.md) | Compras |
| [expense-rules.md](expense-rules.md) | Gastos |

## Reglas

1. El dominio **no menciona** React, Supabase ni nombres de tablas salvo glosario técnico mínimo.
2. Cambios de negocio se reflejan aquí **antes** o **junto** al código.
3. La IA consulta dominio ante cualquier duda funcional.

## Checklist

- [ ] ¿La feature está en alcance de `business-model.md`?
- [ ] ¿Las reglas específicas están en el archivo del subdominio?

## Notas

- S&F Pollería: pollería de barrio; gestión interna para dueños.
