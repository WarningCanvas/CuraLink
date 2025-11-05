import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <img src="/logo.png" alt="CuraLink Logo" className="splash-logo-img" />
        </div>
        
        <h1 className="splash-title">CuraLink</h1>
        <p className="splash-subtitle">Professional Client Messaging Platform</p>
        
        <div className="splash-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;