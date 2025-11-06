const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  // Database operations
  templates: {
    getAll: () => ipcRenderer.invoke('db-templates', 'getAll'),
    create: (data) => ipcRenderer.invoke('db-templates', 'create', data),
    update: (data) => ipcRenderer.invoke('db-templates', 'update', data),
    delete: (id) => ipcRenderer.invoke('db-templates', 'delete', id)
  },
  
  contacts: {
    getAll: () => ipcRenderer.invoke('db-contacts', 'getAll'),
    create: (data) => ipcRenderer.invoke('db-contacts', 'create', data),
    update: (data) => ipcRenderer.invoke('db-contacts', 'update', data),
    delete: (id) => ipcRenderer.invoke('db-contacts', 'delete', id)
  },
  
  events: {
    getAll: () => ipcRenderer.invoke('db-events', 'getAll'),
    getUpcoming: (days) => ipcRenderer.invoke('db-events', 'getUpcoming', days),
    getByDate: (date) => ipcRenderer.invoke('db-events', 'getByDate', date),
    getByContact: (contactId) => ipcRenderer.invoke('db-events', 'getByContact', contactId),
    create: (data) => ipcRenderer.invoke('db-events', 'create', data),
    update: (data) => ipcRenderer.invoke('db-events', 'update', data),
    delete: (id) => ipcRenderer.invoke('db-events', 'delete', id),
    markCompleted: (id) => ipcRenderer.invoke('db-events', 'markCompleted', id),
    markReminderSent: (id) => ipcRenderer.invoke('db-events', 'markReminderSent', id),
    getNeedingReminders: () => ipcRenderer.invoke('db-events', 'getNeedingReminders')
  }
});