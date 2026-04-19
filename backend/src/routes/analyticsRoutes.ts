import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import database from '../config/database';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

let analyticsController: AnalyticsController;

function getController(): AnalyticsController {
  if (!analyticsController) {
    const db = database.getDb();
    const analyticsRepository = new AnalyticsRepository(db);
    const analyticsService = new AnalyticsService(analyticsRepository);
    analyticsController = new AnalyticsController(analyticsService);
  }
  return analyticsController;
}

const withController = (handler: (controller: AnalyticsController) => (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const controller = getController();
    return handler(controller)(req, res, next);
  };
};

// Protected routes - require authentication (admin only)
router.get('/analytics/summary', authenticate, withController(c => c.getSummary));
router.get('/analytics/downloads/:assetId', authenticate, withController(c => c.getDownloadsByAsset));

export default router;
