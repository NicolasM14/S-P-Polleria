# 06 — Seguridad

## Objetivo

Proteger datos del negocio, sesiones y operaciones financieras contra accesos indebidos y errores comunes.

## Responsabilidades

Cubre autenticación, autorización, validación de input, secretos y amenazas OWASP aplicables a una app interna.

## Capas de defensa

```
Usuario → Middleware (sesión) → RLS (PostgreSQL) → Validación Zod → RPC atómica
```

## RLS

- Primera línea en base de datos; no confiar solo en UI.
- Usuario solo ve/modifica lo que su rol permite.
- Dueños (`owner`): acceso completo actual.
- Empleados (`employee`): permisos granulares (futuro; ADR cuando se implemente).

## Middleware

- Verificar sesión válida en rutas `(dashboard)`.
- Redirect a login si no autenticado.
- No exponer rutas admin ocultas sin check server-side.

## Sesiones

- Cookies gestionadas por Supabase SSR helpers.
- No guardar tokens en `localStorage` manualmente.
- Logout invalida sesión client + redirect.

## Variables privadas

| Secret | Dónde |
|--------|-------|
| Service role | Solo CI/scripts locales, `.env.local` |
| Anon key | Público pero con RLS estricto |
| DB password | Nunca en repo |

`.env.local` en `.gitignore`. `.env.example` sin valores reales.

## Validación y sanitización

- **Todo input externo** pasa por Zod (forms, Server Actions, query params).
- Escapar output en UI (React lo hace por default; cuidado con `dangerouslySetInnerHTML`).
- IDs: validar UUID/formato antes de queries.

## Permisos (futuro empleados)

| Acción | owner | employee (planificado) |
|--------|-------|------------------------|
| Ver reportes | ✅ | configurable |
| Anular venta | ✅ | restringido |
| Cierre caja | ✅ | configurable |
| ABM productos | ✅ | restringido |

Documentar cambios en ADR-005 cuando se implemente.

## Amenazas comunes

| Amenaza | Mitigación |
|---------|------------|
| IDOR | RLS + validar ownership en RPC |
| SQL injection | Supabase client parametrizado; SQL solo en migraciones |
| XSS | React + no innerHTML |
| Exposición service_role | Solo server, nunca bundle cliente |
| Race en stock/caja | Funciones SQL transaccionales |
| CSRF | Server Actions + cookies SameSite |

## Reglas

1. Defensa en profundidad: UI + server + RLS.
2. Principio de mínimo privilegio en roles.
3. Auditar operaciones sensibles (anulaciones, ajustes) vía historial.
4. No loguear passwords, tokens ni PII en consola.
5. Rotar keys si hubo exposición (ej. export de chat con credenciales).

## Checklist

- [ ] ¿RLS cubre el caso de acceso cruzado?
- [ ] ¿Input validado en el borde?
- [ ] ¿Operación financiera es atómica?
- [ ] ¿Sin secretos en código o commits?

## Ejemplos

### Correcto

```typescript
'use server';
export async function cancelSale(saleId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: 'UNAUTHORIZED' };
  const parsed = cancelSaleSchema.safeParse({ saleId });
  if (!parsed.success) return { success: false, error: 'INVALID_INPUT' };
  return cancelSaleUseCase(parsed.data);
}
```

## Notas

- App de uso interno en local/red confiable; aun así aplicar RLS estricto.
- HTTPS en producción obligatorio.
