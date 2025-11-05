import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation for demo
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo Section */}
        <div className="logo-section">
          <img src="/logo.png" alt="CuraLink Logo" className="logo-image" />
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h1 className="app-title">CuraLink</h1>
          <p className="app-subtitle">Professional Client Messaging Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <a href="#" className="forgot-password">
            Forgot your password?
          </a>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 CuraLink. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;