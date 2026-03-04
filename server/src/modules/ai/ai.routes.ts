import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/assistant', async (req, res) => {
  const body = z.object({ objective: z.string().min(8), context: z.string().optional() }).parse(req.body);

  const suggestion = {
    title: 'AI Workflow Draft',
    steps: [
      'Trigger: new lead in CRM',
      'Validate lead score > 70',
      'Send onboarding email + assign owner',
      'Create follow-up task after 48h'
    ],
    kpi: 'Expected response time -23%'
  };

  res.json({ objective: body.objective, context: body.context ?? null, suggestion });
});

export default router;
