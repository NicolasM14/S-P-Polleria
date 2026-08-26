# 02 — Estructura del proyecto

## Objetivo

Definir el **árbol de carpetas autorizado**. La IA no puede crear carpetas fuera de este documento sin ADR y aprobación.

## Responsabilidades

Este documento es el mapa físico del repositorio. Cada carpeta tiene un propósito único.

## Árbol completo

```text
/
├── .agents/                    # Contrato de desarrollo (este directorio)
├── .cursor/                    # Reglas Cursor (symlinks o refs a .agents si aplica)
├── public/                     # Assets estáticos (logo, favicon)
├── supabase/
│   ├── migrations/             # Migraciones SQL versionadas
│   ├── seed.sql                # Datos iniciales (dev)
│   └── functions/              # Edge functions (solo si se necesitan)
├── src/
│   ├── app/                    # Next.js App Router (rutas, layouts, loading, error)
│   │   ├── (auth)/             # Route group: login
│   │   ├── (dashboard)/        # Route group: app autenticada
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── stock/
│   │   ├── purchases/
│   │   ├── sales/
│   │   ├── cash/
│   │   ├── expenses/
│   │   └── reports/
│   │       └── {cada módulo}/
│   │           ├── domain/
│   │           ├── application/
│   │           ├── infrastructure/
│   │           └── presentation/
│   ├── shared/
│   │   ├── components/         # UI reutilizable (shadcn extendido)
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── validations/        # Schemas Zod compartidos
│   │   ├── utils/
│   │   ├── constants/
│   │   └── lib/                # Helpers (cn, formatters, etc.)
│   ├── config/
│   │   ├── env.ts              # Validación de env vars
│   │   └── site.ts             # Metadata del sitio
│   └── middleware.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                    # Solo si se adopta Playwright
├── .env.local                  # No commitear
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Responsabilidad por carpeta

| Carpeta | Contiene | No contiene |
|---------|----------|-------------|
| `src/app/` | Rutas, layouts, metadata, re-exports de páginas | Lógica de negocio, queries SQL |
| `src/modules/*/` | Todo lo de un dominio funcional | Código de otro dominio |
| `src/modules/*/domain/` | Entidades, reglas puras, ports | React, Supabase client |
| `src/modules/*/application/` | Use cases, DTOs | JSX, SQL directo |
| `src/modules/*/infrastructure/` | Repositorios, mappers Supabase | Componentes UI |
| `src/modules/*/presentation/` | Componentes del módulo, hooks de vista | Acceso directo a DB |
| `src/shared/` | Código transversal sin reglas de negocio | Lógica específica de un módulo |
| `src/config/` | Configuración tipada | Lógica de aplicación |
| `supabase/migrations/` | DDL, RLS, funciones RPC | Código TypeScript |
| `tests/` | Pruebas | Código de producción |
| `.agents/` | Documentación del contrato | Código ejecutable |

## Reglas

1. **Un módulo = un dominio de negocio** listado arriba; no crear `inventory/`, `orders/`, `customers/`, etc.
2. Dentro de cada módulo, **solo** las cuatro subcarpetas: `domain`, `application`, `infrastructure`, `presentation`.
3. No crear `src/services/`, `src/helpers/`, `src/api/` globales; usar `shared/` o el módulo correspondiente.
4. Las rutas en `app/` son **delgadas**: importan desde `modules/*/presentation/`.
5. Migraciones SQL **solo** en `supabase/migrations/` con timestamp.
6. Archivos barrel (`index.ts`) permitidos con moderación; no ocultar dependencias circulares.

## Checklist

- [ ] ¿La carpeta que voy a crear está en este árbol?
- [ ] ¿El archivo va en la capa correcta del módulo?
- [ ] ¿Evité carpetas genéricas tipo `utils/` fuera de `shared/`?
- [ ] ¿La ruta Next.js solo compone, no implementa?

## Ejemplos

### Correcto

```
src/modules/sales/presentation/sale-form.tsx
src/modules/sales/application/create-sale.use-case.ts
src/app/(dashboard)/ventas/nueva/page.tsx  → importa SaleForm
```

### Incorrecto

```
src/services/sales.ts                        # ❌ carpeta no autorizada
src/modules/sales/services/create-sale.ts    # ❌ subcarpeta no autorizada
src/modules/sales/domain/sale-form.tsx       # ❌ UI en domain
```

## Notas

- Si el proyecto crece, **extender un módulo existente** antes de crear uno nuevo.
- Cambios a este árbol requieren ADR-001 actualizado o nuevo ADR.
