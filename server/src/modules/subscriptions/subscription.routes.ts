import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { db } from '../../db/pool.js';

const router = Router();
router.use(requireAuth);

router.get('/current', async (req, res) => {
  const result = await db.query(
    `SELECT plan, billing_interval, trial_ends_at, stripe_customer_id, stripe_subscription_id
     FROM subscriptions
     WHERE workspace_id=$1`,
    [req.user!.workspaceId]
  );

  if (!result.rowCount) {
    res.json({ plan: 'free', billing_interval: null });
    return;
  }

  res.json(result.rows[0]);
});

export default router;
