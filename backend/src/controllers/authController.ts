import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
  /**
   * Login endpoint
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        res.status(400).json({ error: 'Username, password, and role are required' });
        return;
      }

      if (role !== 'admin' && role !== 'user') {
        res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
        return;
      }

      const result = await authService.login({ username, password, role });

      res.status(200).json({
        success: true,
        token: result.token,
        expiresIn: result.expiresIn,
        role: result.role,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Invalid credentials',
      });
    }
  }

  /**
   * Check auth status
   */
  async status(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      authEnabled: authService.isAuthEnabled(),
      message: authService.isAuthEnabled() 
        ? 'Authentication is enabled' 
        : 'Authentication is disabled',
    });
  }

  /**
   * Verify token endpoint
   */
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ valid: false, error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);

      res.status(200).json({
        valid: true,
        user: decoded,
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: 'Invalid or expired token',
      });
    }
  }
}

export default new AuthController();
