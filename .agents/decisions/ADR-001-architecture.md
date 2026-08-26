# ADR-001 — Clean Architecture modular

## Estado

Aceptado

## Contexto

S&F Pollería necesita un sistema mantenible durante meses con desarrollo asistido por IA. Sin estructura clara, el código tiende a mezclar UI, SQL y reglas de negocio. El equipo es pequeño pero el dominio (stock, caja, ventas) tiene reglas estrictas.

## Decisión

Adoptar **Clean Architecture pragmática** organizada en:

- Módulos de dominio en `src/modules/{modulo}/` con capas `domain`, `application`, `infrastructure`, `presentation`.
- Código compartido sin negocio en `src/shared/`.
- Rutas Next.js delgadas en `src/app/`.
- Dependencias unidireccionales (ver `rules/01-architecture.md`).

## Motivo

- Separación clara para que la IA sepa dónde escribir cada pieza.
- Testabilidad de reglas de negocio en domain/application.
- Evolución por módulo (ventas, stock) sin acoplamiento.

## Consecuencias

### Positivas

- Onboarding rápido vía `.agents`.
- Refactors localizados por módulo.
- Menor riesgo de SQL en componentes React.

### Negativas

- Más carpetas que un CRUD monolítico.
- Curva inicial para respetar ports/adapters.

### Mitigación

- No sobre-abstraer; ports solo donde hay persistencia real.
- Skills y rules guían a la IA.

## Checklist

- [ ] Nuevo código respeta capas
- [ ] Cambio estructural → nuevo ADR

## Notas

- Supersedido por: ninguno.
