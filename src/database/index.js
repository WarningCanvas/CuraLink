const Database = require('./database');
const DatabaseServices = require('./services');

let dbInstance = null;
let servicesInstance = null;

async function initializeDatabase() {
  try {
    if (!dbInstance) {
      dbInstance = new Database();
      await dbInstance.initialize();
      
      // Insert default data on first run
      await dbInstance.insertDefaultData();
      
      servicesInstance = new DatabaseServices(dbInstance);
      console.log('CuraLink database ready');
    }
    
    return servicesInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function getDatabase() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

function getServices() {
  if (!servicesInstance) {
    throw new Error('Database services not initialized. Call initializeDatabase() first.');
  }
  return servicesInstance;
}

async function closeDatabase() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    servicesInstance = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  getServices,
  closeDatabase
};