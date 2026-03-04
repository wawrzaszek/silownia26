# Deployment

## Frontend (Vercel)
1. Importuj `web/` jako nowy projekt.
2. Ustaw env:
   - `NEXT_PUBLIC_API_URL=https://api.twojadomena.com/api/v1`
3. Build command: `npm run build`
4. Output: `.next`

## Backend (Railway/AWS)
1. Utwórz usługę Node dla katalogu `server/`.
2. Ustaw env z `server/.env.example`.
3. Uruchom migrację DB:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Start command: `npm run start`

## PostgreSQL
- Railway Postgres albo AWS RDS.
- Podłącz przez `DATABASE_URL`.

## Stripe
1. Ustaw price IDs (`STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`).
2. Dodaj webhook endpoint: `https://api.twojadomena.com/api/v1/billing/webhook`.
3. Skopiuj secret do `STRIPE_WEBHOOK_SECRET`.

## Google OAuth
1. W Google Cloud Console dodaj `authorized redirect URI`:
   - `https://api.twojadomena.com/api/v1/auth/google/callback`
2. Uzupełnij `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
