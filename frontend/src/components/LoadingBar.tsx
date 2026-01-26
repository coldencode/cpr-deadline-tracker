import React from 'react';
import './LoadingBar.css';

const LoadingBar: React.FC = () => {
  return (
    <div className="loading-bar-container">
      <div className="loading-text">Calculating deadline...</div>
      <div className="loading-bar-wrapper">
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default LoadingBar;
