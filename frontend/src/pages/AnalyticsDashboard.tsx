import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Users, Activity, TrendingUp, DownloadCloud } from 'lucide-react';
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

const AnalyticsDashboard: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
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
      
      const response = await fetch(`${apiUrl}/api/analytics/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

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

  if (!analytics) {
    return null;
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <button onClick={fetchAnalytics} className="btn btn-refresh">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      
      <div className="bento-container">
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

      <div className="top-downloads-section">
        <h2>Top Downloaded Assets</h2>
        <div className="top-downloads-list">
          {analytics.topDownloadedAssets.length === 0 ? (
            <p className="no-data">No download data available yet</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default AnalyticsDashboard;
