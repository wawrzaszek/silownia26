import cron from 'node-cron';
import { db } from '../../db/pool.js';

export function startScheduler(): void {
  cron.schedule('*/5 * * * *', async () => {
    const due = await db.query(
      `SELECT id, workflow_id, workspace_id
       FROM workflow_schedules
       WHERE next_run_at <= NOW() AND is_active=TRUE
       LIMIT 20`
    );

    for (const row of due.rows) {
      await db.query(
        `INSERT INTO workflow_runs(workflow_id, workspace_id, status, started_at)
         VALUES($1,$2,'queued',NOW())`,
        [row.workflow_id, row.workspace_id]
      );

      await db.query(
        `UPDATE workflow_schedules
         SET next_run_at = NOW() + interval '5 minutes'
         WHERE id=$1`,
        [row.id]
      );
    }
  });
}
