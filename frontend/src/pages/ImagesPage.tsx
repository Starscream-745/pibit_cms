import React, { useEffect, useState } from 'react';
import assetService from '../services/assetService';
import { Asset } from '../types/asset';
import SearchBar from '../components/SearchBar';
import '../styles/ImagesPage.css';

const ImagesPage: React.FC = () => {
  const [images, setImages] = useState<Asset[]>([]);
  const [filteredImages, setFilteredImages] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all assets from "Images" category
      const data = await assetService.getByCategory('Images');
      setImages(data);
      setFilteredImages(data);
    } catch (err) {
      setError('Failed to load images. Please try again.');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredImages(images);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = images.filter(image => 
      image.name.toLowerCase().includes(lowerQuery) || 
      (image.description && image.description.toLowerCase().includes(lowerQuery))
    );
    setFilteredImages(filtered);
  };

  const handleDownload = (image: Asset) => {
    if (image.url.includes('drive.google.com') || image.url.includes('drive.usercontent.google.com')) {
      window.location.href = image.url;
    } else {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.name || 'image';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="images-page">
        <div className="loading">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="images-page">
        <div className="error">{error}</div>
        <button onClick={loadImages} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="images-page">
      <div className="images-header">
        <h1>PIBIT.AI Images</h1>
        <p className="images-subtitle">Browse and search all brand images</p>
        <div className="images-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search images by name..." />
        </div>
        <p className="images-count">{filteredImages.length} Image{filteredImages.length !== 1 ? 's' : ''} found</p>
      </div>

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No images available yet.</p>
          <p>Add assets to the "Images" category to display them here.</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="empty-state">
          <p>No images found matching your search.</p>
        </div>
      ) : (
        <div className="images-grid">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="image-item" 
              onClick={() => handleDownload(image)}
              title={`${image.name} - Click to download`}
            >
              <div className="image-wrapper">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="image-content"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%239ca3af"%3E🖼️%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="image-info">
                <h4>{image.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="images-footer">
        <p>Click any image to download • All images are property of PIBIT.AI</p>
      </div>
    </div>
  );
};

export default ImagesPage;
