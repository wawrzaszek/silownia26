import { Router } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db } from '../../db/pool.js';
import { env } from '../../config/env.js';
import { signAccessToken, signRefreshToken, type JwtPayload } from '../../utils/jwt.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2)
});

router.post('/register', async (req, res) => {
  const body = registerSchema.parse(req.body);
  const exists = await db.query('SELECT id FROM users WHERE email=$1', [body.email]);
  if (exists.rowCount) {
    res.status(409).json({ message: 'Email already used' });
    return;
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const workspace = await db.query('INSERT INTO workspaces(name) VALUES($1) RETURNING id', [`${body.fullName} Workspace`]);

  const created = await db.query(
    `INSERT INTO users(email,password_hash,full_name,role,workspace_id)
     VALUES($1,$2,$3,'user',$4)
     RETURNING id,email,role,workspace_id`,
    [body.email, passwordHash, body.fullName, workspace.rows[0].id]
  );

  const user = created.rows[0];
  const payload = { sub: user.id, email: user.email, role: user.role, workspaceId: user.workspace_id };

  res.status(201).json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user
  });
});

router.post('/login', async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
  const found = await db.query(
    'SELECT id,email,full_name,role,workspace_id,password_hash,is_blocked FROM users WHERE email=$1',
    [body.email]
  );

  if (!found.rowCount) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const user = found.rows[0];
  if (user.is_blocked) {
    res.status(403).json({ message: 'Account blocked' });
    return;
  }

  const ok = await bcrypt.compare(body.password, user.password_hash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const payload = { sub: user.id, email: user.email, role: user.role, workspaceId: user.workspace_id };
  res.json({ accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload), user });
});

router.post('/reset-password', async (req, res) => {
  const body = z.object({ email: z.string().email() }).parse(req.body);
  await db.query("UPDATE users SET reset_token=$1, reset_expires_at=NOW()+interval '1 hour' WHERE email=$2", [randomUUID(), body.email]);
  res.json({ message: 'If account exists, reset email was sent.' });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await db.query(
    'SELECT id,email,full_name,role,workspace_id,plan,two_factor_enabled,created_at FROM users WHERE id=$1',
    [req.user!.sub]
  );
  res.json(user.rows[0]);
});

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          done(new Error('Google account without email'));
          return;
        }

        let user = await db.query('SELECT id,email,role,workspace_id FROM users WHERE email=$1', [email]);
        if (!user.rowCount) {
          const workspace = await db.query('INSERT INTO workspaces(name) VALUES($1) RETURNING id', [`${profile.displayName} Workspace`]);
          user = await db.query(
            `INSERT INTO users(email,full_name,role,workspace_id)
             VALUES($1,$2,'user',$3)
             RETURNING id,email,role,workspace_id`,
            [email, profile.displayName, workspace.rows[0].id]
          );
        }

        const u = user.rows[0];
        const payload: JwtPayload = { sub: u.id, email: u.email, role: u.role, workspaceId: u.workspace_id };
        done(null, payload);
      }
    )
  );

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

  router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const user = req.user!; // Już jest typu JwtPayload (Express.User)
    const token = signAccessToken(user);
    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
  });
}

export default router;
