import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { AnalyticsSummary, CreateUserActivityDTO } from '../models/analytics';

export class AnalyticsService {
  private cache: { data: AnalyticsSummary | null; lastUpdated: number } = {
    data: null,
    lastUpdated: 0
  };
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private repository: AnalyticsRepository) {}

  async logActivity(data: CreateUserActivityDTO): Promise<void> {
    await this.repository.logActivity(data);
  }

  async logDownload(assetId: string, assetName: string, sessionId: string, userId?: string, ipAddress?: string): Promise<void> {
    // Log as both a download event and a user activity
    await this.repository.logDownload(assetId, assetName, sessionId, userId, ipAddress);
    await this.repository.logActivity({
      userId,
      sessionId,
      activityType: 'download',
      assetId,
      ipAddress
    });
  }

  async getSummary(): Promise<AnalyticsSummary> {
    const now = new Date();
    const currentTime = now.getTime();

    // Return cached data if it's still fresh
    if (this.cache.data && (currentTime - this.cache.lastUpdated < this.CACHE_DURATION)) {
      console.log('⚡ Returning cached analytics summary');
      return this.cache.data;
    }

    console.log('📊 Fetching fresh analytics summary (aggregated)');
    const startTime = Date.now();
    
    const summary = await this.repository.getSummaryData(now);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Analytics summary fetched in ${duration}ms`);

    // Update cache
    this.cache = {
      data: summary,
      lastUpdated: currentTime
    };

    return summary;
  }

  async getDownloadsByAsset(assetId: string): Promise<number> {
    return await this.repository.getDownloadsByAsset(assetId);
  }

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    return await this.repository.getRecentActivities(limit);
  }
}
