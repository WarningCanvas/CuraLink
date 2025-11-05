import React, { useState } from 'react';
import './AIModal.css';

const AIModal = ({ contact, onClose, onUseSuggestion }) => {
  const [suggestion, setSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate AI generation
  const generateSuggestion = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const suggestions = [
        `Hi ${contact.name}, we wanted to reach out and check in with you. Is there anything we can help you with today? Our team is always here to support you.`,
        `Hello ${contact.name}, thank you for being such a valued patient. We hope you're doing well! Please don't hesitate to reach out if you have any questions or concerns.`,
        `Hi ${contact.name}, this is a friendly follow-up regarding your recent visit. We hope everything is going well and wanted to see if you need any additional support.`,
        `Hello ${contact.name}, we appreciate your trust in our care. Is there anything specific you'd like to discuss or any questions we can help answer today?`
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setSuggestion(randomSuggestion);
      setIsGenerating(false);
    }, 1500);
  };

  // Generate initial suggestion when modal opens
  React.useEffect(() => {
    generateSuggestion();
  }, [contact]);

  const handleUseSuggestion = () => {
    onUseSuggestion(suggestion);
  };

  const handleRegenerate = () => {
    generateSuggestion();
  };

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <div className="ai-modal-header">
          <div className="ai-modal-title">
            <div className="ai-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span>AI-Generated Suggestion</span>
          </div>
          
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="ai-modal-content">
          <p className="ai-modal-description">
            Here's a personalized message suggestion based on the contact's profile
          </p>

          <div className="suggestion-container">
            {isGenerating ? (
              <div className="generating-state">
                <div className="loading-spinner"></div>
                <p>Generating personalized message...</p>
              </div>
            ) : (
              <div className="suggestion-text">
                {suggestion}
              </div>
            )}
          </div>
        </div>

        <div className="ai-modal-actions">
          <button 
            className="close-modal-btn" 
            onClick={onClose}
          >
            Close
          </button>
          
          <button 
            className="regenerate-btn" 
            onClick={handleRegenerate}
            disabled={isGenerating}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="1,20 1,14 7,14" stroke="currentColor" strokeWidth="2"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Regenerate Message
          </button>
          
          <button 
            className="use-suggestion-btn" 
            onClick={handleUseSuggestion}
            disabled={isGenerating || !suggestion}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Use Suggestion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;