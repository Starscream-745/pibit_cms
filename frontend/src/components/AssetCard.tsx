import React, { useState, useRef } from 'react';
import { Asset } from '../types/asset';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import { ExternalLink, Download, Loader2, Pencil, Trash2, FileText, FileSpreadsheet, Video, Music, FileArchive, File, Image } from 'lucide-react';
import '../styles/AssetCard.css';

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

// Returns color + icon config by file type
const getFileTypeConfig = (url: string, category: string) => {
  const u = url.toLowerCase();
  const c = category.toLowerCase();

  if (u.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)/) || c.includes('image') || c.includes('logo') || c.includes('photo') || c.includes('iconography')) {
    return { color: '#2F6BFE', gradient: 'linear-gradient(135deg, #2F6BFE22, #60a5fa11)', label: 'IMAGE', Icon: Image, isImage: true };
  }
  if (u.includes('.pdf') || c.includes('pdf')) {
    return { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef444422, #f8717111)', label: 'PDF', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(doc|docx)/) || c.includes('document')) {
    return { color: '#2563eb', gradient: 'linear-gradient(135deg, #2563eb22, #60a5fa11)', label: 'DOC', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(xls|xlsx|csv)/) || c.includes('spreadsheet') || c.includes('excel')) {
    return { color: '#16a34a', gradient: 'linear-gradient(135deg, #16a34a22, #4ade8011)', label: 'XLS', Icon: FileSpreadsheet, isImage: false };
  }
  if (u.match(/\.(ppt|pptx)/) || c.includes('presentation') || c.includes('pitch')) {
    return { color: '#f97316', gradient: 'linear-gradient(135deg, #f9731622, #fdba7411)', label: 'PPT', Icon: FileText, isImage: false };
  }
  if (u.match(/\.(mp4|mov|avi|webm)/) || c.includes('video')) {
    return { color: '#9333ea', gradient: 'linear-gradient(135deg, #9333ea22, #c084fc11)', label: 'VIDEO', Icon: Video, isImage: false };
  }
  if (u.match(/\.(mp3|wav|aac)/) || c.includes('audio')) {
    return { color: '#ea580c', gradient: 'linear-gradient(135deg, #ea580c22, #fb923c11)', label: 'AUDIO', Icon: Music, isImage: false };
  }
  if (u.match(/\.(zip|rar|7z)/) || c.includes('archive')) {
    return { color: '#ca8a04', gradient: 'linear-gradient(135deg, #ca8a0422, #fbbf2411)', label: 'ZIP', Icon: FileArchive, isImage: false };
  }
  return { color: '#6b7280', gradient: 'linear-gradient(135deg, #6b728022, #9ca3af11)', label: 'FILE', Icon: File, isImage: false };
};

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === 'admin';
  const fileConfig = getFileTypeConfig(asset.url, asset.category);

  // Magnetic tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(${fileConfig.color.replace('#','').match(/.{2}/g)?.map(h=>parseInt(h,16)).join(',')}, 0.18)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    card.style.boxShadow = '';
  };

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
      <div
        ref={cardRef}
        className="asset-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ '--card-color': fileConfig.color, '--card-gradient': fileConfig.gradient } as React.CSSProperties}
      >
        {/* Shine sweep overlay */}
        <div className="card-shine" />

        {/* Preview Area */}
        <div className="asset-preview-area">
          {showImage ? (
            <>
              {!imageLoaded && <div className="preview-skeleton" />}
              <img
                src={asset.url}
                alt={asset.name}
                loading="lazy"
                className={`preview-img ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div
              className="preview-icon-wrap"
              data-label={fileConfig.label}
              style={{ background: fileConfig.gradient, color: fileConfig.color }}
            >
              <fileConfig.Icon size={40} style={{ color: fileConfig.color }} />
              <span className="preview-label" style={{ color: fileConfig.color }}>{fileConfig.label}</span>
            </div>
          )}

          {/* Floating category badge */}
          <span className="asset-category-badge" style={{ background: fileConfig.color }}>
            {asset.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="asset-card-body">
          <h3 className="asset-name">{asset.name}</h3>
          {asset.description && asset.description !== 'No description' && (
            <p className="asset-description">{asset.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="asset-card-actions">
          <button onClick={handleOpen} className="action-btn action-btn-open">
            <ExternalLink size={15} />
            Open
          </button>
          <button
            onClick={handleDownload}
            className={`action-btn action-btn-download ${isDownloading ? 'loading' : ''}`}
            disabled={isDownloading}
            style={{ '--btn-color': fileConfig.color } as React.CSSProperties}
          >
            {isDownloading ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>

        {/* Admin footer */}
        {isAuthenticated && isAdmin && (
          <div className="asset-card-admin">
            <button onClick={handleEdit} className="admin-btn">
              <Pencil size={14} /> Edit
            </button>
            <button onClick={handleDeleteClick} className="admin-btn admin-btn-danger">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetCard;
