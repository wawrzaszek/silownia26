import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, type JwtPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    // Redefiniujemy User, aby pasował do naszego JwtPayload.
    // Dzięki temu req.user będzie miał wszystkie potrzebne nam pola (sub, role, workspaceId).
    interface User extends JwtPayload {}
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const token = auth.replace('Bearer ', '');
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
