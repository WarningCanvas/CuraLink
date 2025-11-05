import React, { useState, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const formatText = (command, value = null) => {
    setIsFormatting(true);
    document.execCommand(command, false, value);
    setIsFormatting(false);
    
    // Update the parent component with the new content
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (!isFormatting && onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key for line breaks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formatText('insertHTML', '<br><br>');
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
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
        </div>
        
        <div className="toolbar-separator"></div>
        
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => formatText('insertUnorderedList')}
            title="Bullet List"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => formatText('insertOrderedList')}
            title="Numbered List"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <line x1="10" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="10" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="10" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 6h1v4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 10h2" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div className="toolbar-separator"></div>
        
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => formatText('removeFormat')}
            title="Clear Formatting"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 7V4h16v3" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 20h6" stroke="currentColor" strokeWidth="2"/>
              <path d="M13 4L8 20" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 15l5 5" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 15l-5 5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;