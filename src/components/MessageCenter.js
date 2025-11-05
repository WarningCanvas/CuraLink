import React, { useState, useEffect } from 'react';
import NewTemplateModal from './NewTemplateModal';
import databaseService from '../services/databaseService';
import './MessageCenter.css';

const MessageCenter = ({ selectedContact, onAISuggest }) => {
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load templates from database on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templates = await databaseService.getAllTemplates();
      console.log('Loaded templates:', templates);
      setMessages(templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Fallback to default templates if database fails
      setMessages([
        {
          id: 1,
          title: 'Appointment Reminder',
          content: 'Hi {ClientName}, this is a friendly reminder about your appointment scheduled for {Date} at {Time}. Please reply to confirm or let us know if you need to reschedule. Looking forward to seeing you!'
        },
        {
          id: 2,
          title: 'Follow-up Care',
          content: 'Hello {ClientName}, we hope you\'re doing well! This is a follow-up message regarding your recent visit. Please don\'t hesitate to reach out if you have any questions or concerns.'
        },
        {
          id: 3,
          title: 'Birthday Wishes',
          content: 'Happy Birthday, {ClientName}! 🎉 Wishing you a wonderful day filled with joy and celebration. Thank you for being a valued client. We hope this year brings you health and happiness!'
        },
        {
          id: 4,
          title: 'Welcome New Client',
          content: 'Welcome to {Organization}, {ClientName}! We\'re thrilled to have you with us. Our team is dedicated to providing you with exceptional care and service. Please feel free to reach out if you have any questions.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageToggle = (messageId) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleSendViaWhatsApp = () => {
    if (selectedMessages.size > 0 && selectedContact) {
      const selectedMessagesList = messages.filter(m => selectedMessages.has(m.id));
      const processedMessages = selectedMessagesList.map(message => {
        let content = message.content;
        content = content.replace(/{ClientName}/g, selectedContact.name);
        content = content.replace(/{Organization}/g, 'Smith Medical Clinic');
        content = content.replace(/{Date}/g, 'tomorrow');
        content = content.replace(/{Time}/g, '2:00 PM');
        return content;
      });

      const combinedMessage = processedMessages.join('\n\n');
      // Use the full phone number with country code if available
      let phoneNumber = selectedContact.phone || '919876543210';
      
      // If phone doesn't start with country code, add India's code
      if (phoneNumber && !phoneNumber.startsWith('+') && phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }
      
      // Remove any + or spaces for WhatsApp URL
      phoneNumber = phoneNumber.replace(/[\+\s-]/g, '');
      const encodedMessage = encodeURIComponent(combinedMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      setSelectedMessages(new Set());
    }
  };

  const processMessageContent = (content) => {
    if (!selectedContact) return content;
    return content
      .replace(/{ClientName}/g, selectedContact.name)
      .replace(/{Organization}/g, 'Smith Medical Clinic')
      .replace(/{Date}/g, '(Date)')
      .replace(/{Time}/g, '(Time)');
  };

  const handleNewTemplate = () => {
    setShowNewTemplateModal(true);
  };

  const handleSaveTemplate = async (newTemplate) => {
    try {
      console.log('Saving template:', newTemplate);
      const savedTemplate = await databaseService.createTemplate(newTemplate);
      console.log('Template saved:', savedTemplate);
      
      // Add to local state
      setMessages(prevMessages => [...prevMessages, savedTemplate]);
      setShowNewTemplateModal(false);
    } catch (error) {
      console.error('Failed to save template:', error);
      // Fallback to local state only
      const templateWithId = {
        ...newTemplate,
        id: Date.now().toString()
      };
      setMessages(prevMessages => [...prevMessages, templateWithId]);
      setShowNewTemplateModal(false);
    }
  };

  return (
    <div className="message-center">
      {/* Header */}
      <div className="message-center-header">
        <div className="header-content">
          <h2>Pre-defined Messages</h2>
          <p>Select messages to send to {selectedContact?.name || 'selected contact'}</p>
        </div>
        
        <button className="new-template-btn" onClick={handleNewTemplate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          New Template
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading templates...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <p>No templates found. Create your first template!</p>
          </div>
        ) : (
          messages.map(message => (
          <div
            key={message.id}
            className={`message-card ${selectedMessages.has(message.id) ? 'selected' : ''}`}
          >
            <div className="message-card-header">
              <div className="message-checkbox-container">
                <input
                  type="checkbox"
                  id={`message-${message.id}`}
                  checked={selectedMessages.has(message.id)}
                  onChange={() => handleMessageToggle(message.id)}
                  className="message-checkbox"
                />
                <label htmlFor={`message-${message.id}`} className="checkbox-label">
                  <span className="checkmark"></span>
                </label>
              </div>
              
              <div className="message-title-section">
                <h3>{message.title}</h3>
                <div className="message-actions">
                  <button className="message-action-btn" title="View">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="message-action-btn" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="message-content">
              {processMessageContent(message.content)}
            </div>
          </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="message-center-footer">
        <button className="ai-suggest-btn" onClick={onAISuggest}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          AI Suggest
        </button>
        
        <button 
          className="send-whatsapp-btn"
          onClick={handleSendViaWhatsApp}
          disabled={selectedMessages.size === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
            <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Send via WhatsApp
        </button>
      </div>

      {/* New Template Modal */}
      <NewTemplateModal
        isOpen={showNewTemplateModal}
        onClose={() => setShowNewTemplateModal(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default MessageCenter;