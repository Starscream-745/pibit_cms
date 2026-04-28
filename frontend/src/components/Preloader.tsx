import React from 'react';
import '../styles/Preloader.css';

interface PreloaderProps {
  isLoading: boolean;
  fullScreen?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading, fullScreen = true }) => {
  return (
    <div className={`preloader-container ${!isLoading ? 'fade-out' : ''} ${fullScreen ? 'fullscreen' : 'inline'}`}>
      <div className="preloader-content">
        <div className="preloader-logo-wrapper">
          <img src="/logo.png" alt="PIBIT.AI" className="preloader-logo" />
        </div>
        <div className="loading-bar">
          <div className="loading-bar-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
