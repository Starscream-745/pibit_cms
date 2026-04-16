import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AssetPreview from './AssetPreview';
import '../styles/AssetCard.css';

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        <button onClick={handleOpen} className="btn btn-open-full" title="Open in new tab">
          Open
        </button>
      </div>
      {isAuthenticated && isAdmin && (
        <>
          {showDeleteConfirm ? (
            <div className="asset-card-footer delete-confirm">
              <p className="delete-confirm-text">Delete "{asset.name}"?</p>
              <div className="delete-confirm-actions">
                <button onClick={handleConfirmDelete} className="btn btn-danger-small">
                  Yes, Delete
                </button>
                <button onClick={handleCancelDelete} className="btn btn-secondary-small">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="asset-card-footer">
              <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
              <button onClick={handleDeleteClick} className="btn btn-danger">Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssetCard;
