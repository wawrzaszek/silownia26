import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/role.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/pages', async (_req, res) => {
  const pages = await db.query('SELECT * FROM content_pages ORDER BY updated_at DESC');
  res.json(pages.rows);
});

router.post('/pages', async (req, res) => {
  const body = z.object({ slug: z.string(), title: z.string(), content: z.string(), published: z.boolean() }).parse(req.body);
  const page = await db.query(
    `INSERT INTO content_pages(slug,title,content,published)
     VALUES($1,$2,$3,$4)
     RETURNING *`,
    [body.slug, body.title, body.content, body.published]
  );
  res.status(201).json(page.rows[0]);
});

export default router;
