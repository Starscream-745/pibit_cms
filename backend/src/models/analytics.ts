export interface UserActivity {
  id: string;
  userId?: string; // Optional for anonymous users
  sessionId: string;
  activityType: 'view' | 'download' | 'login' | 'create_user' | 'delete_user' | 'upload_asset' | 'delete_asset' | 'edit_asset';
  assetId?: string; // For download/view tracking
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>; // Flexible field for extra info like created username, asset name, etc.
}

export interface DownloadEvent {
  id: string;
  assetId: string;
  assetName: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface AnalyticsSummary {
  dau: number; // Daily Active Users
  wau: number; // Weekly Active Users
  mau: number; // Monthly Active Users
  totalDownloads: number;
  downloadsToday: number;
  downloadsThisWeek: number;
  downloadsThisMonth: number;
  topDownloadedAssets: Array<{
    assetId: string;
    assetName: string;
    downloadCount: number;
  }>;
}

export interface CreateUserActivityDTO {
  userId?: string;
  sessionId: string;
  activityType: 'view' | 'download' | 'login' | 'create_user' | 'delete_user' | 'upload_asset' | 'delete_asset' | 'edit_asset';
  assetId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}
