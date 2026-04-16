import React from 'react';
import '../styles/LoadingSkeleton.css';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'circle';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-badge"></div>
            </div>
            <div className="skeleton-body">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-list-item">
            <div className="skeleton-circle"></div>
            <div className="skeleton-list-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="skeleton-text">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-line"></div>
        ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className="skeleton-circles">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-circle"></div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
