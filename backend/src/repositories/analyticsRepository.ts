import { Db, Collection } from 'mongodb';
import { UserActivity, DownloadEvent, CreateUserActivityDTO } from '../models/analytics';
import { v4 as uuidv4 } from 'uuid';

export class AnalyticsRepository {
  private activityCollection: Collection<UserActivity>;
  private downloadsCollection: Collection<DownloadEvent>;

  constructor(db: Db) {
    this.activityCollection = db.collection<UserActivity>('user_activities');
    this.downloadsCollection = db.collection<DownloadEvent>('download_events');
    this.createIndexes();
  }

  private async createIndexes(): Promise<void> {
    try {
      // Index for efficient date-based queries
      await this.activityCollection.createIndex({ timestamp: -1 });
      await this.activityCollection.createIndex({ sessionId: 1 });
      await this.activityCollection.createIndex({ activityType: 1, timestamp: -1 });
      
      await this.downloadsCollection.createIndex({ timestamp: -1 });
      await this.downloadsCollection.createIndex({ assetId: 1, timestamp: -1 });
    } catch (error) {
      console.error('Error creating analytics indexes:', error);
    }
  }

  async logActivity(data: CreateUserActivityDTO): Promise<UserActivity> {
    const activity: UserActivity = {
      id: uuidv4(),
      ...data,
      timestamp: new Date()
    };

    await this.activityCollection.insertOne(activity as any);
    return activity;
  }

  async getRecentActivities(limit: number = 50): Promise<UserActivity[]> {
    return await this.activityCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async logDownload(assetId: string, assetName: string, sessionId: string, userId?: string, ipAddress?: string): Promise<DownloadEvent> {
    const download: DownloadEvent = {
      id: uuidv4(),
      assetId,
      assetName,
      userId,
      sessionId,
      timestamp: new Date(),
      ipAddress
    };

    await this.downloadsCollection.insertOne(download as any);
    return download;
  }

  async getDAU(date: Date = new Date()): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const uniqueSessions = await this.activityCollection.distinct('sessionId', {
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    return uniqueSessions.length;
  }

  async getWAU(date: Date = new Date()): Promise<number> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const uniqueSessions = await this.activityCollection.distinct('sessionId', {
      timestamp: { $gte: startOfWeek, $lte: date }
    });

    return uniqueSessions.length;
  }

  async getMAU(date: Date = new Date()): Promise<number> {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(date.getDate() - 30);
    startOfMonth.setHours(0, 0, 0, 0);

    const uniqueSessions = await this.activityCollection.distinct('sessionId', {
      timestamp: { $gte: startOfMonth, $lte: date }
    });

    return uniqueSessions.length;
  }

  async getTotalDownloads(): Promise<number> {
    return await this.downloadsCollection.countDocuments();
  }

  async getDownloadsInPeriod(startDate: Date, endDate: Date): Promise<number> {
    return await this.downloadsCollection.countDocuments({
      timestamp: { $gte: startDate, $lte: endDate }
    });
  }

  async getTopDownloadedAssets(limit: number = 10): Promise<Array<{ assetId: string; assetName: string; downloadCount: number }>> {
    const pipeline = [
      {
        $group: {
          _id: '$assetId',
          assetName: { $first: '$assetName' },
          downloadCount: { $sum: 1 }
        }
      },
      {
        $sort: { downloadCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          assetId: '$_id',
          assetName: 1,
          downloadCount: 1
        }
      }
    ];

    return await this.downloadsCollection.aggregate(pipeline).toArray() as any;
  }

  async getDownloadsByAsset(assetId: string): Promise<number> {
    return await this.downloadsCollection.countDocuments({ assetId });
  }
}
