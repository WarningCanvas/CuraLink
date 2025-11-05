import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessageHistory.css';

const MessageHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const messages = [
    {
      id: 1,
      contact: 'Sarah Johnson',
      preview: 'Hi Sarah, this is a friendly reminder about your appointment...',
      dateTime: '2025-11-02 10:30 AM'
    },
    {
      id: 2,
      contact: 'Michael Chen',
      preview: 'Happy Birthday, Michael! 🎉 Wishing you a wonderful day...',
      dateTime: '2025-11-02 09:15 AM'
    },
    {
      id: 3,
      contact: 'Emily Rodriguez',
      preview: 'Hello Emily, we hope you\'re doing well! This is a follow-up...',
      dateTime: '2025-11-01 04:20 PM'
    },
    {
      id: 4,
      contact: 'David Thompson',
      preview: 'Welcome to Smith Medical Clinic, David! We\'re thrilled...',
      dateTime: '2025-11-01 02:45 PM'
    },
    {
      id: 5,
      contact: 'Lisa Anderson',
      preview: 'Hi Lisa, we\'d love to hear about your recent experience...',
      dateTime: '2025-11-01 11:00 AM'
    },
    {
      id: 6,
      contact: 'James Wilson',
      preview: 'Hi James, this is a friendly reminder about your appointment...',
      dateTime: '2025-10-31 03:30 PM'
    },
    {
      id: 7,
      contact: 'Maria Garcia',
      preview: 'Hello Maria, we hope you\'re doing well! This is a follow-up...',
      dateTime: '2025-10-31 01:15 PM'
    },
    {
      id: 8,
      contact: 'Robert Taylor',
      preview: 'Hi Robert, we\'d love to hear about your recent experience...',
      dateTime: '2025-10-30 10:00 AM'
    }
  ];

  const handleBack = () => {
    navigate('/');
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="message-history-page">
      <div className="history-header">
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

      <div className="history-content">
        <div className="page-header">
          <div className="header-left-content">
            <h1>Message History</h1>
            <p>View all sent messages and their status</p>
          </div>
          
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="messages-table">
          <div className="table-header">
            <div className="header-cell contact-col">Contact</div>
            <div className="header-cell preview-col">Message Preview</div>
            <div className="header-cell datetime-col">Date & Time</div>
          </div>

          <div className="table-body">
            {filteredMessages.map(message => (
              <div key={message.id} className="table-row">
                <div className="table-cell contact-cell">
                  <div className="contact-info">
                    <div className="contact-avatar">
                      {message.contact.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="contact-name">{message.contact}</span>
                  </div>
                </div>
                
                <div className="table-cell preview-cell">
                  {message.preview}
                </div>
                
                <div className="table-cell datetime-cell">
                  {message.dateTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredMessages.length === 0 && (
          <div className="no-messages">
            <div className="no-messages-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>No messages found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHistory;