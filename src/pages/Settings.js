import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [profile, setProfile] = useState({
    fullName: 'Dr. Jane Smith',
    email: 'jane.smith@curalink.com',
    organization: 'Smith Medical Clinic'
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log('Settings saved');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          <div className="logo">
            <img src="/logo.png" alt="CuraLink" className="logo-img" />
            <span>CuraLink</span>
          </div>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-container">
          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
          </div>

          {/* Profile Information */}
          <div className="settings-section">
            <h2>Profile Information</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="organization">Organization / Clinic</label>
              <input
                type="text"
                id="organization"
                value={profile.organization}
                onChange={(e) => handleProfileChange('organization', e.target.value)}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="settings-section">
            <h2>Appearance</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Use dark theme across the application</p>
              </div>
              
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <label htmlFor="darkMode" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="settings-section">
            <h2>Security</h2>
            
            <div className="security-item">
              <button className="security-btn">
                <span>Change Password</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className="security-item">
              <button className="security-btn">
                <span>Two-Factor Authentication</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <h2>Notifications</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications via email</p>
              </div>
              
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <label htmlFor="emailNotifications" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Event Reminders</h3>
                <p>Get notified about birthdays and anniversaries</p>
              </div>
              
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="eventReminders"
                  checked={eventReminders}
                  onChange={(e) => setEventReminders(e.target.checked)}
                />
                <label htmlFor="eventReminders" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="settings-actions">
            <button className="save-changes-btn" onClick={handleSaveChanges}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;