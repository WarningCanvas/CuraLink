import React, { useState } from 'react';
import { countries, defaultCountry } from '../data/countries';
import './NewContactModal.css';

const NewContactModal = ({ isOpen, onClose, onSave }) => {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrganization, setContactOrganization] = useState('');
  const [contactStatus, setContactStatus] = useState('Active');
  const [contactType, setContactType] = useState('patient');
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const handleSave = () => {
    if (contactName.trim() && contactPhone.trim() && validatePhoneNumber(contactPhone)) {
      const newContact = {
        name: contactName.trim(),
        phone: selectedCountry.code + contactPhone.replace(/\D/g, ''), // Store with country code
        email: contactEmail.trim(),
        organization: contactOrganization.trim(),
        status: contactStatus,
        type: contactType,
        countryCode: selectedCountry.code,
        initials: generateInitials(contactName.trim())
      };
      onSave(newContact);
      handleClose();
    }
  };

  const handleClose = () => {
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactOrganization('');
    setContactStatus('Active');
    setContactType('patient');
    setSelectedCountry(defaultCountry);
    setShowCountryDropdown(false);
    onClose();
  };

  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits for Indian phone numbers
    const limitedDigits = digits.slice(0, 10);
    
    // Format as XXXXX XXXXX (Indian format)
    if (limitedDigits.length >= 6) {
      return `${limitedDigits.slice(0, 5)} ${limitedDigits.slice(5)}`;
    } else if (limitedDigits.length > 0) {
      return limitedDigits;
    }
    return '';
  };

  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 && /^[6-9]/.test(digits); // Indian mobile numbers start with 6-9
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContactPhone(formatted);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };

    if (showCountryDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCountryDropdown]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="new-contact-modal">
        <div className="modal-header">
          <h2>Add New Contact</h2>
          <p>Create a new contact for your messaging list</p>
          <button className="close-btn" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">Full Name *</label>
              <input
                id="contact-name"
                type="text"
                placeholder="e.g. John Smith"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="contact-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-phone">Phone Number *</label>
              <div className="phone-input-container">
                <div className="country-dropdown">
                  <button
                    type="button"
                    className="country-selector"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="country-flag">{selectedCountry.flag}</span>
                    <span className="country-code">{selectedCountry.code}</span>
                    <svg 
                      className={`dropdown-arrow ${showCountryDropdown ? 'open' : ''}`}
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="country-dropdown-menu">
                      <div className="country-search">
                        <input
                          type="text"
                          placeholder="Search countries..."
                          className="country-search-input"
                          onChange={(e) => {
                            // Filter countries based on search
                            const searchTerm = e.target.value.toLowerCase();
                            // You can implement search filtering here if needed
                          }}
                        />
                      </div>
                      <div className="country-options">
                        {countries.map((country) => (
                          <div
                            key={country.iso}
                            className={`country-option ${selectedCountry.iso === country.iso ? 'selected' : ''}`}
                            onClick={() => handleCountrySelect(country)}
                          >
                            <span className="country-flag">{country.flag}</span>
                            <span className="country-name">{country.name}</span>
                            <span className="country-code">{country.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="98765 43210"
                  value={contactPhone}
                  onChange={handlePhoneChange}
                  className={`contact-input phone-number-input ${contactPhone && !validatePhoneNumber(contactPhone) ? 'error' : ''}`}
                  maxLength="11"
                />
              </div>
              {contactPhone && !validatePhoneNumber(contactPhone) && (
                <div className="input-error">
                  Please enter a valid 10-digit mobile number (starting with 6-9 for India)
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                placeholder="john.smith@email.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="contact-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-organization">Organization</label>
              <input
                id="contact-organization"
                type="text"
                placeholder="e.g. ABC Company"
                value={contactOrganization}
                onChange={(e) => setContactOrganization(e.target.value)}
                className="contact-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="contact-status">Status</label>
              <select
                id="contact-status"
                value={contactStatus}
                onChange={(e) => setContactStatus(e.target.value)}
                className="contact-select"
              >
                <option value="Active">Active</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <div className="form-group half-width">
              <label htmlFor="contact-type">Type</label>
              <select
                id="contact-type"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="contact-select"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          {contactName && (
            <div className="contact-preview">
              <h4>Preview:</h4>
              <div className="preview-contact-item">
                <div className="preview-avatar">
                  <span className="preview-initials">{generateInitials(contactName)}</span>
                  <div className="preview-status-dot" style={{ 
                    backgroundColor: contactStatus === 'Active' ? '#10b981' : 
                                   contactStatus === 'Patient' ? '#6366f1' : '#f59e0b' 
                  }} />
                </div>
                <div className="preview-info">
                  <div className="preview-name">{contactName}</div>
                  <div className="preview-status" style={{ 
                    color: contactStatus === 'Active' ? '#10b981' : 
                           contactStatus === 'Patient' ? '#6366f1' : '#f59e0b' 
                  }}>
                    {contactStatus}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={!contactName.trim() || !contactPhone.trim() || !validatePhoneNumber(contactPhone)}
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewContactModal;