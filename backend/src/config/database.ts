import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/pibit-cms';
    
    try {
      this.client = new MongoClient(url, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        connectTimeoutMS: 5000,
      });
      await this.client.connect();
      this.db = this.client.db();
      
      console.log('✅ Connected to MongoDB');
      
      // Create indexes
      await this.createIndexes();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) return;
    
    try {
      // Create index on category field for better query performance
      await this.db.collection('assets').createIndex({ category: 1 });
      console.log('✅ Database indexes created');
    } catch (error) {
      console.error('⚠️  Index creation warning:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}

export default new Database();
