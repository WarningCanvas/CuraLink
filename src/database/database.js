const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = this.getDatabasePath();
  }

  getDatabasePath() {
    // Get app data directory based on platform
    const os = require('os');
    let appDataDir;
    
    switch (process.platform) {
      case 'win32':
        appDataDir = path.join(os.homedir(), 'AppData', 'Roaming', 'CuraLink');
        break;
      case 'darwin':
        appDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'CuraLink');
        break;
      default:
        appDataDir = path.join(os.homedir(), '.curalink');
    }

    // Ensure directory exists
    if (!fs.existsSync(appDataDir)) {
      fs.mkdirSync(appDataDir, { recursive: true });
    }

    return path.join(appDataDir, 'app-data.db');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database at:', this.dbPath);
          resolve();
        }
      });
    });
  }

  async initialize() {
    try {
      await this.connect();
      await this.createTables();
      await this.runMigrations();
      await this.initializeSettings();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    const tables = [
      // Migration tracking table
      `CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT UNIQUE NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Contacts table
      `CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        organization TEXT,
        tags TEXT DEFAULT '[]',
        status TEXT DEFAULT 'Active',
        notes TEXT,
        avatar_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Message templates table
      `CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        variables TEXT DEFAULT '[]',
        category TEXT DEFAULT 'general',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Message history table
      `CREATE TABLE IF NOT EXISTS message_history (
        id TEXT PRIMARY KEY,
        contact_id TEXT NOT NULL,
        message_content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        template_id TEXT,
        sent_via TEXT DEFAULT 'whatsapp',
        send_status TEXT DEFAULT 'sent',
        metadata TEXT DEFAULT '{}',
        FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE SET NULL
      )`
    ];

    for (const tableSQL of tables) {
      await this.run(tableSQL);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)',
      'CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name)',
      'CREATE INDEX IF NOT EXISTS idx_message_history_contact ON message_history(contact_id)',
      'CREATE INDEX IF NOT EXISTS idx_message_history_timestamp ON message_history(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category)'
    ];

    for (const indexSQL of indexes) {
      await this.run(indexSQL);
    }
  }

  async runMigrations() {
    const migrations = [
      {
        version: '1.0.0',
        description: 'Initial schema',
        sql: [] // Already created in createTables
      }
    ];

    for (const migration of migrations) {
      const exists = await this.get(
        'SELECT version FROM migrations WHERE version = ?',
        [migration.version]
      );

      if (!exists) {
        console.log(`Running migration: ${migration.version} - ${migration.description}`);
        
        for (const sql of migration.sql) {
          await this.run(sql);
        }

        await this.run(
          'INSERT INTO migrations (version) VALUES (?)',
          [migration.version]
        );
      }
    }
  }

  async initializeSettings() {
    const defaultSettings = {
      app_version: '1.0.0',
      schema_version: '1.0.0',
      user_name: 'Dr. Jane Smith',
      user_email: 'jane.smith@curalink.com',
      organization: 'Smith Medical Clinic',
      dark_mode: 'true',
      email_notifications: 'true',
      event_reminders: 'true'
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      const exists = await this.get('SELECT key FROM settings WHERE key = ?', [key]);
      if (!exists) {
        await this.run(
          'INSERT INTO settings (key, value) VALUES (?, ?)',
          [key, value]
        );
      }
    }
  }

  async insertDefaultData() {
    // Insert default message templates
    const defaultTemplates = [
      {
        id: uuidv4(),
        title: 'Appointment Reminder',
        content: 'Hi {ClientName}, this is a friendly reminder about your appointment scheduled for {Date} at {Time}. Please reply to confirm or let us know if you need to reschedule. Looking forward to seeing you!',
        variables: JSON.stringify(['ClientName', 'Date', 'Time']),
        category: 'appointment'
      },
      {
        id: uuidv4(),
        title: 'Follow-up Care',
        content: 'Hello {ClientName}, we hope you\'re doing well! This is a follow-up message regarding your recent visit. Please don\'t hesitate to reach out if you have any questions or concerns.',
        variables: JSON.stringify(['ClientName']),
        category: 'followup'
      },
      {
        id: uuidv4(),
        title: 'Birthday Wishes',
        content: 'Happy Birthday, {ClientName}! 🎉 Wishing you a wonderful day filled with joy and celebration. Thank you for being a valued client. We hope this year brings you health and happiness!',
        variables: JSON.stringify(['ClientName']),
        category: 'birthday'
      },
      {
        id: uuidv4(),
        title: 'Welcome New Client',
        content: 'Welcome to {Organization}, {ClientName}! We\'re thrilled to have you with us. Our team is dedicated to providing you with exceptional care and service. Please feel free to reach out if you have any questions.',
        variables: JSON.stringify(['Organization', 'ClientName']),
        category: 'welcome'
      }
    ];

    for (const template of defaultTemplates) {
      const exists = await this.get('SELECT id FROM templates WHERE title = ?', [template.title]);
      if (!exists) {
        await this.run(
          'INSERT INTO templates (id, title, content, variables, category) VALUES (?, ?, ?, ?, ?)',
          [template.id, template.title, template.content, template.variables, template.category]
        );
      }
    }

    // Insert sample contacts
    const sampleContacts = [
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        phone: '1234567890',
        email: 'sarah.johnson@email.com',
        organization: 'Self',
        status: 'Active',
        tags: JSON.stringify(['Patient'])
      },
      {
        id: uuidv4(),
        name: 'Michael Chen',
        phone: '1234567891',
        email: 'michael.chen@email.com',
        organization: 'Tech Corp',
        status: 'Active',
        tags: JSON.stringify(['Patient'])
      },
      {
        id: uuidv4(),
        name: 'Emily Rodriguez',
        phone: '1234567892',
        email: 'emily.rodriguez@email.com',
        organization: 'Design Studio',
        status: 'Patient',
        tags: JSON.stringify(['Patient', 'Referral'])
      },
      {
        id: uuidv4(),
        name: 'David Thompson',
        phone: '1234567893',
        email: 'david.thompson@hospital.com',
        organization: 'City Hospital',
        status: 'Doctor',
        tags: JSON.stringify(['Doctor', 'Referral'])
      }
    ];

    for (const contact of sampleContacts) {
      const exists = await this.get('SELECT id FROM contacts WHERE name = ?', [contact.name]);
      if (!exists) {
        await this.run(
          'INSERT INTO contacts (id, name, phone, email, organization, status, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [contact.id, contact.name, contact.phone, contact.email, contact.organization, contact.status, contact.tags]
        );
      }
    }
  }

  // Helper methods for database operations
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;