# Slopax-Style SaaS Platform

Kompletny szkielet aplikacji SaaS do zarządzania procesami, zadaniami i automatyzacją.

## Stack
- Frontend: Next.js 15 + React 19
- Backend: Node.js + Express + TypeScript
- DB: PostgreSQL
- Auth: JWT + OAuth Google
- Payments: Stripe (checkout + webhook + trial)
- Infra: Vercel (frontend), Railway/AWS (backend + Postgres)

## Monorepo
- `web/` - panel user/admin, dashboard, motywy, UX SaaS
- `server/` - API, autoryzacja, procesy, workflow, webhooki, raporty, billing

## Quick Start
1. Skonfiguruj `server/.env` na bazie `server/.env.example`
2. Skonfiguruj `web/.env.local` na bazie `web/.env.example`
3. Uruchom Postgres (lokalnie przez Docker):
   ```bash
   docker compose up -d db
   ```
4. Backend:
   ```bash
   cd server
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```
5. Frontend:
   ```bash
   cd web
   npm install
   npm run dev
   ```

## Model biznesowy
- Free: limity operacji i integracji
- Pro: wyższe limity + scheduler + webhooki
- Enterprise: multi-workspace, AI assistant, zaawansowane raporty
- 7-dniowy trial przez Stripe

## Dokumentacja
- API: `server/docs/openapi.yaml`
- Schemat DB: `server/sql/schema.sql`
- Seed: `server/sql/seed.sql`
- Deployment: `server/DEPLOYMENT.md`
