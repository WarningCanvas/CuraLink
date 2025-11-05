import React, { useState } from 'react';
import './EventsBar.css';

const EventsBar = () => {
  const [events] = useState([
    {
      id: 1,
      type: 'birthday',
      contact: 'Sarah Johnson',
      title: 'Birthday',
      date: 'Today',
      icon: '🎂',
      color: '#f59e0b'
    },
    {
      id: 2,
      type: 'anniversary',
      contact: 'Michael Chen',
      title: 'Anniversary',
      date: 'Tomorrow',
      icon: '🎉',
      color: '#ef4444'
    },
    {
      id: 3,
      type: 'referral',
      contact: 'Emily Rodriguez',
      title: 'Referred by Patient',
      date: '2 days ago',
      icon: '👤',
      color: '#6366f1'
    },
    {
      id: 4,
      type: 'appointment',
      contact: 'David Thompson',
      title: 'Follow-up Due',
      date: 'This week',
      icon: '📅',
      color: '#10b981'
    }
  ]);

  return (
    <div className="events-bar">
      <div className="events-container">
        {events.map(event => (
          <div 
            key={event.id} 
            className="event-item"
            style={{ borderLeftColor: event.color }}
          >
            <div className="event-icon" style={{ backgroundColor: `${event.color}20` }}>
              <span style={{ color: event.color }}>{event.icon}</span>
            </div>
            
            <div className="event-details">
              <div className="event-header">
                <span className="event-contact">{event.contact}</span>
                <span className="event-date">{event.date}</span>
              </div>
              <div className="event-title">{event.title}</div>
            </div>
            
            <button className="event-action-btn" title="Send Message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsBar;