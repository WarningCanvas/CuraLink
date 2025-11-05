const { v4: uuidv4 } = require('uuid');

class DatabaseServices {
  constructor(database) {
    this.db = database;
  }

  // Contacts Services
  async getAllContacts() {
    return await this.db.all(`
      SELECT * FROM contacts 
      ORDER BY name ASC
    `);
  }

  async getContactById(id) {
    return await this.db.get('SELECT * FROM contacts WHERE id = ?', [id]);
  }

  async createContact(contactData) {
    const id = uuidv4();
    const { name, phone, email, organization, tags, status, notes, avatar_path } = contactData;
    
    await this.db.run(`
      INSERT INTO contacts (id, name, phone, email, organization, tags, status, notes, avatar_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, phone, email, organization, JSON.stringify(tags || []), status || 'Active', notes, avatar_path]);
    
    return await this.getContactById(id);
  }

  async updateContact(id, contactData) {
    const { name, phone, email, organization, tags, status, notes, avatar_path } = contactData;
    
    await this.db.run(`
      UPDATE contacts 
      SET name = ?, phone = ?, email = ?, organization = ?, tags = ?, status = ?, notes = ?, avatar_path = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, phone, email, organization, JSON.stringify(tags || []), status, notes, avatar_path, id]);
    
    return await this.getContactById(id);
  }

  async deleteContact(id) {
    return await this.db.run('DELETE FROM contacts WHERE id = ?', [id]);
  }

  async searchContacts(searchTerm, status = null) {
    let sql = `
      SELECT * FROM contacts 
      WHERE (name LIKE ? OR email LIKE ? OR organization LIKE ?)
    `;
    let params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    if (status && status !== 'All Contacts') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY name ASC';
    return await this.db.all(sql, params);
  }

  // Templates Services
  async getAllTemplates() {
    return await this.db.all(`
      SELECT * FROM templates 
      ORDER BY category ASC, title ASC
    `);
  }

  async getTemplateById(id) {
    return await this.db.get('SELECT * FROM templates WHERE id = ?', [id]);
  }

  async createTemplate(templateData) {
    const id = uuidv4();
    const { title, content, variables, category } = templateData;
    
    await this.db.run(`
      INSERT INTO templates (id, title, content, variables, category)
      VALUES (?, ?, ?, ?, ?)
    `, [id, title, content, JSON.stringify(variables || []), category || 'general']);
    
    return await this.getTemplateById(id);
  }

  async updateTemplate(id, templateData) {
    const { title, content, variables, category } = templateData;
    
    await this.db.run(`
      UPDATE templates 
      SET title = ?, content = ?, variables = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, content, JSON.stringify(variables || []), category, id]);
    
    return await this.getTemplateById(id);
  }

  async deleteTemplate(id) {
    return await this.db.run('DELETE FROM templates WHERE id = ?', [id]);
  }

  // Message History Services
  async getAllMessageHistory() {
    return await this.db.all(`
      SELECT mh.*, c.name as contact_name, c.phone as contact_phone, t.title as template_title
      FROM message_history mh
      LEFT JOIN contacts c ON mh.contact_id = c.id
      LEFT JOIN templates t ON mh.template_id = t.id
      ORDER BY mh.timestamp DESC
    `);
  }

  async getMessageHistoryByContact(contactId) {
    return await this.db.all(`
      SELECT mh.*, t.title as template_title
      FROM message_history mh
      LEFT JOIN templates t ON mh.template_id = t.id
      WHERE mh.contact_id = ?
      ORDER BY mh.timestamp DESC
    `, [contactId]);
  }

  async createMessageHistory(historyData) {
    const id = uuidv4();
    const { contact_id, message_content, template_id, sent_via, send_status, metadata } = historyData;
    
    await this.db.run(`
      INSERT INTO message_history (id, contact_id, message_content, template_id, sent_via, send_status, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, contact_id, message_content, template_id, sent_via || 'whatsapp', send_status || 'sent', JSON.stringify(metadata || {})]);
    
    return id;
  }

  async searchMessageHistory(searchTerm) {
    return await this.db.all(`
      SELECT mh.*, c.name as contact_name, c.phone as contact_phone, t.title as template_title
      FROM message_history mh
      LEFT JOIN contacts c ON mh.contact_id = c.id
      LEFT JOIN templates t ON mh.template_id = t.id
      WHERE c.name LIKE ? OR mh.message_content LIKE ?
      ORDER BY mh.timestamp DESC
    `, [`%${searchTerm}%`, `%${searchTerm}%`]);
  }

  // Settings Services
  async getSetting(key) {
    const result = await this.db.get('SELECT value FROM settings WHERE key = ?', [key]);
    return result ? result.value : null;
  }

  async setSetting(key, value) {
    await this.db.run(`
      INSERT OR REPLACE INTO settings (key, value, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `, [key, value]);
  }

  async getAllSettings() {
    const rows = await this.db.all('SELECT key, value FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  }

  // Utility methods
  async getStats() {
    const contactCount = await this.db.get('SELECT COUNT(*) as count FROM contacts');
    const templateCount = await this.db.get('SELECT COUNT(*) as count FROM templates');
    const messageCount = await this.db.get('SELECT COUNT(*) as count FROM message_history');
    
    return {
      contacts: contactCount.count,
      templates: templateCount.count,
      messages: messageCount.count
    };
  }

  async backup() {
    // Create a backup of the database
    const backupPath = this.db.dbPath.replace('.db', `_backup_${Date.now()}.db`);
    const fs = require('fs');
    fs.copyFileSync(this.db.dbPath, backupPath);
    return backupPath;
  }
}

module.exports = DatabaseServices;