import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedContact, onContactSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Contacts');

  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      initials: 'SJ',
      status: 'Active',
      type: 'patient',
      phone: '1234567890',
      lastMessage: 'Thank you for the appointment reminder',
      time: '2m ago',
      unread: 2
    },
    {
      id: 2,
      name: 'Michael Chen',
      initials: 'MC',
      status: 'Active',
      type: 'patient',
      phone: '1234567891',
      lastMessage: 'I need to reschedule my appointment',
      time: '1h ago',
      unread: 0
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      initials: 'ER',
      status: 'Patient',
      type: 'patient',
      phone: '1234567892',
      lastMessage: 'Looking forward to my visit',
      time: '3h ago',
      unread: 1
    },
    {
      id: 4,
      name: 'David Thompson',
      initials: 'DT',
      status: 'Doctor',
      type: 'doctor',
      phone: '1234567893',
      lastMessage: 'Patient referral documentation attached',
      time: '1d ago',
      unread: 0
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      initials: 'LA',
      status: 'Active',
      type: 'patient',
      phone: '1234567894',
      lastMessage: 'Prescription refill request',
      time: '2d ago',
      unread: 0
    },
    {
      id: 6,
      name: 'James Wilson',
      initials: 'JW',
      status: 'Active',
      type: 'patient',
      phone: '1234567895',
      lastMessage: 'Insurance verification needed',
      time: '3d ago',
      unread: 0
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All Contacts' || 
                         (selectedFilter === 'Active Patients' && contact.status === 'Active') ||
                         (selectedFilter === 'Doctors' && contact.type === 'doctor') ||
                         (selectedFilter === 'Patients' && contact.type === 'patient');
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

  return (
    <div className="sidebar">


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

      <div className="filter-section">
        <select 
          value={selectedFilter} 
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All Contacts">All Contacts</option>
          <option value="Active Patients">Active Patients</option>
          <option value="Patients">Patients</option>
          <option value="Doctors">Doctors</option>
        </select>
      </div>

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
              <div className="contact-header">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-time">{contact.time}</span>
              </div>
              
              <div className="contact-details">
                <span 
                  className="contact-status"
                  style={{ color: getStatusColor(contact.status) }}
                >
                  {contact.status}
                </span>
                {contact.unread > 0 && (
                  <span className="unread-badge">{contact.unread}</span>
                )}
              </div>
              
              <div className="contact-last-message">
                {contact.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;