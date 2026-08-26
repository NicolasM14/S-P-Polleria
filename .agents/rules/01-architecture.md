# 01 — Arquitectura

## Objetivo

Definir la **Clean Architecture pragmática** del proyecto: capas, dependencias permitidas y responsabilidades. Toda implementación debe respetar estos límites.

## Responsabilidades

| Capa | Qué define |
|------|------------|
| Este documento | Reglas estructurales globales |
| `02-project-structure.md` | Ubicación física de archivos |
| `decisions/ADR-001-architecture.md` | Contexto de la decisión |

## Capas del sistema

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  UI, páginas, formularios, hooks de vista               │
└───────────────────────────┬─────────────────────────────┘
                            │ usa
┌───────────────────────────▼─────────────────────────────┐
│                    APPLICATION                           │
│  Casos de uso, orquestación, DTOs de entrada/salida     │
└───────────────────────────┬─────────────────────────────┘
                            │ usa
┌───────────────────────────▼─────────────────────────────┐
│                      DOMAIN                              │
│  Entidades, reglas de negocio puras, interfaces (ports) │
└───────────────────────────▲─────────────────────────────┘
                            │ implementa
┌───────────────────────────┴─────────────────────────────┐
│                   INFRASTRUCTURE                         │
│  Supabase, repositorios, mappers, adapters externos     │
└─────────────────────────────────────────────────────────┘

        SHARED ── utilidades transversales (sin lógica de negocio)
        CONFIG ── configuración de app y entorno
```

## Organización por módulos de dominio

Cada módulo en `src/modules/{nombre}/` contiene **exactamente** cuatro subcapas:

```
modules/{modulo}/
├── domain/           # Entidades, value objects, reglas puras, ports
├── application/      # Use cases, servicios de aplicación
├── infrastructure/   # Repositorios Supabase, implementación de ports
└── presentation/     # Componentes, hooks y acciones del módulo
```

Módulos actuales: `auth`, `products`, `stock`, `purchases`, `sales`, `cash`, `expenses`, `reports`.

## Dependencias permitidas

| Desde → Hacia | domain | application | infrastructure | presentation | shared |
|---------------|--------|-------------|----------------|--------------|--------|
| **domain** | ✅ | ❌ | ❌ | ❌ | ❌* |
| **application** | ✅ | ✅ | ❌ | ❌ | ✅ utilidades puras |
| **infrastructure** | ✅ (ports) | ❌ | ✅ | ❌ | ✅ |
| **presentation** | ❌** | ✅ | ❌ | ✅ | ✅ |
| **app/** (Next.js) | ❌ | ✅ | ❌ | ✅ | ✅ |

\* Domain no importa shared; la lógica de dominio es autónoma.

\*\* Presentation no importa domain directamente; pasa por application.

## Dependencias prohibidas

| Prohibición | Motivo |
|-------------|--------|
| domain → infrastructure | Acopla negocio a Supabase |
| domain → presentation | Acopla negocio a UI |
| application → infrastructure | Usar inversión de dependencias (ports) |
| presentation → infrastructure | UI no accede a DB directamente |
| infrastructure → presentation | Inversión de capas |
| Cualquier capa → `app/` interno de otro módulo | Acoplamiento entre módulos |

**Comunicación entre módulos:** vía interfaces públicas en `application/` o eventos documentados; nunca importar `infrastructure/` de otro módulo.

## Reglas

1. La lógica de negocio **vive en domain**; no en componentes React ni en repositorios.
2. Los casos de uso **orquestan** en application; no contienen SQL ni JSX.
3. Infrastructure **implementa ports** definidos en domain/application.
4. Presentation **solo renderiza y captura input**; delega a application.
5. `shared/` contiene código **sin reglas de negocio** (UI genérica, utils, validaciones Zod reutilizables).
6. Modificar esta estructura de capas requiere **ADR + aprobación**.

## Checklist

- [ ] ¿Sé en qué capa va el código nuevo?
- [ ] ¿Las importaciones respetan la tabla de dependencias?
- [ ] ¿El módulo correcto es el documentado?
- [ ] ¿Evité lógica de negocio en infrastructure o presentation?

## Ejemplos

### Port + implementación

```typescript
// modules/sales/domain/ports/sale-repository.port.ts
export interface SaleRepository {
  create(input: CreateSaleInput): Promise<SaleId>;
}

// modules/sales/infrastructure/supabase-sale.repository.ts
export class SupabaseSaleRepository implements SaleRepository { ... }
```

### Incorrecto

```typescript
// ❌ Lógica de descuento de stock en un Server Component
export default async function SalePage() {
  await supabase.from('products').update({ stock: ... });
}
```

## Notas

- Pragmatismo: no crear abstracciones hasta que haya una segunda implementación real o un requisito claro.
- Next.js `app/` es el **composition root** de rutas; la lógica sigue en `modules/`.
- Ver ADR-001 para el contexto histórico de esta decisión.
