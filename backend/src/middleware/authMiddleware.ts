import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Skip auth if not enabled
  if (!authService.isAuthEnabled()) {
    next();
    return;
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Invalid token'
    });
  }
};

/**
 * Optional authentication - doesn't block if no token
 */
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!authService.isAuthEnabled()) {
    next();
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = authService.verifyToken(token);
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next();
};
