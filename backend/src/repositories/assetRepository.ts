import { Db, ObjectId, Collection } from 'mongodb';
import { Asset, CreateAssetDTO, UpdateAssetDTO } from '../models/asset';

export class AssetRepository {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection('assets');
  }

  async findAll(): Promise<Asset[]> {
    const documents = await this.collection.find().toArray();
    return documents.map(doc => this.mapToAsset(doc));
  }

  async findById(id: string): Promise<Asset | null> {
    try {
      const document = await this.collection.findOne({ _id: new ObjectId(id) });
      return document ? this.mapToAsset(document) : null;
    } catch (error) {
      // Invalid ObjectId format
      return null;
    }
  }

  async findByCategory(category: string): Promise<Asset[]> {
    // Exact match is significantly faster on indexed fields than regex
    const documents = await this.collection.find({ 
      category: category
    }).toArray();
    return documents.map(doc => this.mapToAsset(doc));
  }

  async getDistinctCategories(): Promise<string[]> {
    const categories = await this.collection.distinct('category');
    return (categories as string[]).sort();
  }

  async save(assetData: CreateAssetDTO): Promise<Asset> {
    const now = new Date();
    const document = {
      ...assetData,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.collection.insertOne(document);
    
    return {
      id: result.insertedId.toString(),
      ...assetData,
      createdAt: now,
      updatedAt: now
    };
  }

  async update(id: string, data: UpdateAssetDTO): Promise<Asset | null> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result ? this.mapToAsset(result) : null;
    } catch (error) {
      // Invalid ObjectId format
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      // Invalid ObjectId format
      return false;
    }
  }

  private mapToAsset(document: Record<string, unknown>): Asset {
    return {
      id: (document._id as { toString(): string }).toString(),
      name: document.name as string,
      url: document.url as string,
      category: document.category as string,
      description: (document.description as string) || '',
      createdAt: document.createdAt as Date,
      updatedAt: document.updatedAt as Date
    };
  }
}
