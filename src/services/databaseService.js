// Database service for renderer process
// This will communicate with the main process via IPC

class DatabaseService {
  constructor() {
    this.isElectron = this.checkElectronEnvironment();
  }

  checkElectronEnvironment() {
    try {
      return window.electronAPI !== undefined;
    } catch (error) {
      return false;
    }
  }

  async invoke(channel, ...args) {
    if (this.isElectron) {
      try {
        return await window.electronAPI.invoke(channel, ...args);
      } catch (error) {
        console.error('IPC Error:', error);
        throw error;
      }
    } else {
      // Fallback for browser mode - use localStorage
      return this.handleBrowserMode(channel, ...args);
    }
  }

  // Browser mode fallback using localStorage
  handleBrowserMode(channel, ...args) {
    const [action, data] = args;
    
    switch (channel) {
      case 'db-templates':
        return this.handleTemplatesInBrowser(action, data);
      case 'db-contacts':
        return this.handleContactsInBrowser(action, data);
      case 'db-events':
        return this.handleEventsInBrowser(action, data);
      default:
        return Promise.resolve([]);
    }
  }

  handleTemplatesInBrowser(action, data) {
    const key = 'curalink-templates';
    const defaultTemplates = [
      {
        id: '1',
        title: 'Appointment Reminder',
        content: 'Hi {ClientName}, this is a friendly reminder about your appointment scheduled for {Date} at {Time}. Please reply to confirm or let us know if you need to reschedule. Looking forward to seeing you!',
        category: 'appointment',
        variables: ['ClientName', 'Date', 'Time']
      },
      {
        id: '2',
        title: 'Follow-up Care',
        content: 'Hello {ClientName}, we hope you\'re doing well! This is a follow-up message regarding your recent visit. Please don\'t hesitate to reach out if you have any questions or concerns.',
        category: 'followup',
        variables: ['ClientName']
      },
      {
        id: '3',
        title: 'Birthday Wishes',
        content: 'Happy Birthday, {ClientName}! 🎉 Wishing you a wonderful day filled with joy and celebration. Thank you for being a valued client. We hope this year brings you health and happiness!',
        category: 'birthday',
        variables: ['ClientName']
      },
      {
        id: '4',
        title: 'Welcome New Client',
        content: 'Welcome to {Organization}, {ClientName}! We\'re thrilled to have you with us. Our team is dedicated to providing you with exceptional care and service. Please feel free to reach out if you have any questions.',
        category: 'welcome',
        variables: ['Organization', 'ClientName']
      }
    ];

    switch (action) {
      case 'getAll':
        const stored = localStorage.getItem(key);
        return Promise.resolve(stored ? JSON.parse(stored) : defaultTemplates);
      
      case 'create':
        const templates = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultTemplates));
        const newTemplate = { ...data, id: Date.now().toString() };
        templates.push(newTemplate);
        localStorage.setItem(key, JSON.stringify(templates));
        return Promise.resolve(newTemplate);
      
      case 'update':
        const allTemplates = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultTemplates));
        const index = allTemplates.findIndex(t => t.id === data.id);
        if (index !== -1) {
          allTemplates[index] = data;
          localStorage.setItem(key, JSON.stringify(allTemplates));
        }
        return Promise.resolve(data);
      
      case 'delete':
        const templatesForDelete = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultTemplates));
        const filtered = templatesForDelete.filter(t => t.id !== data);
        localStorage.setItem(key, JSON.stringify(filtered));
        return Promise.resolve({ success: true });
      
      default:
        return Promise.resolve([]);
    }
  }

  handleContactsInBrowser(action, data) {
    const key = 'curalink-contacts';
    const defaultContacts = [
      {
        id: '1',
        name: 'Sarah Johnson',
        initials: 'SJ',
        status: 'Active',
        type: 'patient',
        phone: '+919876543210',
        email: 'sarah.johnson@email.com',
        organization: 'Self'
      },
      {
        id: '2',
        name: 'Michael Chen',
        initials: 'MC',
        status: 'Active',
        type: 'patient',
        phone: '+918765432109',
        email: 'michael.chen@email.com',
        organization: 'Tech Corp'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        initials: 'ER',
        status: 'Patient',
        type: 'patient',
        phone: '+917654321098',
        email: 'emily.rodriguez@email.com',
        organization: 'Design Studio'
      },
      {
        id: '4',
        name: 'David Thompson',
        initials: 'DT',
        status: 'Doctor',
        type: 'doctor',
        phone: '+919123456789',
        email: 'david.thompson@hospital.com',
        organization: 'City Hospital'
      },
      {
        id: '5',
        name: 'Lisa Anderson',
        initials: 'LA',
        status: 'Active',
        type: 'patient',
        phone: '+918234567890',
        email: 'lisa.anderson@email.com',
        organization: 'Self'
      },
      {
        id: '6',
        name: 'James Wilson',
        initials: 'JW',
        status: 'Active',
        type: 'patient',
        phone: '+917345678901',
        email: 'james.wilson@email.com',
        organization: 'Self'
      }
    ];

    switch (action) {
      case 'getAll':
        const stored = localStorage.getItem(key);
        return Promise.resolve(stored ? JSON.parse(stored) : defaultContacts);
      
      case 'create':
        const contacts = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultContacts));
        const newContact = { ...data, id: Date.now().toString() };
        contacts.push(newContact);
        localStorage.setItem(key, JSON.stringify(contacts));
        return Promise.resolve(newContact);
      
      case 'update':
        const allContacts = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultContacts));
        const index = allContacts.findIndex(c => c.id === data.id);
        if (index !== -1) {
          allContacts[index] = data;
          localStorage.setItem(key, JSON.stringify(allContacts));
        }
        return Promise.resolve(data);
      
      case 'delete':
        const contactsForDelete = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultContacts));
        const filtered = contactsForDelete.filter(c => c.id !== data);
        localStorage.setItem(key, JSON.stringify(filtered));
        return Promise.resolve({ success: true });
      
      default:
        return Promise.resolve([]);
    }
  }

  // Template methods
  async getAllTemplates() {
    return await this.invoke('db-templates', 'getAll');
  }

  async createTemplate(templateData) {
    return await this.invoke('db-templates', 'create', templateData);
  }

  async updateTemplate(templateData) {
    return await this.invoke('db-templates', 'update', templateData);
  }

  async deleteTemplate(templateId) {
    return await this.invoke('db-templates', 'delete', templateId);
  }

  handleEventsInBrowser(action, data) {
    const key = 'curalink-events';
    const defaultEvents = [];

    switch (action) {
      case 'getAll':
        const stored = localStorage.getItem(key);
        return Promise.resolve(stored ? JSON.parse(stored) : defaultEvents);
      
      case 'getUpcoming':
        const allEvents = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultEvents));
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + (data || 1));
        
        const upcoming = allEvents.filter(event => {
          const eventDate = new Date(event.event_date);
          return eventDate >= today && eventDate <= futureDate && !event.is_completed;
        });
        return Promise.resolve(upcoming);
      
      case 'create':
        const events = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultEvents));
        const newEvent = { ...data, id: Date.now().toString() };
        events.push(newEvent);
        localStorage.setItem(key, JSON.stringify(events));
        return Promise.resolve(newEvent);
      
      case 'update':
        const allEventsForUpdate = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultEvents));
        const index = allEventsForUpdate.findIndex(e => e.id === data.id);
        if (index !== -1) {
          allEventsForUpdate[index] = data;
          localStorage.setItem(key, JSON.stringify(allEventsForUpdate));
        }
        return Promise.resolve(data);
      
      case 'delete':
        const eventsForDelete = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultEvents));
        const filtered = eventsForDelete.filter(e => e.id !== data);
        localStorage.setItem(key, JSON.stringify(filtered));
        return Promise.resolve({ success: true });
      
      default:
        return Promise.resolve([]);
    }
  }

  // Contact methods
  async getAllContacts() {
    return await this.invoke('db-contacts', 'getAll');
  }

  async createContact(contactData) {
    return await this.invoke('db-contacts', 'create', contactData);
  }

  async updateContact(contactData) {
    return await this.invoke('db-contacts', 'update', contactData);
  }

  async deleteContact(contactId) {
    return await this.invoke('db-contacts', 'delete', contactId);
  }

  // Event methods
  async getAllEvents() {
    return await this.invoke('db-events', 'getAll');
  }

  async getUpcomingEvents(days = 1) {
    return await this.invoke('db-events', 'getUpcoming', days);
  }

  async getEventsByDate(date) {
    return await this.invoke('db-events', 'getByDate', date);
  }

  async getEventsByContact(contactId) {
    return await this.invoke('db-events', 'getByContact', contactId);
  }

  async createEvent(eventData) {
    return await this.invoke('db-events', 'create', eventData);
  }

  async updateEvent(eventData) {
    return await this.invoke('db-events', 'update', eventData);
  }

  async deleteEvent(eventId) {
    return await this.invoke('db-events', 'delete', eventId);
  }

  async markEventCompleted(eventId) {
    return await this.invoke('db-events', 'markCompleted', eventId);
  }

  async markReminderSent(eventId) {
    return await this.invoke('db-events', 'markReminderSent', eventId);
  }

  async getEventsNeedingReminders() {
    return await this.invoke('db-events', 'getNeedingReminders');
  }
}

// Create singleton instance
const databaseService = new DatabaseService();
export default databaseService;