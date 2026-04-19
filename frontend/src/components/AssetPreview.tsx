import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Video, Music, FileArchive, File } from 'lucide-react';
import '../styles/AssetPreview.css';

interface AssetPreviewProps {
  url: string;
  name: string;
  category: string;
}

const AssetPreview: React.FC<AssetPreviewProps> = ({ url, name, category }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine if URL is an image
  const isImage = () => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('image') ||
           category.toLowerCase().includes('image') ||
           category.toLowerCase().includes('logo') ||
           category.toLowerCase().includes('photo');
  };

  // Determine if URL is a video
  const isVideo = () => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.webm', '.mpeg', '.mpg'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('video') ||
           category.toLowerCase().includes('video');
  };

  // Get file type icon based on URL or category
  const getFileIcon = () => {
    const lowerUrl = url.toLowerCase();
    const lowerCategory = category.toLowerCase();

    // Documents
    if (lowerUrl.includes('.pdf') || lowerCategory.includes('pdf')) {
      return { 
        icon: (
          <FileText size={64} />
        ), 
        color: '#ef4444', 
        label: 'PDF' 
      };
    }
    if (lowerUrl.includes('.doc') || lowerCategory.includes('document')) {
      return { 
        icon: (
          <FileText size={64} />
        ), 
        color: '#2563eb', 
        label: 'DOC' 
      };
    }
    if (lowerUrl.includes('.xls') || lowerCategory.includes('spreadsheet')) {
      return { 
        icon: (
          <FileSpreadsheet size={64} />
        ), 
        color: '#16a34a', 
        label: 'XLS' 
      };
    }
    
    // Media
    if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerCategory.includes('video')) {
      return { 
        icon: (
          <Video size={64} />
        ), 
        color: '#9333ea', 
        label: 'VIDEO' 
      };
    }
    if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerCategory.includes('audio')) {
      return { 
        icon: (
          <Music size={64} />
        ), 
        color: '#ea580c', 
        label: 'AUDIO' 
      };
    }
    
    // Archives
    if (lowerUrl.includes('.zip') || lowerUrl.includes('.rar')) {
      return { 
        icon: (
          <FileArchive size={64} />
        ), 
        color: '#ca8a04', 
        label: 'ZIP' 
      };
    }

    // Default
    return { 
      icon: (
        <File size={64} />
      ), 
      color: '#6b7280', 
      label: 'FILE' 
    };
  };

  if (isImage() && !imageError) {
    return (
      <div className="asset-preview asset-preview-image">
        {!imageLoaded && (
          <div className="preview-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        <img
          src={url}
          alt={name}
          loading="lazy"
          className={`preview-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Show video preview
  if (isVideo()) {
    return (
      <div className="asset-preview asset-preview-video">
        <video
          src={url}
          className="preview-video"
          controls
          preload="none"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Show file icon for non-images or broken images
  const fileInfo = getFileIcon();
  
  return (
    <div className="asset-preview asset-preview-icon" style={{ borderColor: fileInfo.color }}>
      <div className="preview-icon" style={{ color: fileInfo.color }}>
        {fileInfo.icon}
      </div>
      <div className="preview-label" style={{ color: fileInfo.color }}>
        {fileInfo.label}
      </div>
    </div>
  );
};

export default AssetPreview;
