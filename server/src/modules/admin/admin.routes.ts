import { Router } from 'express';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/role.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/stats', async (_req, res) => {
  const [users, workspaces, operations] = await Promise.all([
    db.query('SELECT COUNT(*)::int AS count FROM users'),
    db.query('SELECT COUNT(*)::int AS count FROM workspaces'),
    db.query("SELECT COUNT(*)::int AS count FROM operation_logs WHERE created_at > NOW() - interval '30 days'")
  ]);

  res.json({
    users: users.rows[0].count,
    workspaces: workspaces.rows[0].count,
    operationsLast30Days: operations.rows[0].count
  });
});

router.get('/users', async (_req, res) => {
  const users = await db.query('SELECT id,email,full_name,role,plan,is_blocked,created_at FROM users ORDER BY created_at DESC');
  res.json(users.rows);
});

router.patch('/users/:id/block', async (req, res) => {
  const user = await db.query('UPDATE users SET is_blocked=TRUE WHERE id=$1 RETURNING id,email,is_blocked', [req.params.id]);
  res.json(user.rows[0]);
});

router.delete('/users/:id', async (req, res) => {
  await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
  res.status(204).send();
});

export default router;
