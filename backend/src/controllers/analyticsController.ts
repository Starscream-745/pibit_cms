import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getSummary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.analyticsService.getSummary();
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  getDownloadsByAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assetId } = req.params;
      const count = await this.analyticsService.getDownloadsByAsset(assetId);
      res.status(200).json({ assetId, downloadCount: count });
    } catch (error) {
      next(error);
    }
  };

  getRecentActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await this.analyticsService.getRecentActivities(limit);
      res.status(200).json(activities);
    } catch (error) {
      next(error);
    }
  };
}
