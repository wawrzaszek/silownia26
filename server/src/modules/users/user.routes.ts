import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.patch('/profile', async (req, res) => {
  const body = z.object({ fullName: z.string().min(2), avatarUrl: z.string().url().optional() }).parse(req.body);
  const updated = await db.query(
    'UPDATE users SET full_name=$1, avatar_url=$2, updated_at=NOW() WHERE id=$3 RETURNING id,email,full_name,avatar_url',
    [body.fullName, body.avatarUrl ?? null, req.user!.sub]
  );
  res.json(updated.rows[0]);
});

router.get('/activity', async (req, res) => {
  const logs = await db.query(
    `SELECT id, operation_type, status, created_at
     FROM operation_logs
     WHERE workspace_id=$1
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.user!.workspaceId]
  );
  res.json(logs.rows);
});

export default router;
