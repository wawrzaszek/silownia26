import { Router } from 'express';
import Stripe from 'stripe';
import { env } from '../../config/env.js';
import { requireAuth } from '../../middleware/auth.js';
import { db } from '../../db/pool.js';

const router = Router();
const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

router.post('/webhook', async (req, res) => {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    res.status(200).json({ message: 'Stripe webhook disabled' });
    return;
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || Array.isArray(sig)) {
    res.status(400).send('Missing stripe signature');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    res.status(400).send('Invalid signature');
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspaceId;

    if (workspaceId) {
      await db.query(
        `INSERT INTO subscriptions(workspace_id,plan,billing_interval,stripe_customer_id,stripe_subscription_id,status,trial_ends_at)
         VALUES($1,'pro','monthly',$2,$3,'active', NOW() + interval '7 days')
         ON CONFLICT (workspace_id)
         DO UPDATE SET
           plan='pro',
           status='active',
           stripe_customer_id=EXCLUDED.stripe_customer_id,
           stripe_subscription_id=EXCLUDED.stripe_subscription_id,
           updated_at=NOW()`,
        [workspaceId, session.customer?.toString() ?? null, session.subscription?.toString() ?? null]
      );

      await db.query("UPDATE users SET plan='pro' WHERE workspace_id=$1", [workspaceId]);
    }
  }

  res.json({ received: true });
});

router.use(requireAuth);

router.post('/checkout', async (req, res) => {
  if (!stripe) {
    res.status(400).json({ message: 'Stripe not configured' });
    return;
  }

  const { plan = 'pro', interval = 'monthly' } = req.body as { plan?: string; interval?: 'monthly' | 'yearly' };
  const price = interval === 'yearly' ? env.STRIPE_PRICE_PRO_YEARLY : env.STRIPE_PRICE_PRO_MONTHLY;

  if (!price) {
    res.status(400).json({ message: 'Price not configured' });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${env.FRONTEND_URL}/billing?status=success`,
    cancel_url: `${env.FRONTEND_URL}/billing?status=cancel`,
    metadata: {
      workspaceId: req.user!.workspaceId,
      userId: req.user!.sub,
      plan
    }
  });

  res.json({ url: session.url });
});

router.get('/invoices', async (req, res) => {
  const invoices = await db.query(
    `SELECT id, amount_cents, currency, status, issued_at, invoice_url
     FROM invoices
     WHERE workspace_id=$1
     ORDER BY issued_at DESC`,
    [req.user!.workspaceId]
  );
  res.json(invoices.rows);
});

export default router;
