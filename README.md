# S&F Pollería

Gestión interna de stock, ventas, caja, compras y gastos.

## Requisitos

- Node.js 20+
- Cuenta Supabase (mismo proyecto en todas las PCs)
- npm

## Setup en otra PC

```bash
git clone https://github.com/NicolasM14/sf-polleria.git
cd sf-polleria
npm install
cp .env.example .env.local
```

Editá `.env.local` con la URL y la anon/publishable key de Supabase (Dashboard → Settings → API).

```bash
npm run dev
```

Abrí http://localhost:3000/login

## Documentación

- Manual de uso: [`MANUAL-DE-USO.md`](./MANUAL-DE-USO.md)
- Contrato de desarrollo: [`.agents/`](./.agents/)
- Migraciones SQL: [`supabase/migrations/`](./supabase/migrations/)

## Importante

- **No** subas `.env.local` (ya está en `.gitignore`).
- La base de datos es la de Supabase en la nube: no hace falta migrar datos entre PCs.
- Usuarios: Authentication en el dashboard de Supabase.
