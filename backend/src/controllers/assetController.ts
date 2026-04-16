import { Request, Response, NextFunction } from 'express';
import { AssetService } from '../services/assetService';
import { AppError } from '../middleware/errorHandler';

export class AssetController {
  constructor(private assetService: AssetService) {}

  getAllAssets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assets = await this.assetService.findAll();
      res.status(200).json(assets);
    } catch (error) {
      next(error);
    }
  };

  getAssetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const asset = await this.assetService.findById(id);
      
      if (!asset) {
        throw new AppError(404, 'ASSET_NOT_FOUND', `Asset with id ${id} not found`);
      }
      
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };

  getAssetsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.params;
      const assets = await this.assetService.findByCategory(category);
      res.status(200).json(assets);
    } catch (error) {
      next(error);
    }
  };

  createAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assetData = req.body;
      const asset = await this.assetService.create(assetData);
      res.status(201).json(asset);
    } catch (error) {
      next(error);
    }
  };

  updateAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const asset = await this.assetService.update(id, updateData);
      
      if (!asset) {
        throw new AppError(404, 'ASSET_NOT_FOUND', `Asset with id ${id} not found`);
      }
      
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };

  deleteAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.assetService.delete(id);
      
      if (!deleted) {
        throw new AppError(404, 'ASSET_NOT_FOUND', `Asset with id ${id} not found`);
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.assetService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };
}
