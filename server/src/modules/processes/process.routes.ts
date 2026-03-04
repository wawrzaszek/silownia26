import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';
import { logOperation } from '../logs/log.service.js';

const router = Router();
router.use(requireAuth);

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused']).default('draft')
});

router.get('/', async (req, res) => {
  const rows = await db.query('SELECT * FROM processes WHERE workspace_id=$1 ORDER BY created_at DESC', [req.user!.workspaceId]);
  res.json(rows.rows);
});

router.post('/', async (req, res) => {
  const body = schema.parse(req.body);
  const created = await db.query(
    `INSERT INTO processes(workspace_id,name,description,status,created_by)
     VALUES($1,$2,$3,$4,$5)
     RETURNING *`,
    [req.user!.workspaceId, body.name, body.description ?? null, body.status, req.user!.sub]
  );

  await logOperation({
    workspaceId: req.user!.workspaceId,
    userId: req.user!.sub,
    type: 'process_created',
    metadata: { processId: created.rows[0].id }
  });

  res.status(201).json(created.rows[0]);
});

router.patch('/:id', async (req, res) => {
  const body = schema.partial().parse(req.body);
  const updated = await db.query(
    `UPDATE processes
     SET name=COALESCE($1,name),
         description=COALESCE($2,description),
         status=COALESCE($3,status),
         updated_at=NOW()
     WHERE id=$4 AND workspace_id=$5
     RETURNING *`,
    [body.name, body.description, body.status, req.params.id, req.user!.workspaceId]
  );

  if (!updated.rowCount) {
    res.status(404).json({ message: 'Process not found' });
    return;
  }

  res.json(updated.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM processes WHERE id=$1 AND workspace_id=$2', [req.params.id, req.user!.workspaceId]);
  res.status(204).send();
});

export default router;
