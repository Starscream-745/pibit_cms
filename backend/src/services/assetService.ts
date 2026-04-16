import { Asset, CreateAssetDTO, UpdateAssetDTO } from '../models/asset';
import { AssetRepository } from '../repositories/assetRepository';
import { validateUrl, validateRequiredFields } from '../utils/validation';
import { sanitizeObject } from '../utils/sanitization';

export class AssetService {
  constructor(private repository: AssetRepository) {}

  async findAll(): Promise<Asset[]> {
    return await this.repository.findAll();
  }

  async findById(id: string): Promise<Asset | null> {
    if (!id || typeof id !== 'string' || !id.trim()) {
      return null;
    }
    return await this.repository.findById(id);
  }

  async findByCategory(category: string): Promise<Asset[]> {
    if (!category || typeof category !== 'string') {
      return [];
    }
    return await this.repository.findByCategory(category);
  }

  async create(assetData: CreateAssetDTO): Promise<Asset> {
    // Validate required fields
    validateRequiredFields(assetData, ['name', 'url', 'category']);
    
    // Validate URL format
    validateUrl(assetData.url);
    
    // Sanitize all input fields to prevent XSS
    const sanitizedData = sanitizeObject(assetData);
    
    // Ensure description has a default value
    if (!sanitizedData.description) {
      sanitizedData.description = '';
    }
    
    return await this.repository.save(sanitizedData);
  }

  async update(id: string, data: UpdateAssetDTO): Promise<Asset | null> {
    if (!id || typeof id !== 'string' || !id.trim()) {
      return null;
    }

    // Check if asset exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    // Validate URL if provided
    if (data.url) {
      validateUrl(data.url);
    }

    // Sanitize all input fields
    const sanitizedData = sanitizeObject(data);

    return await this.repository.update(id, sanitizedData);
  }

  async delete(id: string): Promise<boolean> {
    if (!id || typeof id !== 'string' || !id.trim()) {
      return false;
    }
    return await this.repository.delete(id);
  }

  async getAllCategories(): Promise<string[]> {
    const assets = await this.repository.findAll();
    const categories = assets.map(asset => asset.category);
    // Return unique categories
    return [...new Set(categories)].sort();
  }
}
