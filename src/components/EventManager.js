import React, { useState, useEffect } from 'react';
import './EventManager.css';

const EventManager = ({ isOpen, onClose, contacts = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventType, setEventType] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [events, setEvents] = useState([]);

  // Sample upcoming events for tomorrow
  const [upcomingEvents] = useState([
    {
      id: 1,
      type: 'Birthday',
      contact: 'Sarah Johnson',
      date: 'Nov 7, 2025',
      time: '10:00',
      color: '#8b5cf6'
    },
    {
      id: 2,
      type: 'Anniversary',
      contact: 'Michael Chen',
      date: 'Nov 7, 2025',
      time: '14:00',
      color: '#06b6d4'
    },
    {
      id: 3,
      type: 'Appointment',
      contact: 'Emily Rodriguez',
      date: 'Nov 7, 2025',
      time: '09:30',
      color: '#10b981'
    }
  ]);

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

  const handleSaveEvent = () => {
    if (eventType && selectedContact && eventTime) {
      const newEvent = {
        id: Date.now(),
        type: eventType,
        contact: selectedContact,
        date: selectedDate,
        time: eventTime,
        notes: eventNotes,
        color: eventTypes.find(type => type.value === eventType)?.color || '#6366f1'
      };
      
      setEvents([...events, newEvent]);
      
      // Reset form
      setEventType('');
      setSelectedContact('');
      setEventTime('');
      setEventNotes('');
    }
  };

  const handleClose = () => {
    setEventType('');
    setSelectedContact('');
    setEventTime('');
    setEventNotes('');
    onClose();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

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
                  <h4>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
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
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="time-input"
                  />
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
                  disabled={!eventType || !selectedContact || !eventTime}
                >
                  Save Event
                </button>
              </div>
            </div>

            {/* Right Side - Upcoming Events */}
            <div className="upcoming-section">
              <div className="upcoming-header">
                <h3>Upcoming Events</h3>
              </div>

              <div className="upcoming-events">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="upcoming-event">
                    <div className="event-indicator" style={{ backgroundColor: event.color }}>
                      <span className="event-type-badge">{event.type}</span>
                    </div>
                    <div className="event-details">
                      <div className="event-contact">{event.contact}</div>
                      <div className="event-datetime">
                        <span className="event-date">{event.date}</span>
                        <span className="event-time">{event.time}</span>
                      </div>
                    </div>
                    <button className="remove-event-btn" title="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;