# API Endpoints (skrót)

## Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `GET /api/v1/auth/me`

## User
- `PATCH /api/v1/users/profile`
- `GET /api/v1/users/activity`

## Dashboard
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/dashboard/usage-chart`

## Core app
- `GET/POST/PATCH/DELETE /api/v1/processes`
- `GET/POST /api/v1/workflows`
- `POST /api/v1/workflows/:id/run`
- `GET/POST /api/v1/integrations`
- `GET/POST /api/v1/webhooks`
- `POST /api/v1/webhooks/incoming/:token`

## Reporting
- `GET /api/v1/reports/usage.pdf`
- `GET /api/v1/exports/operations.csv`

## Billing
- `POST /api/v1/billing/checkout`
- `POST /api/v1/billing/webhook`
- `GET /api/v1/billing/invoices`
- `GET /api/v1/subscriptions/current`

## Admin / CMS
- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/block`
- `DELETE /api/v1/admin/users/:id`
- `GET/POST /api/v1/cms/pages`

## Premium
- `POST /api/v1/ai/assistant`
