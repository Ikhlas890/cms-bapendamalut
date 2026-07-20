const db = require('../config/db');

const ClientModel = {
  async getAll() {
    const [rows] = await db.query(
      'SELECT id, nama_instansi, slug FROM clients ORDER BY id ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, nama_instansi, slug FROM clients WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async slugExists(slug, excludeId = null) {
    let query = 'SELECT id FROM clients WHERE slug = ?';
    const params = [slug];

    if (excludeId) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  },

  async create({ nama_instansi, slug }) {
    const [result] = await db.query(
      'INSERT INTO clients (nama_instansi, slug) VALUES (?, ?)',
      [nama_instansi, slug]
    );
    return result;
  },

  async update(id, { nama_instansi, slug }) {
    const [result] = await db.query(
      'UPDATE clients SET nama_instansi = ?, slug = ? WHERE id = ?',
      [nama_instansi, slug, id]
    );
    return result;
  },

  async isUsedInPosts(id) {
    const [rows] = await db.query(
      'SELECT id FROM posts WHERE client_id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);
    return result;
  }
};

module.exports = ClientModel;
