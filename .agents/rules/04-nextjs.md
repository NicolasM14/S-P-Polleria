# 04 — Next.js

## Objetivo

Reglas específicas de **Next.js App Router** para mantener rendimiento, claridad y separación con Clean Architecture.

## Responsabilidades

Define cómo usar rutas, componentes, acciones y middleware en este proyecto.

## App Router

| Elemento | Uso en S&F Pollería |
|----------|---------------------|
| `app/` | Solo composición de rutas y layouts |
| Route groups | `(auth)` login; `(dashboard)` app principal |
| `layout.tsx` | Shell, nav, providers compartidos |
| `page.tsx` | Punto de entrada; importa de `modules/*/presentation/` |
| `loading.tsx` | Skeletons consistentes con `08-ui-ux.md` |
| `error.tsx` | Error boundaries por segmento |
| `not-found.tsx` | 404 del dashboard |

## Server Components (default)

**Usar cuando:**

- Fetch de datos inicial (vía use case / server helper)
- Render estático o cacheable
- No hay interactividad (clicks, form state local)

**Reglas:**

- No importar hooks de React (`useState`, `useEffect`).
- Pasar datos serializables a Client Components hijos.

## Client Components

**Usar cuando:**

- Formularios con estado local
- Modales, dropdowns, toasts interactivos
- Tablas con sort/filter client-side (si no hay alternativa server)

**Reglas:**

- Marcar `'use client'` en la **primera línea**.
- Mantener el componente lo más pequeño posible ("leaf client").
- No llamar Supabase directamente; usar Server Actions o API interna vía actions.

## Server Actions

| Regla | Detalle |
|-------|---------|
| Ubicación | `modules/*/presentation/*.action.ts` |
| Validación | Zod obligatorio en cada action |
| Auth | Verificar sesión al inicio |
| Errores | Retornar `{ success, error?, data? }` tipado |
| Revalidación | `revalidatePath` / `revalidateTag` solo donde corresponda |

## Middleware

- Archivo: `src/middleware.ts`
- Responsabilidades: refresh de sesión Supabase, redirect si no autenticado en `(dashboard)`.
- **No** contener lógica de negocio.

## Data fetching

```
page.tsx (RSC)
  → llama use case o query helper en application/infrastructure
  → pasa props a Client Component si hace falta interactividad
```

Prohibido: `supabase.from()` en `page.tsx` sin pasar por capa de módulo.

## Reglas

1. Rutas delgadas; lógica en `modules/`.
2. Preferir Server Components; Client solo donde sea necesario.
3. Server Actions para mutaciones desde formularios.
4. No usar Pages Router (`pages/`).
5. Metadata en `layout.tsx` o `page.tsx` con `export const metadata`.
6. Imágenes con `next/image`; fuentes con `next/font`.

## Checklist

- [ ] ¿Esta página puede ser Server Component?
- [ ] ¿Client Component es el más pequeño posible?
- [ ] ¿Server Action valida y delega a use case?
- [ ] ¿Middleware solo hace auth/routing?

## Ejemplos

### Página delgada

```tsx
// src/app/(dashboard)/ventas/page.tsx
import { SalesList } from '@/modules/sales/presentation/sales-list';

export default async function VentasPage() {
  return <SalesList />;
}
```

### Incorrecto

```tsx
// ❌ 400 líneas de lógica + supabase + formulario en page.tsx
'use client';
export default function VentasPage() { ... }
```

## Notas

- Next.js 14+ App Router es el estándar; no mezclar patrones legacy.
- ISR/SSG solo si un ADR lo justifica; dashboard es dinámico por defecto.
