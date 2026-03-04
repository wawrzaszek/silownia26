import { NextFunction, Request, Response } from 'express';

export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
}
