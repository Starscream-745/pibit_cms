import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssetForm from '../components/AssetForm';
import assetService from '../services/assetService';
import { Asset, CreateAssetDTO } from '../types/asset';
import Preloader from '../components/Preloader';

const EditAssetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAsset(id);
    }
  }, [id]);

  const loadAsset = async (assetId: string) => {
    try {
      const data = await assetService.getById(assetId);
      setAsset(data);
    } catch (err) {
      setError('Failed to load asset');
      console.error('Error loading asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateAssetDTO) => {
    if (!id) return;
    
    try {
      await assetService.update(id, data);
      navigate('/');
    } catch (error) {
      alert('Failed to update asset. Please try again.');
      console.error('Error updating asset:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ position: 'relative', height: '400px' }}>
          <Preloader isLoading={true} fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="page-container">
        <div className="error">{error || 'Asset not found'}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Assets
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AssetForm asset={asset} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default EditAssetPage;
