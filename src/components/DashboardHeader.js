import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventManager from './EventManager';
import './DashboardHeader.css';

const DashboardHeader = ({ contacts = [] }) => {
  const navigate = useNavigate();
  const [showEventManager, setShowEventManager] = useState(false);

  const events = [
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'Birthday',
      icon: '🎂',
      color: '#8b5cf6'
    },
    {
      id: 2,
      name: 'Michael Chen',
      type: 'Anniversary',
      icon: '🎉',
      color: '#ef4444'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      type: 'Referred by Patient',
      icon: '👤',
      color: '#6366f1'
    }
  ];

  return (
    <header className="dashboard-header">
      {/* Left - Logo */}
      <div className="header-left">
        <div className="header-logo">
          <img src="/logo.png" alt="CuraLink" className="logo-img" />
          <span className="logo-text">CuraLink</span>
        </div>
      </div>

      {/* Center - Events */}
      <div className="header-center">
        <div className="events-container">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-badge"
              style={{ backgroundColor: event.color }}
            >
              <span className="event-icon">{event.icon}</span>
              <span className="event-text">{event.name} • {event.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Actions */}
      <div className="header-right">
        <button 
          className="header-action-btn"
          onClick={() => setShowEventManager(true)}
          title="Event Manager"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <button 
          className="header-action-btn"
          onClick={() => navigate('/history')}
          title="Recent History"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <button 
          className="header-action-btn"
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Event Manager Modal */}
      <EventManager
        isOpen={showEventManager}
        onClose={() => setShowEventManager(false)}
        contacts={contacts}
      />
    </header>
  );
};

export default DashboardHeader;