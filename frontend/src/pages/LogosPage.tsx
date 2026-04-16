import React, { useEffect, useState } from 'react';
import assetService from '../services/assetService';
import { Asset } from '../types/asset';
import '../styles/LogosPage.css';

const LogosPage: React.FC = () => {
  const [logos, setLogos] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all assets from "Logos" category
      const data = await assetService.getByCategory('Logos');
      setLogos(data);
    } catch (err) {
      setError('Failed to load logos. Please try again.');
      console.error('Error loading logos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (logo: Asset) => {
    // For Google Drive or external URLs, we need to handle CORS
    // If it's a Google Drive link, just open it (it will trigger download)
    if (logo.url.includes('drive.google.com') || logo.url.includes('drive.usercontent.google.com')) {
      // Google Drive links work best with window.location
      window.location.href = logo.url;
    } else {
      // For other URLs (like MongoDB files), try download attribute
      const link = document.createElement('a');
      link.href = logo.url;
      link.download = logo.name || 'logo';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="logos-page">
        <div className="loading">Loading logos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logos-page">
        <div className="error">{error}</div>
        <button onClick={loadLogos} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="logos-page">
      <div className="logos-header">
        <h1>PIBIT.AI Brand Logos</h1>
        <p className="logos-count">{logos.length} Logo{logos.length !== 1 ? 's' : ''}</p>
      </div>

      {logos.length === 0 ? (
        <div className="empty-state">
          <p>No logos available yet.</p>
          <p>Add logos to the "Logos" category to display them here.</p>
        </div>
      ) : (
        <div className="logos-grid">
          {logos.map((logo) => (
            <div 
              key={logo.id} 
              className="logo-item" 
              onClick={() => handleDownload(logo)}
              title={`${logo.name} - Click to download`}
            >
              <img 
                src={logo.url} 
                alt={logo.name}
                className="logo-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%239ca3af"%3E🖼️%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="logos-footer">
        <p>Click any logo to download • All logos are property of PIBIT.AI</p>
      </div>
    </div>
  );
};

export default LogosPage;
