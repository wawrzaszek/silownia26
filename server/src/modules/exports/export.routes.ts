import { Router } from 'express';
import { stringify } from 'csv-stringify/sync';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/operations.csv', async (req, res) => {
  const rows = await db.query(
    `SELECT operation_type, status, created_at
     FROM operation_logs
     WHERE workspace_id=$1
     ORDER BY created_at DESC
     LIMIT 1000`,
    [req.user!.workspaceId]
  );

  const csv = stringify(rows.rows, { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=operations.csv');
  res.send(csv);
});

export default router;
