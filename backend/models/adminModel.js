const db = require('../config/db');

const AdminModel = {
  async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.username,
        a.client_id,
        a.status,
        c.nama_instansi,
        c.slug
      FROM admins a
      JOIN clients c ON a.client_id = c.id
      WHERE a.id = ?`,
      [id]
    );
    return rows[0];
  },

  async usernameExists(username, excludeId = null) {
    let query = 'SELECT id FROM admins WHERE username = ?';
    const params = [username];

    if (excludeId) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  },

  async clientExists(client_id) {
    const [rows] = await db.query('SELECT id FROM clients WHERE id = ?', [client_id]);
    return rows.length > 0;
  },

  async createAdmin({ username, password, client_id, status }) {
    const [result] = await db.query(
      'INSERT INTO admins (username, password, client_id, status) VALUES (?, ?, ?, ?)',
      [username, password, client_id, status]
    );
    return result;
  },

  async updateAdmin(id, { username, password, client_id, status }) {
    // Update password hanya jika ada value, biar tidak overwrite dengan null
    if (password) {
      const [result] = await db.query(
        'UPDATE admins SET username = ?, password = ?, client_id = ?, status = ? WHERE id = ?',
        [username, password, client_id, status, id]
      );
      return result;
    } else {
      const [result] = await db.query(
        'UPDATE admins SET username = ?, client_id = ?, status = ? WHERE id = ?',
        [username, client_id, status, id]
      );
      return result;
    }
  },

  async deleteAdmin(id) {
    const [result] = await db.query('DELETE FROM admins WHERE id = ?', [id]);
    return result;
  },

  async getAllAdmins({ username, nama_instansi }) {
    let query = `
      SELECT 
        a.id, 
        a.username, 
        a.client_id, 
        a.status,
        c.nama_instansi, 
        c.slug
      FROM admins a
      JOIN clients c ON a.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (username) {
      query += ' AND a.username LIKE ?';
      params.push(`%${username}%`);
    }

    if (nama_instansi) {
      query += ' AND c.nama_instansi LIKE ?';
      params.push(`%${nama_instansi}%`);
    }

    const [rows] = await db.query(query, params);
    return rows;
  }
};

module.exports = AdminModel;
