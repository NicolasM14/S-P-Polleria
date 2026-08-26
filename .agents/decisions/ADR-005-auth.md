# ADR-005 — Autenticación y roles

## Estado

Aceptado

## Contexto

Actualmente operan **dos dueños** con acceso total. Se prevé contratar empleados con permisos reducidos. El sistema es interno, sin registro público.

## Decisión

1. **Supabase Auth** email/password.
2. Perfil en tabla `profiles` ligada a `auth.users`.
3. Roles enum: `owner` | `employee`.
4. v1: ambos dueños son `owner`; acceso completo.
5. **RLS** y checks server-side según rol.
6. Registro público **deshabilitado**; altas por admin/seed.
7. Permisos granulares de `employee` se definirán en ADR futuro cuando se implementen.

## Motivo

- Simplicidad inicial para dueños.
- Base para restricciones futuras sin rehacer auth.

## Consecuencias

### Positivas

- Login estándar.
- Rol en un solo campo.

### Negativas

- employee sin granularidad hasta fase 2.

## Checklist

- [ ] Middleware protege dashboard
- [ ] RLS usa rol
- [ ] No passwords en profiles

## Notas

- Ver skill `auth.md`, `06-security.md`.
