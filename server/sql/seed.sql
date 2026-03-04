TRUNCATE TABLE invoices, webhook_events, webhook_tokens, webhooks, integrations, workflow_schedules, workflow_runs,
workflows, process_runs, processes, operation_logs, subscriptions, users, content_pages, workspaces RESTART IDENTITY CASCADE;

INSERT INTO workspaces (id, name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Workspace'),
  ('00000000-0000-0000-0000-000000000002', 'Enterprise Workspace');

INSERT INTO users (id, workspace_id, email, password_hash, full_name, role, plan)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@demo.com', '$2a$10$R3sDhkMvz7m.ZKUSGf4S1.usvQehYB4Yr7VGYb5DiTxw6TWByVj0W', 'Demo Admin', 'admin', 'enterprise'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'user@demo.com', '$2a$10$R3sDhkMvz7m.ZKUSGf4S1.usvQehYB4Yr7VGYb5DiTxw6TWByVj0W', 'Demo User', 'user', 'pro');

INSERT INTO subscriptions (workspace_id, plan, billing_interval, status, trial_ends_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'pro', 'monthly', 'active', NOW() + interval '7 days');

INSERT INTO processes (id, workspace_id, created_by, name, description, status)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Lead Qualification', 'Automatyczne punktowanie leadów', 'active'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Invoice Reminder', 'Przypomnienia o fakturach', 'draft');

INSERT INTO workflows (id, workspace_id, created_by, name, nodes, edges)
VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Onboarding Workflow',
   '[{"id":"n1","type":"trigger","config":{"event":"user_signup"}},{"id":"n2","type":"email","config":{"template":"welcome"}}]'::jsonb,
   '[{"source":"n1","target":"n2"}]'::jsonb);

INSERT INTO integrations (workspace_id, provider, config)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'google_sheets', '{"sheetId":"demo-sheet"}'),
  ('00000000-0000-0000-0000-000000000001', 'zapier', '{"hook":"https://hooks.zapier.com/demo"}');

INSERT INTO webhooks (workspace_id, url, events)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://example.com/hook', ARRAY['workflow.completed','invoice.created']);

INSERT INTO webhook_tokens (workspace_id, token)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo-incoming-token');

INSERT INTO operation_logs (workspace_id, user_id, process_id, operation_type, status, metadata)
SELECT
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  CASE WHEN gs % 2 = 0 THEN '20000000-0000-0000-0000-000000000001'::uuid ELSE NULL END,
  CASE WHEN gs % 3 = 0 THEN 'workflow_run' ELSE 'process_execution' END,
  CASE WHEN gs % 9 = 0 THEN 'failed' ELSE 'success' END,
  jsonb_build_object('durationMs', 100 + gs, 'source', 'seed')
FROM generate_series(1, 120) AS gs;

INSERT INTO content_pages (slug, title, content, published)
VALUES
  ('pricing', 'Pricing', 'Cennik planów Free, Pro i Enterprise', true),
  ('terms', 'Terms of Service', 'Regulamin usługi', true);

INSERT INTO invoices (workspace_id, amount_cents, currency, status, invoice_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 4900, 'usd', 'paid', 'https://example.com/invoice/1');
