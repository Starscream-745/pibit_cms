import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AssetPreview from './AssetPreview';
import Modal from './Modal';
import { ExternalLink, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/AssetCard.css';

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isAdmin = userRole === 'admin';

  const handleEdit = () => {
    navigate(`/edit/${asset.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(asset.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleOpen = () => {
    window.open(asset.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    try {
      setIsDownloading(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('authToken');
      
      const sessionId = localStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      if (!localStorage.getItem('sessionId')) {
        localStorage.setItem('sessionId', sessionId);
      }
      
      const headers: HeadersInit = {
        'X-Session-Id': sessionId
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      // Fire analytics in the background (fire-and-forget). 
      // Do not await this, to preserve the synchronous user-gesture for the browser!
      fetch(`${apiUrl}/api/assets/${asset.id}/download`, { headers }).catch(e => console.warn('Analytics tracking failed', e));
      
      // Check if this is a backend file
      const isMongoFile = asset.url.includes('/api/files/');
      
      if (isMongoFile) {
        const separator = asset.url.includes('?') ? '&' : '?';
        const downloadUrl = `${asset.url}${separator}download=true`;
        
        // Strip the domain to leverage the local Vite Proxy.
        // This makes it a SAME-ORIGIN request, strictly enforcing HTML5 local downloads.
        const relativeUrl = downloadUrl.replace(/^https?:\/\/[^\/]+/, '');
        
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

  return (
    <div className="asset-card">
      <AssetPreview 
        url={asset.url} 
        name={asset.name} 
        category={asset.category} 
      />
      <div className="asset-card-header">
        <h3 className="asset-name">{asset.name}</h3>
        <span className="asset-category">{asset.category}</span>
      </div>
      <div className="asset-card-body">
        <p className="asset-description">{asset.description || 'No description'}</p>
      </div>
      <div className="asset-card-actions">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen} 
          className="btn btn-action-ghost" 
          title="Open in new tab"
        >
          <ExternalLink size={16} />
          Open
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload} 
          className={`btn btn-action-ghost ${isDownloading ? 'downloading' : ''}`} 
          title="Download asset" 
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="spinner" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} />
              Download
            </>
          )}
        </motion.button>
      </div>
      {isAuthenticated && isAdmin && (
        <>
          <Modal
            isOpen={showDeleteConfirm}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Delete Asset"
            message={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
            confirmText="Delete"
            type="danger"
          />
          <div className="asset-card-footer">
            <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
            <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetCard;
