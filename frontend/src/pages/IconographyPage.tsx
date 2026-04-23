import React, { useEffect, useState } from 'react';
import assetService from '../services/assetService';
import { Asset } from '../types/asset';
import '../styles/IconographyPage.css';

const IconographyPage: React.FC = () => {
  const [icons, setIcons] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIcons();
  }, []);

  const loadIcons = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all assets from "Iconography" category
      const data = await assetService.getByCategory('Iconography');
      setIcons(data);
    } catch (err) {
      setError('Failed to load icons. Please try again.');
      console.error('Error loading icons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (icon: Asset) => {
    if (icon.url.includes('drive.google.com') || icon.url.includes('drive.usercontent.google.com')) {
      window.location.href = icon.url;
    } else {
      const link = document.createElement('a');
      link.href = icon.url;
      link.download = icon.name || 'icon';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="iconography-page">
        <div className="loading">Loading icons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="iconography-page">
        <div className="error">{error}</div>
        <button onClick={loadIcons} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="iconography-page">
      <div className="iconography-header">
        <h1>PIBIT.AI Iconography</h1>
        <p className="iconography-count">{icons.length} Icon{icons.length !== 1 ? 's' : ''}</p>
      </div>

      {icons.length === 0 ? (
        <div className="empty-state">
          <p>No icons available yet.</p>
          <p>Add assets to the "Iconography" category to display them here.</p>
        </div>
      ) : (
        <div className="iconography-grid">
          {icons.map((icon) => (
            <div 
              key={icon.id} 
              className="icon-item" 
              onClick={() => handleDownload(icon)}
              title={`${icon.name} - Click to download`}
            >
              <img 
                src={icon.url} 
                alt={icon.name}
                className="icon-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%239ca3af"%3E🖼️%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="iconography-footer">
        <p>Click any icon to download • All icons are property of PIBIT.AI</p>
      </div>
    </div>
  );
};

export default IconographyPage;
