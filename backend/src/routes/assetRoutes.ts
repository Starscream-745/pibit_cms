import { Router, Request, Response, NextFunction } from 'express';
import { AssetController } from '../controllers/assetController';
import { AssetService } from '../services/assetService';
import { AssetRepository } from '../repositories/assetRepository';
import database from '../config/database';
import { authenticate, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Lazy initialization of dependencies
let assetController: AssetController;

function getController(): AssetController {
  if (!assetController) {
    const db = database.getDb();
    const assetRepository = new AssetRepository(db);
    const assetService = new AssetService(assetRepository);
    assetController = new AssetController(assetService);
  }
  return assetController;
}

// Wrapper function to ensure controller is initialized
const withController = (handler: (controller: AssetController) => (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const controller = getController();
    return handler(controller)(req, res, next);
  };
};

// Public routes (read-only)
router.get('/assets', optionalAuth, withController(c => c.getAllAssets));
router.get('/assets/:id', optionalAuth, withController(c => c.getAssetById));
router.get('/assets/category/:category', optionalAuth, withController(c => c.getAssetsByCategory));
router.get('/categories', optionalAuth, withController(c => c.getAllCategories));

// Protected routes (require authentication)
router.post('/assets', authenticate, withController(c => c.createAsset));
router.put('/assets/:id', authenticate, withController(c => c.updateAsset));
router.delete('/assets/:id', authenticate, withController(c => c.deleteAsset));

export default router;
