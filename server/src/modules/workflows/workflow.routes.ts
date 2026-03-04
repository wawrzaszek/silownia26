import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const stepSchema = z.object({
  id: z.string(),
  type: z.string(),
  config: z.record(z.unknown())
});

router.get('/', async (req, res) => {
  const workflows = await db.query('SELECT * FROM workflows WHERE workspace_id=$1 ORDER BY updated_at DESC', [req.user!.workspaceId]);
  res.json(workflows.rows);
});

router.post('/', async (req, res) => {
  const body = z.object({ name: z.string().min(2), nodes: z.array(stepSchema), edges: z.array(z.record(z.unknown())) }).parse(req.body);
  const created = await db.query(
    `INSERT INTO workflows(workspace_id,name,nodes,edges,created_by)
     VALUES($1,$2,$3,$4,$5)
     RETURNING *`,
    [req.user!.workspaceId, body.name, JSON.stringify(body.nodes), JSON.stringify(body.edges), req.user!.sub]
  );
  res.status(201).json(created.rows[0]);
});

router.post('/:id/run', async (req, res) => {
  const workflow = await db.query('SELECT * FROM workflows WHERE id=$1 AND workspace_id=$2', [req.params.id, req.user!.workspaceId]);
  if (!workflow.rowCount) {
    res.status(404).json({ message: 'Workflow not found' });
    return;
  }

  await db.query(
    `INSERT INTO workflow_runs(workflow_id,workspace_id,triggered_by,status,started_at)
     VALUES($1,$2,$3,'running',NOW())`,
    [req.params.id, req.user!.workspaceId, req.user!.sub]
  );

  res.json({ message: 'Workflow started' });
});

export default router;
