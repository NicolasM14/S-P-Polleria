# 08 — UI / UX

## Objetivo

Guía visual para una interfaz **consistente**, usable en mostrador y oficina, alineada con la marca S&F Pollería.

## Responsabilidades

Colores, tipografía, componentes y patrones de interacción. Implementación con Tailwind + shadcn/ui.

## Identidad visual

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | Navy `#002855` | Nav, headers, acciones primarias |
| Accent | Rojo `#E31B23` | CTAs, ítem activo en nav, acentos del logo |
| Background | Blanco `#ffffff` / gris claro `#f8fafc` | Fondos |
| Text | Navy oscuro `#111827` | Cuerpo |
| Muted | `#64748b` | Labels secundarios |
| Success | `#16a34a` | Confirmaciones |
| Warning | `#ca8a04` | Advertencias stock bajo |
| Destructive | `#dc2626` | Anular, eliminar |

Logo oficial: `public/brand/logo-sf-polleria.jpg`. Componente: `BrandLogo`.

Configurar en `tailwind.config.ts` y variables CSS en `globals.css`.

## Tipografía

- Sans (UI): Geist (via `next/font`).
- Serif (marca): Source Serif 4 — títulos de marca `S&F`, wordmark.
- Tamaños: escala Tailwind default; títulos `text-2xl`/`text-xl`, cuerpo `text-sm`/`text-base`.
- Números monetarios: tabular nums (`font-variant-numeric: tabular-nums`).

## Espaciado

- Grid base: 4px (Tailwind).
- Padding cards: `p-4` / `p-6`.
- Gap formularios: `gap-4`.
- Márgenes secciones dashboard: `space-y-6`.

## Componentes

| Elemento | Patrón |
|----------|--------|
| Botones | shadcn `Button`; primary azul, destructive rojo |
| Formularios | shadcn `Form` + Zod; labels arriba |
| Tablas | shadcn `Table`; sticky header en listados largos |
| Modales | shadcn `Dialog`; confirmación para anulaciones |
| Toasts | shadcn `Sonner`; éxito/error |
| Inputs numéricos | Separador decimal según locale AR; kg con 3 decimales |
| Selects | Productos, métodos de pago, categorías |

## Estados

| Estado | Tratamiento |
|--------|-------------|
| Loading | Skeleton o spinner en botón; `loading.tsx` en rutas |
| Vacío | Ilustración + texto + CTA ("Registrar primera venta") |
| Error | Mensaje claro + acción retry; no stack traces al usuario |
| Disabled | Opacidad + cursor; explicar por qué si no es obvio |

## Responsive

- **Desktop first** (uso principal en PC del local).
- Tablet: nav colapsable.
- Mobile: usable pero no prioritario en v1.

## Reglas

1. Reutilizar `shared/components/` antes de crear UI nueva.
2. No introducir otra librería de componentes sin ADR.
3. Formularios de dinero siempre muestran formato `$` ARS.
4. Acciones destructivas requieren modal de confirmación.
5. Accesibilidad básica: labels, focus visible, contraste WCAG AA donde sea posible.

## Checklist

- [ ] ¿Colores de la paleta oficial?
- [ ] ¿Componente shadcn reutilizado?
- [ ] ¿Estados loading/vacío/error cubiertos?
- [ ] ¿Confirmación en acciones irreversibles?

## Ejemplos

### Botón primario

```tsx
<Button className="bg-primary hover:bg-primary/90">Registrar venta</Button>
```

### Input kg

```tsx
<Input type="number" step="0.001" min="0" placeholder="0,000" />
```

## Notas

- Logo S&F en `public/`; favicon coherente.
- Dark mode: no prioritario en v1; preparar tokens si se agrega después.
