# Struktura projektu

## Monorepo
- `web/` - Next.js app (panel user/admin)
- `server/` - Express API
- `server/sql` - schema + seed PostgreSQL
- `server/docs/openapi.yaml` - spec API
- `docker-compose.yml` - lokalny Postgres

## Frontend
- `src/app/page.tsx` - landing
- `src/app/login` / `register` / `auth/callback` - auth UX
- `src/app/dashboard` - dashboard użytkownika, KPI, wykres, historia, AI assistant
- `src/app/dashboard/workflows` - drag & drop editor
- `src/app/admin` - panel admin (user management + global stats)
- `src/app/billing` - plany + Stripe checkout
- `src/app/settings` - profil, eksporty CSV/PDF

## Backend
- `src/modules/auth` - JWT + OAuth Google + reset hasła
- `src/modules/processes` - CRUD procesów
- `src/modules/workflows` - workflow + uruchamianie
- `src/modules/scheduler` - cron scheduler
- `src/modules/webhooks` - webhooki przychodzące
- `src/modules/integrations` - integracje (Sheets, Zapier, API)
- `src/modules/billing` - Stripe checkout/webhook/faktury
- `src/modules/reports` - PDF reports
- `src/modules/exports` - CSV export
- `src/modules/admin` - admin stats + user management
- `src/modules/cms` - CMS pages
- `src/modules/ai` - AI assistant (premium)

## Role i plany
- Role: `user`, `admin`
- Plany: `free`, `pro`, `enterprise`
- Trial: 7 dni (Stripe subscription)
