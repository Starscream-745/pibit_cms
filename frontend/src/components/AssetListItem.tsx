import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import { ExternalLink, Download, Loader2, Pencil, Trash2, FileText, FileSpreadsheet, Video, Music, FileArchive, File, Image } from 'lucide-react';
import '../styles/AssetListItem.css';

interface AssetListItemProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

const getFileTypeConfig = (url: string, category: string) => {
  const u = url.toLowerCase();
  const c = category.toLowerCase();

  if (u.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)/) || c.includes('image') || c.includes('logo') || c.includes('photo') || c.includes('iconography')) {
    return { color: '#2F6BFE', label: 'IMAGE', Icon: Image, isImage: true };
  }
  if (u.includes('.pdf') || c.includes('pdf')) {
    return { color: '#ef4444', label: 'PDF', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(doc|docx)/) || c.includes('document')) {
    return { color: '#2563eb', label: 'DOC', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(xls|xlsx|csv)/) || c.includes('spreadsheet') || c.includes('excel')) {
    return { color: '#16a34a', label: 'XLS', Icon: FileSpreadsheet, isImage: false };
  }
  if (u.match(/\.(ppt|pptx)/) || c.includes('presentation') || c.includes('pitch')) {
    return { color: '#f97316', label: 'PPT', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(mp4|mov|avi|webm)/) || c.includes('video')) {
    return { color: '#9333ea', label: 'VIDEO', Icon: Video, isImage: false };
  }
  if (u.match(/\.(mp3|wav|aac)/) || c.includes('audio')) {
    return { color: '#ea580c', label: 'AUDIO', Icon: Music, isImage: false };
  }
  if (u.match(/\.(zip|rar|7z)/) || c.includes('archive')) {
    return { color: '#ca8a04', label: 'ZIP', Icon: FileArchive, isImage: false };
  }
  return { color: '#6b7280', label: 'FILE', Icon: File, isImage: false };
};

const AssetListItem: React.FC<AssetListItemProps> = ({ asset, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAdmin = userRole === 'admin';
  const fileConfig = getFileTypeConfig(asset.url, asset.category);

  const handleEdit = () => navigate(`/edit/${asset.id}`);
  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => { onDelete(asset.id); setShowDeleteConfirm(false); };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleOpen = () => window.open(asset.url, '_blank', 'noopener,noreferrer');

  const handleDownload = () => {
    try {
      setIsDownloading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('authToken');
      const sessionId = localStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      if (!localStorage.getItem('sessionId')) localStorage.setItem('sessionId', sessionId);
      const headers: HeadersInit = { 'X-Session-Id': sessionId };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch(`${apiUrl}/api/assets/${asset.id}/download`, { headers }).catch(e => console.warn('Analytics tracking failed', e));

      const isMongoFile = asset.url.includes('/api/files/');
      if (isMongoFile) {
        const separator = asset.url.includes('?') ? '&' : '?';
        const downloadUrl = `${asset.url}${separator}download=true`;
        const relativeUrl = downloadUrl.replace(/^https?:\/\/[^/]+/, '');
        const link = document.createElement('a');
        link.href = relativeUrl;
        link.download = asset.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (asset.url.includes('drive.google.com') || asset.url.includes('drive.usercontent.google.com')) {
        window.location.href = asset.url;
      } else {
        const link = document.createElement('a');
        link.href = asset.url;
        link.download = asset.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      window.location.href = asset.url;
    }
  };

  const showImage = fileConfig.isImage && !imageError;
  const formattedDate = new Date(asset.updatedAt || asset.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <>
      {isAuthenticated && isAdmin && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Asset"
          message={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />
      )}
      <div className="asset-list-item">
        <div className="list-item-main">
          <div className="list-item-icon" style={{ color: fileConfig.color }}>
            {showImage ? (
              <img src={asset.url} alt={asset.name} onError={() => setImageError(true)} className="list-item-thumbnail" />
            ) : (
              <fileConfig.Icon size={24} />
            )}
          </div>
          <div className="list-item-name-group">
            <h3 className="list-item-name">{asset.name}</h3>
            {asset.description && asset.description !== 'No description' && (
              <span className="list-item-desc">{asset.description}</span>
            )}
          </div>
        </div>
        
        <div className="list-item-category">
          <span className="list-category-badge" style={{ background: fileConfig.color }}>{asset.category}</span>
        </div>
        
        <div className="list-item-date">
          {formattedDate}
        </div>
        
        <div className="list-item-actions">
          {asset.category !== 'Pitch Decks' && (
            <button onClick={handleOpen} className="list-btn" title="Open">
              <ExternalLink size={16} />
            </button>
          )}
          <button onClick={handleDownload} className="list-btn list-btn-download" disabled={isDownloading} title="Download">
            {isDownloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
          </button>
          
          {isAuthenticated && isAdmin && (
            <>
              <div className="list-divider"></div>
              <button onClick={handleEdit} className="list-btn" title="Edit">
                <Pencil size={16} />
              </button>
              <button onClick={handleDeleteClick} className="list-btn list-btn-danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetListItem;
