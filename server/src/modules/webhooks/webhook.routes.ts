import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const data = await db.query('SELECT id,url,events,is_active,created_at FROM webhooks WHERE workspace_id=$1', [req.user!.workspaceId]);
  res.json(data.rows);
});

router.post('/', async (req, res) => {
  const body = z.object({ url: z.string().url(), events: z.array(z.string()).min(1) }).parse(req.body);
  const created = await db.query(
    'INSERT INTO webhooks(workspace_id,url,events,is_active) VALUES($1,$2,$3,TRUE) RETURNING *',
    [req.user!.workspaceId, body.url, body.events]
  );
  res.status(201).json(created.rows[0]);
});

router.post('/incoming/:token', async (req, res) => {
  const entry = await db.query('SELECT workspace_id FROM webhook_tokens WHERE token=$1', [req.params.token]);
  if (!entry.rowCount) {
    res.status(404).json({ message: 'Webhook token not found' });
    return;
  }

  await db.query('INSERT INTO webhook_events(workspace_id,payload) VALUES($1,$2)', [entry.rows[0].workspace_id, req.body]);
  res.json({ ok: true });
});

export default router;
