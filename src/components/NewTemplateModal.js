import React, { useState } from 'react';
import './NewTemplateModal.css';

const NewTemplateModal = ({ isOpen, onClose, onSave }) => {
  const [templateTitle, setTemplateTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [category, setCategory] = useState('general');

  const placeholders = [
    { name: 'ClientName', label: '{ClientName}' },
    { name: 'Date', label: '{Date}' },
    { name: 'Time', label: '{Time}' },
    { name: 'Organization', label: '{Organization}' },
    { name: 'DoctorName', label: '{DoctorName}' }
  ];

  const handleSave = () => {
    if (templateTitle.trim() && messageContent.trim()) {
      const newTemplate = {
        title: templateTitle.trim(),
        content: messageContent.trim(),
        category: category,
        variables: extractVariables(messageContent)
      };
      onSave(newTemplate);
      handleClose();
    }
  };

  const handleClose = () => {
    setTemplateTitle('');
    setMessageContent('');
    setCategory('general');
    onClose();
  };

  const insertPlaceholder = (placeholder) => {
    const textarea = document.getElementById('message-content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = messageContent;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newContent = before + placeholder + after;
    setMessageContent(newContent);
    
    // Set cursor position after the inserted placeholder
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 0);
  };

  const extractVariables = (content) => {
    const matches = content.match(/{[^}]+}/g);
    return matches ? [...new Set(matches.map(match => match.slice(1, -1)))] : [];
  };

  const formatText = (type) => {
    const textarea = document.getElementById('message-content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = messageContent.substring(start, end);
    
    if (selectedText) {
      let formattedText = selectedText;
      switch (type) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `_${selectedText}_`;
          break;
        default:
          break;
      }
      
      const before = messageContent.substring(0, start);
      const after = messageContent.substring(end);
      setMessageContent(before + formattedText + after);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="new-template-modal">
        <div className="modal-header">
          <h2>Create New Template</h2>
          <p>Create a new message template with custom placeholders</p>
          <button className="close-btn" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="template-title">Template Title</label>
            <input
              id="template-title"
              type="text"
              placeholder="e.g. Appointment Reminder"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="template-title-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message-content">Message Content</label>
            <div className="message-editor">
              <div className="editor-toolbar">
                <button 
                  type="button" 
                  className="toolbar-btn"
                  onClick={() => formatText('bold')}
                  title="Bold"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="toolbar-btn"
                  onClick={() => formatText('italic')}
                  title="Italic"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="2"/>
                    <line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="toolbar-btn"
                  onClick={() => formatText('underline')}
                  title="Underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4" y1="21" x2="20" y2="21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <div className="toolbar-divider"></div>
                <button 
                  type="button" 
                  className="toolbar-btn insert-btn"
                  onClick={() => insertPlaceholder('{ClientName}')}
                  title="Insert Client Name"
                >
                  Insert {'{ClientName}'}
                </button>
              </div>
              
              <textarea
                id="message-content-textarea"
                placeholder="Type your message template here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="message-content-textarea"
                rows="6"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Quick Placeholders:</label>
            <div className="placeholders-grid">
              {placeholders.map((placeholder) => (
                <button
                  key={placeholder.name}
                  type="button"
                  className="placeholder-btn"
                  onClick={() => insertPlaceholder(placeholder.label)}
                >
                  + {placeholder.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={!templateTitle.trim() || !messageContent.trim()}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTemplateModal;