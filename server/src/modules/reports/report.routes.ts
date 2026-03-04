import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/usage.pdf', async (req, res) => {
  const summary = await db.query(
    `SELECT COUNT(*)::int AS operations,
            COUNT(DISTINCT process_id)::int AS active_processes
     FROM process_runs
     WHERE workspace_id=$1 AND created_at > NOW() - interval '30 days'`,
    [req.user!.workspaceId]
  );

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=usage-report.pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Usage Report (30 days)');
  doc.moveDown();
  doc.fontSize(12).text(`Workspace: ${req.user!.workspaceId}`);
  doc.text(`Operations: ${summary.rows[0].operations}`);
  doc.text(`Active processes: ${summary.rows[0].active_processes}`);
  doc.end();
});

export default router;
