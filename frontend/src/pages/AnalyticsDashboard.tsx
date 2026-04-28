import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Users, Activity, TrendingUp, DownloadCloud } from 'lucide-react';
import Preloader from '../components/Preloader';
import '../styles/AnalyticsDashboard.css';

interface AnalyticsSummary {
  dau: number;
  wau: number;
  mau: number;
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

interface ActivityEvent {
  id: string;
  userId?: string;
  sessionId: string;
  activityType: string;
  assetId?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

const AnalyticsDashboard: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/');
      return;
    }

    fetchAnalytics();
  }, [isAuthenticated, userRole, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('authToken');
      
      const [summaryRes, activityRes] = await Promise.all([
        fetch(`${apiUrl}/api/analytics/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/analytics/activity?limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      if (!activityRes.ok) throw new Error('Failed to fetch activities');

      const [summaryData, activityData] = await Promise.all([
        summaryRes.json(),
        activityRes.json()
      ]);

      setAnalytics(summaryData);
      setActivities(activityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-error">
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <button onClick={fetchAnalytics} className="btn btn-refresh" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="bento-container">
        {loading && !analytics ? (
          <div className="loading-skeleton-grid">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-value"></div>
                <div className="skeleton skeleton-label"></div>
              </div>
            ))}
          </div>
        ) : analytics ? (
          <div className="analytics-grid">
            <div className="analytics-card highlight">
              <div className="card-icon dau">
                <Users size={24} />
              </div>
              <div className="card-content">
                <h3>Daily Active Users</h3>
                <p className="metric-value">{analytics.dau}</p>
                <p className="metric-label">Today</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon wau">
                <Activity size={24} />
              </div>
              <div className="card-content">
                <h3>Weekly Active Users</h3>
                <p className="metric-value">{analytics.wau}</p>
                <p className="metric-label">Last 7 days</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon mau">
                <TrendingUp size={24} />
              </div>
              <div className="card-content">
                <h3>Monthly Active Users</h3>
                <p className="metric-value">{analytics.mau}</p>
                <p className="metric-label">Last 30 days</p>
              </div>
            </div>

            <div className="analytics-card highlight">
              <div className="card-icon downloads">
                <DownloadCloud size={24} />
              </div>
              <div className="card-content">
                <h3>Total Downloads</h3>
                <p className="metric-value">{analytics.totalDownloads}</p>
                <p className="metric-label">All time</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-content">
                <h3>Downloads Today</h3>
                <p className="metric-value">{analytics.downloadsToday}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-content">
                <h3>Downloads This Week</h3>
                <p className="metric-value">{analytics.downloadsThisWeek}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-content">
                <h3>Downloads This Month</h3>
                <p className="metric-value">{analytics.downloadsThisMonth}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="top-downloads-section">
          <h2>Top Downloaded Assets</h2>
          <div className="top-downloads-list">
            {loading && !analytics ? (
              [1, 2, 3].map(i => (
                <div key={i} className="top-download-item">
                  <div className="skeleton skeleton-rank"></div>
                  <div className="asset-info" style={{ flex: 1, marginLeft: '1rem' }}>
                    <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                    <div className="skeleton skeleton-label" style={{ width: '30%' }}></div>
                  </div>
                </div>
              ))
            ) : analytics && analytics.topDownloadedAssets.length === 0 ? (
              <p className="no-data">No download data available yet</p>
            ) : analytics ? (
              analytics.topDownloadedAssets.map((asset, index) => (
                <div key={asset.assetId} className="top-download-item">
                  <div className="rank">{index + 1}</div>
                  <div className="asset-info">
                    <h4>{asset.assetName}</h4>
                    <p className="asset-id">{asset.assetId}</p>
                  </div>
                  <div className="download-count">
                    <span className="count">{asset.downloadCount}</span>
                    <span className="label">downloads</span>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>

        <div className="recent-activity-section">
          <h2>Audit Log / Recent Activity</h2>
          <div className="recent-activity-list">
            {loading && activities.length === 0 ? (
              <div className="skeleton-rows">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton skeleton-row"></div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <p className="no-data">No activity data available yet</p>
            ) : (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>User / Session</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{new Date(activity.timestamp).toLocaleString()}</td>
                      <td>
                        <span className={`activity-type type-${activity.activityType}`}>
                          {activity.activityType.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{activity.userId ? `User ID: ${activity.userId.substring(0, 8)}...` : `Session: ${activity.sessionId.substring(0, 8)}...`}</td>
                      <td className="activity-details">
                        {activity.activityType === 'download' && activity.assetId ? `Asset: ${activity.assetId}` : ''}
                        {activity.details ? JSON.stringify(activity.details) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
