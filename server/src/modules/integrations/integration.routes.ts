import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const rows = await db.query('SELECT * FROM integrations WHERE workspace_id=$1', [req.user!.workspaceId]);
  res.json(rows.rows);
});

router.post('/', async (req, res) => {
  const body = z
    .object({ provider: z.enum(['slack', 'notion', 'google_sheets', 'zapier', 'custom_api']), config: z.record(z.unknown()) })
    .parse(req.body);

  const row = await db.query(
    `INSERT INTO integrations(workspace_id,provider,config,is_active)
     VALUES($1,$2,$3,TRUE)
     RETURNING *`,
    [req.user!.workspaceId, body.provider, body.config]
  );

  res.status(201).json(row.rows[0]);
});

export default router;
