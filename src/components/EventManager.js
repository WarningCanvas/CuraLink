import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';
import './EventManager.css';

const EventManager = ({ isOpen, onClose, contacts = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventType, setEventType] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [eventHour, setEventHour] = useState('12');
  const [eventMinute, setEventMinute] = useState('00');
  const [eventAmPm, setEventAmPm] = useState('AM');
  const [eventNotes, setEventNotes] = useState('');
  const [events, setEvents] = useState([]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from database
  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await databaseService.getAllEvents();
      
      setEvents(allEvents || []);
      
      // Format all events for display, sorted by date (most recent first)
      const formattedEvents = (allEvents || [])
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
        .map(event => ({
          ...event,
          date: formatEventDate(event.event_date),
          time: event.event_time,
          contact: event.contact_name,
          type: event.event_type
        }));
      
      setUpcomingEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const eventTypes = [
    { value: 'appointment', label: 'Appointment', color: '#10b981' },
    { value: 'birthday', label: 'Birthday', color: '#8b5cf6' },
    { value: 'anniversary', label: 'Anniversary', color: '#06b6d4' },
    { value: 'follow-up', label: 'Follow-up', color: '#f59e0b' },
    { value: 'consultation', label: 'Consultation', color: '#ef4444' },
    { value: 'reminder', label: 'Reminder', color: '#6366f1' }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleSaveEvent = async () => {
    if (eventType && selectedContact && eventHour && eventMinute) {
      try {
        const timeString = `${eventHour}:${eventMinute} ${eventAmPm}`;
        const selectedContactObj = contacts.find(c => c.name === selectedContact);
        
        const eventData = {
          contact_id: selectedContactObj?.id || 'unknown',
          contact_name: selectedContact,
          event_type: eventType,
          event_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
          event_time: timeString,
          notes: eventNotes,
          color: eventTypes.find(type => type.value === eventType)?.color || '#6366f1'
        };
        
        console.log('Saving event:', eventData);
        const savedEvent = await databaseService.createEvent(eventData);
        console.log('Event saved:', savedEvent);
        
        // Reload events to update the UI
        await loadEvents();
        
        // Reset form
        setEventType('');
        setSelectedContact('');
        setEventHour('12');
        setEventMinute('00');
        setEventAmPm('AM');
        setEventNotes('');
      } catch (error) {
        console.error('Failed to save event:', error);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      console.log('Deleting event:', eventId);
      await databaseService.deleteEvent(eventId);
      console.log('Event deleted successfully');
      
      // Reload events to update the UI
      await loadEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleClose = () => {
    setEventType('');
    setSelectedContact('');
    setEventHour('12');
    setEventMinute('00');
    setEventAmPm('AM');
    setEventNotes('');
    setShowYearPicker(false);
    onClose();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Close year picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.year-picker-container')) {
        setShowYearPicker(false);
      }
    };

    if (showYearPicker) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showYearPicker]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="event-manager-modal">
        <div className="modal-header">
          <h2>Event Manager</h2>
          <p>Schedule appointments, birthdays, anniversaries, and track referrals for your contacts</p>
          <button className="close-btn" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="event-manager-layout">
            {/* Left Side - Calendar and Form */}
            <div className="calendar-section">
              <div className="calendar-header">
                <h3>Select Date</h3>
              </div>

              {/* Calendar */}
              <div className="calendar">
                <div className="calendar-nav">
                  <button className="nav-btn" onClick={handlePrevMonth}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  
                  <div className="month-year-selector">
                    <span className="month-name">{monthNames[currentMonth.getMonth()]}</span>
                    <div className="year-picker-container">
                      <button 
                        className="year-btn"
                        onClick={() => setShowYearPicker(!showYearPicker)}
                      >
                        {currentMonth.getFullYear()}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                      
                      {showYearPicker && (
                        <div className="year-dropdown">
                          {generateYearOptions().map(year => (
                            <button
                              key={year}
                              className={`year-option ${year === currentMonth.getFullYear() ? 'selected' : ''}`}
                              onClick={() => handleYearChange(year)}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button className="nav-btn" onClick={handleNextMonth}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>

                <div className="calendar-grid">
                  <div className="day-headers">
                    {dayNames.map(day => (
                      <div key={day} className="day-header">{day}</div>
                    ))}
                  </div>
                  
                  <div className="days-grid">
                    {getDaysInMonth(currentMonth).map((dayObj, index) => (
                      <button
                        key={index}
                        className={`day-cell ${
                          !dayObj.isCurrentMonth ? 'other-month' : ''
                        } ${isToday(dayObj.date) ? 'today' : ''} ${
                          isSelected(dayObj.date) ? 'selected' : ''
                        }`}
                        onClick={() => handleDateClick(dayObj.date)}
                      >
                        {dayObj.day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Form */}
              <div className="event-form">
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="event-select"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Contact</label>
                  <select
                    value={selectedContact}
                    onChange={(e) => setSelectedContact(e.target.value)}
                    className="contact-select"
                  >
                    <option value="">Select contact</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.name}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <div className="time-picker">
                    <select
                      value={eventHour}
                      onChange={(e) => setEventHour(e.target.value)}
                      className="time-select hour-select"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 1;
                        return (
                          <option key={hour} value={hour.toString().padStart(2, '0')}>
                            {hour.toString().padStart(2, '0')}
                          </option>
                        );
                      })}
                    </select>
                    
                    <span className="time-separator">:</span>
                    
                    <select
                      value={eventMinute}
                      onChange={(e) => setEventMinute(e.target.value)}
                      className="time-select minute-select"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={eventAmPm}
                      onChange={(e) => setEventAmPm(e.target.value)}
                      className="time-select ampm-select"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    value={eventNotes}
                    onChange={(e) => setEventNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className="notes-textarea"
                    rows="3"
                  />
                </div>

                <button
                  className="save-event-btn"
                  onClick={handleSaveEvent}
                  disabled={!eventType || !selectedContact || !eventHour || !eventMinute}
                >
                  Save Event
                </button>
              </div>
            </div>

            {/* Right Side - All Events */}
            <div className="upcoming-section">
              <div className="upcoming-header">
                <h3>All Events</h3>
              </div>

              <div className="upcoming-events">
                {loading ? (
                  <div className="loading-events">
                    <p>Loading events...</p>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="no-events">
                    <p>No events found</p>
                  </div>
                ) : (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="upcoming-event">
                      <div className="event-indicator" style={{ backgroundColor: event.color }}>
                        <span className="event-type-badge">{event.event_type}</span>
                      </div>
                      <div className="event-details">
                        <div className="event-contact">{event.contact_name}</div>
                        <div className="event-datetime">
                          <span className="event-date">{event.date}</span>
                          <span className="event-time">{event.event_time}</span>
                        </div>
                      </div>
                      <button 
                        className="remove-event-btn" 
                        title="Remove"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;