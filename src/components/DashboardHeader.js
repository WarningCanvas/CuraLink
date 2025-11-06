import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventManager from './EventManager';
import databaseService from '../services/databaseService';
import './DashboardHeader.css';

const DashboardHeader = ({ contacts = [] }) => {
  const navigate = useNavigate();
  const [showEventManager, setShowEventManager] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load upcoming events from database
  useEffect(() => {
    loadUpcomingEvents();
    
    // Set up interval to refresh events every 5 minutes
    const interval = setInterval(loadUpcomingEvents, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      setLoading(true);
      // Get events for tomorrow (next 1 day)
      const events = await databaseService.getUpcomingEvents(1);
      
      // Format events for display and limit to top 3
      const formattedEvents = events.slice(0, 3).map(event => ({
        id: event.id,
        name: event.contact_name,
        type: formatEventType(event.event_type),
        icon: getEventIcon(event.event_type),
        color: event.color || getEventColor(event.event_type),
        time: event.event_time,
        date: event.event_date
      }));
      
      setUpcomingEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to load upcoming events:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatEventType = (type) => {
    const typeMap = {
      'appointment': 'Appointment',
      'birthday': 'Birthday',
      'anniversary': 'Anniversary',
      'follow-up': 'Follow-up',
      'consultation': 'Consultation',
      'reminder': 'Reminder'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getEventIcon = (type) => {
    const iconMap = {
      'appointment': '📅',
      'birthday': '🎂',
      'anniversary': '🎉',
      'follow-up': '📋',
      'consultation': '👨‍⚕️',
      'reminder': '⏰'
    };
    return iconMap[type] || '📅';
  };

  const getEventColor = (type) => {
    const colorMap = {
      'appointment': '#10b981',
      'birthday': '#8b5cf6',
      'anniversary': '#06b6d4',
      'follow-up': '#f59e0b',
      'consultation': '#ef4444',
      'reminder': '#6366f1'
    };
    return colorMap[type] || '#6366f1';
  };

  // Refresh events when EventManager closes (in case new events were added)
  const handleEventManagerClose = () => {
    setShowEventManager(false);
    loadUpcomingEvents();
  };

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
          {loading ? (
            <div className="events-loading">
              <span>Loading events...</span>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="no-events">
              <span>No upcoming events</span>
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className="event-badge"
                style={{ backgroundColor: event.color }}
                title={`${event.name} - ${event.type} at ${event.time}`}
              >
                <span className="event-icon">{event.icon}</span>
                <span className="event-text">{event.name} • {event.type}</span>
              </div>
            ))
          )}
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
        onClose={handleEventManagerClose}
        contacts={contacts}
      />
    </header>
  );
};

export default DashboardHeader;