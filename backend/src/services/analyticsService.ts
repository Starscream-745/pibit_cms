import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { AnalyticsSummary, CreateUserActivityDTO } from '../models/analytics';

export class AnalyticsService {
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
    
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    
    const startOfMonth = new Date(now);
    startOfMonth.setDate(now.getDate() - 30);

    const [dau, wau, mau, totalDownloads, downloadsToday, downloadsThisWeek, downloadsThisMonth, topDownloadedAssets] = await Promise.all([
      this.repository.getDAU(now),
      this.repository.getWAU(now),
      this.repository.getMAU(now),
      this.repository.getTotalDownloads(),
      this.repository.getDownloadsInPeriod(startOfDay, now),
      this.repository.getDownloadsInPeriod(startOfWeek, now),
      this.repository.getDownloadsInPeriod(startOfMonth, now),
      this.repository.getTopDownloadedAssets(10)
    ]);

    return {
      dau,
      wau,
      mau,
      totalDownloads,
      downloadsToday,
      downloadsThisWeek,
      downloadsThisMonth,
      topDownloadedAssets
    };
  }

  async getDownloadsByAsset(assetId: string): Promise<number> {
    return await this.repository.getDownloadsByAsset(assetId);
  }
}
