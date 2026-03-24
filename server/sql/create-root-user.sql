-- Script to create a root user in an existing database
-- Usage: psql $DATABASE_URL -f create-root-user.sql

INSERT INTO users (id, workspace_id, email, password_hash, full_name, role, plan)
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  '00000000-0000-0000-0000-000000000001', 
  'root@silownia26.pl', 
  '$2a$10$R3sDhkMvz7m.ZKUSGf4S1.usvQehYB4Yr7VGYb5DiTxw6TWByVj0W', -- password: root123456
  'System Root', 
  'admin', 
  'enterprise'
)
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  plan = 'enterprise',
  full_name = 'System Root';
