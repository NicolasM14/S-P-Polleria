# 03 — Estándares de código

## Objetivo

Definir convenciones **consistentes** de TypeScript, naming e imports para que todo el código se lea como escrito por un solo equipo.

## Responsabilidades

Aplica a todo archivo en `src/`, `tests/` y scripts de build. No aplica a `.agents/` (Markdown).

## TypeScript

| Regla | Detalle |
|-------|---------|
| Modo estricto | `strict: true` en tsconfig |
| Evitar `any` | Usar `unknown` + narrowing o tipos explícitos |
| Preferir `interface` | Para objetos extensibles; `type` para unions e intersecciones |
| Enums | Preferir union types + `as const` sobre `enum` de TS |
| Nullability | Explicitar `| null` / optional `?`; no asumir valores |

## Naming

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Carpetas | kebab-case | `stock-movements/` |
| Archivos componentes | kebab-case | `sale-form.tsx` |
| Archivos use case | kebab-case + sufijo | `create-sale.use-case.ts` |
| Archivos repositorio | kebab-case + sufijo | `supabase-sale.repository.ts` |
| Componentes React | PascalCase | `SaleForm` |
| Funciones / hooks | camelCase | `useSaleForm`, `formatCurrency` |
| Constantes | SCREAMING_SNAKE | `MAX_DECIMALS_KG` |
| Types / Interfaces | PascalCase | `CreateSaleInput`, `Product` |
| Ports | PascalCase + `Port` o sufijo descriptivo | `SaleRepository` |
| Variables booleanas | prefijo `is/has/can` | `isActive`, `hasStock` |

## Imports

```typescript
// Orden: externo → alias @/ → relativo
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import { CreateSaleUseCase } from '../application/create-sale.use-case';
```

| Regla | Detalle |
|-------|---------|
| Alias `@/` | Apunta a `src/` |
| Sin imports circulares | Extraer a `shared/` si hay ciclo |
| Imports de capa | Respetar `01-architecture.md` |
| No default export en domain/application | Preferir named exports |

## Barrel files (`index.ts`)

- Permitidos en `shared/components/ui/` y límites de módulo.
- **Prohibidos** para ocultar imports entre capas incorrectas.
- Máximo un nivel de re-export por carpeta.

## DTOs y validaciones

| Capa | Formato |
|------|---------|
| Input UI | Schema Zod en `shared/validations/` o módulo |
| Application | Types derivados: `z.infer<typeof Schema>` |
| Domain | Objetos/entities sin dependencia de Zod |

```typescript
// shared/validations/sale.schema.ts
export const createSaleSchema = z.object({ ... });
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
```

## Server Actions

- Archivo: `{accion}.action.ts` en `presentation/` o junto al componente.
- Prefijo `'use server'` al inicio del archivo.
- Validar input con Zod al entrar.
- Delegar a use case; no SQL inline.

## Componentes

| Tipo | Ubicación | Directiva |
|------|-----------|-----------|
| Server Component | default en `app/` y presentation | sin `'use client'` |
| Client Component | presentation | `'use client'` solo si hay estado/eventos |
| UI genérica | `shared/components/` | según necesidad |

## Reglas

1. Un archivo = una responsabilidad principal (un use case, un componente, un schema).
2. Funciones puras de dominio **sin efectos secundarios**.
3. Formateo: Prettier del proyecto; no debatir estilo en PRs.
4. Comentarios solo para **por qué**, no para **qué** (el código debe ser claro).
5. Magic numbers → constantes en `shared/constants/` o módulo.

## Checklist

- [ ] ¿Naming sigue la tabla?
- [ ] ¿Imports respetan orden y capas?
- [ ] ¿Input validado con Zod en el borde?
- [ ] ¿Sin `any` ni `@ts-ignore` sin justificación?

## Ejemplos

### Use case

```typescript
// modules/sales/application/create-sale.use-case.ts
export async function createSale(
  input: CreateSaleInput,
  deps: { saleRepo: SaleRepository; stockService: StockService }
): Promise<SaleId> {
  // orquestación, sin JSX ni supabase.from()
}
```

## Notas

- ESLint + TypeScript ESLint alineados con estas reglas cuando se configure el proyecto.
- Ver `04-nextjs.md` para reglas específicas de React/Next.
