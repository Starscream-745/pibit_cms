import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssetForm from '../components/AssetForm';
import assetService from '../services/assetService';
import { CreateAssetDTO } from '../types/asset';
import { useToast } from '../contexts/ToastContext';

const CreateAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data: CreateAssetDTO) => {
    try {
      await assetService.create(data);
      toast.success('Asset created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create asset. Please try again.');
      console.error('Error creating asset:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <AssetForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateAssetPage;
