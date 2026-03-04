import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
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

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan('dev'));

app.post('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(passport.initialize());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'slopax-saas-backend' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/processes', processRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/integrations', integrationRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/exports', exportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/cms', cmsRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use(errorHandler);
