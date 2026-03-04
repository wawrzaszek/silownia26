import { Router } from 'express';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/overview', async (req, res) => {
  const [operations, processes, efficiency] = await Promise.all([
    db.query(
      `SELECT COUNT(*)::int AS count
       FROM operation_logs
       WHERE workspace_id=$1 AND created_at > NOW() - interval '30 days'`,
      [req.user!.workspaceId]
    ),
    db.query('SELECT COUNT(*)::int AS count FROM processes WHERE workspace_id=$1', [req.user!.workspaceId]),
    db.query(
      `SELECT COALESCE(ROUND(AVG(CASE WHEN status='success' THEN 100 ELSE 0 END),2),0) AS score
       FROM operation_logs
       WHERE workspace_id=$1 AND created_at > NOW() - interval '30 days'`,
      [req.user!.workspaceId]
    )
  ]);

  res.json({
    operations: operations.rows[0].count,
    processCount: processes.rows[0].count,
    efficiency: Number(efficiency.rows[0].score)
  });
});

router.get('/usage-chart', async (req, res) => {
  const points = await db.query(
    `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
            COUNT(*)::int AS operations
     FROM operation_logs
     WHERE workspace_id=$1 AND created_at > NOW() - interval '14 days'
     GROUP BY 1
     ORDER BY 1`,
    [req.user!.workspaceId]
  );
  res.json(points.rows);
});

export default router;
