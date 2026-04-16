import React, { useState, useRef } from 'react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  onUploadSuccess: (downloadUrl: string, fileName: string) => void;
  onUploadError: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  allowedTypes?: 'all' | 'images' | 'videos' | 'documents';
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  accept,
  maxSize = 100, // Increased default to 100MB for videos
  allowedTypes = 'all',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine accept attribute based on allowedTypes
  const getAcceptAttribute = () => {
    if (accept) return accept;
    
    switch (allowedTypes) {
      case 'images':
        return 'image/*';
      case 'videos':
        return 'video/*';
      case 'documents':
        return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
      default:
        return 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      onUploadError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    if (!validateFileType(file)) {
      onUploadError(`File type not allowed. Please upload ${allowedTypes === 'all' ? 'images, videos, or documents' : allowedTypes}`);
      return;
    }

    // Generate preview for images and videos
    generatePreview(file);

    // Upload file
    await uploadFile(file);
  };

  const validateFileType = (file: File): boolean => {
    const fileType = file.type.toLowerCase();
    
    switch (allowedTypes) {
      case 'images':
        return fileType.startsWith('image/');
      case 'videos':
        return fileType.startsWith('video/');
      case 'documents':
        return fileType.includes('pdf') || 
               fileType.includes('document') || 
               fileType.includes('spreadsheet') ||
               fileType.includes('presentation');
      default:
        return true; // Allow all types
    }
  };

  const generatePreview = (file: File) => {
    const fileType = file.type.toLowerCase();
    
    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setPreviewType('image');
      };
      reader.readAsDataURL(file);
    } else if (fileType.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewType('video');
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const headers: HeadersInit = {};
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Call success callback with download URL
      onUploadSuccess(data.downloadUrl, data.fileName);

      // Reset after short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setPreviewUrl(null);
        setPreviewType(null);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
      setIsUploading(false);
      setUploadProgress(0);
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      {previewUrl && !isUploading && (
        <div className="file-preview">
          {previewType === 'image' && (
            <img src={previewUrl} alt="Preview" className="preview-image" />
          )}
          {previewType === 'video' && (
            <video src={previewUrl} controls className="preview-video" />
          )}
        </div>
      )}
      
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${
          isUploading ? 'uploading' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute()}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div className="upload-progress">
            <div className="upload-spinner"></div>
            <p>Uploading file...</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              {allowedTypes === 'images' && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {allowedTypes === 'videos' && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {allowedTypes === 'documents' && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {allowedTypes === 'all' && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p className="upload-text">
              <strong>Drag & drop</strong> your {allowedTypes === 'all' ? 'file' : allowedTypes} here
            </p>
            <p className="upload-subtext">or click to browse</p>
            <p className="upload-info">
              Max size: {maxSize}MB
              {allowedTypes !== 'all' && ` • ${allowedTypes} only`}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
