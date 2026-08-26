# Skill — Auth

## Objetivo

**Autenticación y perfiles** de usuarios internos.

## Responsabilidad del módulo

- Login / logout
- Perfil (`profiles`: nombre, role)
- Protección rutas
- Preparación roles futuros (`owner`, `employee`)

## Flujo

```
Sign in → Supabase Auth → profile cargado → middleware valida sesión
Sign out → limpiar sesión → redirect login
```

## Checklist

- [ ] Login email/password
- [ ] Perfil creado al registrar (trigger o signup hook)
- [ ] Roles: `owner` para dueños actuales
- [ ] Middleware en `(dashboard)`
- [ ] Server Actions verifican sesión
- [ ] No exponer admin API sin check role

## Archivos permitidos

`modules/auth/**`, `src/app/(auth)/`, `middleware.ts`, `profiles` migración.

## Archivos prohibidos

- Password en tabla profiles
- Auth logic duplicada fuera de auth/middleware
- Registro público abierto (solo invitación/admin v1)

## Errores comunes

| Error | Correcto |
|-------|----------|
| Confiar solo en UI para hide buttons | RLS + server check |
| service_role en login | Anon + RLS |
| Dos fuentes de verdad del rol | Solo profiles.role |

## Ejemplos

Dueños: `dueno1@...`, `dueno2@...`, role `owner`, acceso total.

## Notas

- ADR-005, `domain/business-model.md`, `06-security.md`.
