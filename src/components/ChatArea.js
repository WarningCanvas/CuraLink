import React from 'react';
import MessageTemplates from './MessageTemplates';
import './ChatArea.css';

const ChatArea = ({ selectedContact, onAISuggest }) => {
  if (!selectedContact) {
    return (
      <div className="message-area">
        <div className="no-contact-selected">
          <div className="no-contact-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Select a contact to prepare messages</h3>
          <p>Choose a contact from the sidebar to view and customize message templates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-area">
      <MessageTemplates 
        contact={selectedContact}
        onAISuggest={onAISuggest}
      />
    </div>
  );
};

export default ChatArea;