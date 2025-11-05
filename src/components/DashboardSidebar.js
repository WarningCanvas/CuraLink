import React, { useState, useEffect } from 'react';
import NewContactModal from './NewContactModal';
import databaseService from '../services/databaseService';
import './DashboardSidebar.css';

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="custom-dropdown">
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardSidebar = ({ selectedContact, onContactSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Contacts');
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load contacts from database on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contactsData = await databaseService.getAllContacts();
      console.log('Loaded contacts:', contactsData);
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      // Fallback to default contacts if database fails
      setContacts([
        {
          id: '1',
          name: 'Sarah Johnson',
          initials: 'SJ',
          status: 'Active',
          type: 'patient',
          phone: '9876543210'
        },
        {
          id: '2',
          name: 'Michael Chen',
          initials: 'MC',
          status: 'Active',
          type: 'patient',
          phone: '8765432109'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          initials: 'ER',
          status: 'Patient',
          type: 'patient',
          phone: '7654321098'
        },
        {
          id: '4',
          name: 'David Thompson',
          initials: 'DT',
          status: 'Doctor',
          type: 'doctor',
          phone: '9123456789'
        },
        {
          id: '5',
          name: 'Lisa Anderson',
          initials: 'LA',
          status: 'Active',
          type: 'patient',
          phone: '8234567890'
        },
        {
          id: '6',
          name: 'James Wilson',
          initials: 'JW',
          status: 'Active',
          type: 'patient',
          phone: '7345678901'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All Contacts' || 
                         (selectedFilter === 'Active Patients' && contact.status === 'Active') ||
                         (selectedFilter === 'Referred by Doctor' && contact.type === 'doctor') ||
                         (selectedFilter === 'Referred by Patient' && contact.type === 'patient');
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Patient': return '#6366f1';
      case 'Doctor': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleNewContact = () => {
    setShowNewContactModal(true);
  };

  const handleSaveContact = async (newContact) => {
    try {
      console.log('Saving contact:', newContact);
      const savedContact = await databaseService.createContact(newContact);
      console.log('Contact saved:', savedContact);
      
      // Add to local state
      setContacts(prevContacts => [...prevContacts, savedContact]);
      setShowNewContactModal(false);
    } catch (error) {
      console.error('Failed to save contact:', error);
      // Fallback to local state only
      const contactWithId = {
        ...newContact,
        id: Date.now().toString()
      };
      setContacts(prevContacts => [...prevContacts, contactWithId]);
      setShowNewContactModal(false);
    }
  };

  return (
    <div className="dashboard-sidebar">


      {/* Search */}
      <div className="search-section">
        <div className="search-input-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-section">
        <CustomDropdown 
          value={selectedFilter}
          onChange={setSelectedFilter}
          options={[
            { value: 'All Contacts', label: 'All Contacts' },
            { value: 'Active Patients', label: 'Active Patients' },
            { value: 'Referred by Doctor', label: 'Referred by Doctor' },
            { value: 'Referred by Patient', label: 'Referred by Patient' }
          ]}
        />
      </div>

      {/* New Contact Button */}
      <div className="new-contact-section">
        <button className="new-contact-btn" onClick={handleNewContact}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="2"/>
            <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2"/>
          </svg>
          New Contact
        </button>
      </div>

      {/* Contacts List */}
      <div className="contacts-list">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
            onClick={() => onContactSelect(contact)}
          >
            <div className="contact-avatar">
              <span className="contact-initials">{contact.initials}</span>
              <div 
                className="contact-status-dot"
                style={{ backgroundColor: getStatusColor(contact.status) }}
              />
            </div>
            
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div 
                className="contact-status"
                style={{ color: getStatusColor(contact.status) }}
              >
                {contact.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Contact Modal */}
      <NewContactModal
        isOpen={showNewContactModal}
        onClose={() => setShowNewContactModal(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default DashboardSidebar;