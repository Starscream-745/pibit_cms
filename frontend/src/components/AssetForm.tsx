import React, { useState, useEffect } from 'react';
import { Asset, CreateAssetDTO } from '../types/asset';
import FileUpload from './FileUpload';
import '../styles/AssetForm.css';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: CreateAssetDTO) => void;
  onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ asset, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateAssetDTO>({
    name: '',
    url: '',
    category: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        url: asset.url,
        category: asset.category,
        description: asset.description
      });
    }
  }, [asset]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSuccess = (downloadUrl: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      url: downloadUrl,
      name: prev.name || fileName.replace(/\.[^/.]+$/, ''), // Use filename as name if empty
    }));
    setUploadSuccess(`✓ File uploaded successfully: ${fileName}`);
    setTimeout(() => setUploadSuccess(''), 5000);
  };

  const handleUploadError = (error: string) => {
    setErrors(prev => ({
      ...prev,
      upload: error,
    }));
  };

  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <h2>{asset ? 'Edit Asset' : 'Create New Asset'}</h2>

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="Enter asset name"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="url">URL *</label>
        
        {/* Toggle between URL input and file upload */}
        <div className="url-mode-toggle">
          <button
            type="button"
            className={`toggle-btn ${uploadMode === 'url' ? 'active' : ''}`}
            onClick={() => setUploadMode('url')}
          >
            Enter URL
          </button>
          <button
            type="button"
            className={`toggle-btn ${uploadMode === 'upload' ? 'active' : ''}`}
            onClick={() => setUploadMode('upload')}
          >
            Upload File
          </button>
        </div>

        {uploadMode === 'url' ? (
          <>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={errors.url ? 'error' : ''}
              placeholder="https://example.com/asset"
            />
            {errors.url && <span className="error-message">{errors.url}</span>}
          </>
        ) : (
          <>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              allowedTypes="all"
              maxSize={200}
            />
            {uploadSuccess && (
              <div className="success-message">{uploadSuccess}</div>
            )}
            {errors.upload && (
              <span className="error-message">{errors.upload}</span>
            )}
            {formData.url && (
              <div className="uploaded-url">
                <small>✓ Uploaded URL: {formData.url}</small>
              </div>
            )}
          </>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? 'error' : ''}
          placeholder="e.g., Images, Documents, Videos"
        />
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter asset description (optional)"
        />
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (asset ? 'Update Asset' : 'Create Asset')}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
