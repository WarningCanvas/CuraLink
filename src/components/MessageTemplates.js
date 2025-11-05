import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import './MessageTemplates.css';

const MessageTemplates = ({ contact, onAISuggest }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  const [templates] = useState([
    {
      id: 1,
      title: 'Appointment Reminder',
      content: `Hi {ClientName}, this is a friendly reminder about your appointment scheduled for {Date} at {Time}. Please reply to confirm or let us know if you need to reschedule. Looking forward to seeing you!`,
      category: 'appointment'
    },
    {
      id: 2,
      title: 'Follow-up Care',
      content: `Hello {ClientName}, we hope you're doing well! This is a follow-up message regarding your recent visit. Please don't hesitate to reach out if you have any questions or concerns.`,
      category: 'followup'
    },
    {
      id: 3,
      title: 'Birthday Wishes',
      content: `Happy Birthday, {ClientName}! 🎉 Wishing you a wonderful day filled with joy and celebration. Thank you for being a valued client. We hope this year brings you health and happiness!`,
      category: 'birthday'
    },
    {
      id: 4,
      title: 'Welcome New Client',
      content: `Welcome to {Organization}, {ClientName}! We're thrilled to have you with us. Our team is dedicated to providing you with exceptional care and service. Please feel free to reach out if you have any questions.`,
      category: 'welcome'
    }
  ]);

  const processTemplate = (template) => {
    let processedContent = template.content;
    processedContent = processedContent.replace(/{ClientName}/g, contact.name);
    processedContent = processedContent.replace(/{Organization}/g, 'Smith Medical Clinic');
    processedContent = processedContent.replace(/{Date}/g, 'tomorrow');
    processedContent = processedContent.replace(/{Time}/g, '2:00 PM');
    return processedContent;
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomMessage(processTemplate(template));
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setSelectedTemplate(template);
    setCustomMessage(processTemplate(template));
  };

  const handleSendViaWhatsApp = () => {
    if (customMessage.trim() && contact) {
      // Format phone number
      const phoneNumber = contact.phone || '1234567890';
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(customMessage);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp Web
      window.open(whatsappUrl, '_blank');
      
      console.log('Opening WhatsApp with message for', contact.name);
    }
  };

  const handleAISuggest = () => {
    if (onAISuggest) {
      onAISuggest(customMessage);
    }
  };

  return (
    <div className="message-templates">
      <div className="templates-header">
        <div className="header-content">
          <h2>Pre-defined Messages</h2>
          <p>Select and customize messages to send to {contact.name}</p>
        </div>
        
        <div className="header-actions">
          <button className="new-template-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            New Template
          </button>
        </div>
      </div>

      <div className="templates-content">
        <div className="templates-list-section">
          <h3>Available Templates</h3>
          <div className="templates-grid">
            {templates.map(template => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="template-card-header">
                  <h4>{template.title}</h4>
                  <div className="template-actions">
                    <button 
                      className="template-action-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template);
                      }}
                      title="Edit Template"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="template-preview">
                  {processTemplate(template).substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="message-editor-section">
          <div className="editor-header">
            <h3>
              {editingTemplate ? `Editing: ${editingTemplate.title}` : 
               selectedTemplate ? selectedTemplate.title : 'Custom Message'}
            </h3>
          </div>
          
          <div className="message-editor">
            <RichTextEditor
              value={customMessage}
              onChange={setCustomMessage}
              placeholder={`Compose your message to ${contact.name}...`}
            />
          </div>

          <div className="editor-actions">
            <button 
              className="ai-suggest-btn"
              onClick={handleAISuggest}
            >
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
              disabled={!customMessage.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplates;