// ============================================================
// GŁÓWNA KONFIGURACJA APLIKACJI (Express App)
// ============================================================
// W tym pliku definiujemy middleware, trasy (routes) oraz globalne
// ustawienia bezpieczeństwa i logowania dla całego backendu.
// ============================================================

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';

// Importy tras modułów (każdy moduł ma własny plik z trasami)
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import subscriptionRoutes from './modules/subscriptions/subscription.routes.js';
import processRoutes from './modules/processes/process.routes.js';
import workflowRoutes from './modules/workflows/workflow.routes.js';
import integrationRoutes from './modules/integrations/integration.routes.js';
import webhookRoutes from './modules/webhooks/webhook.routes.js';
import reportRoutes from './modules/reports/report.routes.js';
import exportRoutes from './modules/exports/export.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import cmsRoutes from './modules/cms/cms.routes.js';
import billingRoutes from './modules/billing/billing.routes.js';
import dashboardRoutes from './modules/admin/dashboard.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

export const app = express();

// --- MIDDLEWARE ---

// Konfiguracja CORS (Cross-Origin Resource Sharing) — pozwala frontowi na komunikację z API
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

// Helmet dodaje nagłówki HTTP zwiększające bezpieczeństwo
app.use(helmet());

// Morgan loguje zapytania HTTP w konsoli (tryb 'dev')
app.use(morgan('dev'));

// Webhooki Stripe/Billing wymagają surowego body (raw), więc definiujemy to przed express.json()
app.post('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));

// Parsowanie body zapytania do formatu JSON
app.use(express.json());

// Inicjalizacja Passport do obsługi autoryzacji
app.use(passport.initialize());

// Endpoint sprawdzający czy serwer żyje (Health Check)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'slopax-saas-backend' });
});

// --- DEFINICJA TRAS (ROUTES) ---
// Każda trasa zaczyna się od prefixu /api/v1/

app.use('/api/v1/auth', authRoutes);           // Logowanie i rejestracja
app.use('/api/v1/users', userRoutes);         // Zarządzanie użytkownikami
app.use('/api/v1/subscriptions', subscriptionRoutes); // Subskrypcje
app.use('/api/v1/processes', processRoutes);   // Procesy biznesowe
app.use('/api/v1/workflows', workflowRoutes);   // Przepływy pracy (Workflows)
app.use('/api/v1/integrations', integrationRoutes); // Integracje zewnętrzne
app.use('/api/v1/webhooks', webhookRoutes);     // Obsługa webhooków
app.use('/api/v1/reports', reportRoutes);       // Generowanie raportów
app.use('/api/v1/exports', exportRoutes);       // Eksport danych
app.use('/api/v1/admin', adminRoutes);         // Panel administracyjny
app.use('/api/v1/cms', cmsRoutes);             // System zarządzania treścią
app.use('/api/v1/billing', billingRoutes);     // Obsługa płatności
app.use('/api/v1/dashboard', dashboardRoutes); // Statystyki admina
app.use('/api/v1/ai', aiRoutes);               // Moduły sztucznej inteligencji

// Globalny handler błędów — musi być na końcu!
app.use(errorHandler);
