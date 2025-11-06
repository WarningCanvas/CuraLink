import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import MessageCenter from '../components/MessageCenter';
import AIModal from '../components/AIModal';
import databaseService from '../services/databaseService';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedContact, setSelectedContact] = useState({
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    status: 'Active',
    phone: '1234567890'
  });
  const [showAIModal, setShowAIModal] = useState(false);
  const [contacts, setContacts] = useState([]);

  // Load contacts for the event manager
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await databaseService.getAllContacts();
        setContacts(contactsData || []);
      } catch (error) {
        console.error('Failed to load contacts for dashboard:', error);
      }
    };
    loadContacts();
  }, []);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleAISuggest = () => {
    setShowAIModal(true);
  };

  const handleUseAISuggestion = (suggestion) => {
    setShowAIModal(false);
  };

  return (
    <div className="dashboard">
      <DashboardHeader contacts={contacts} />
      
      <div className="dashboard-body">
        <DashboardSidebar 
          selectedContact={selectedContact}
          onContactSelect={handleContactSelect}
        />
        
        <MessageCenter 
          selectedContact={selectedContact}
          onAISuggest={handleAISuggest}
        />
      </div>

      {showAIModal && (
        <AIModal
          contact={selectedContact}
          onClose={() => setShowAIModal(false)}
          onUseSuggestion={handleUseAISuggestion}
        />
      )}
    </div>
  );
};

export default Dashboard;