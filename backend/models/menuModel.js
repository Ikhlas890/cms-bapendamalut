const db = require('../config/db');

const MenuModel = {
  async getAll({ status, parent_id } = {}) {
    let query = `
      SELECT id, nama_menu, slug, url, icon, parent_id, urutan, status, created_at, updated_at
      FROM menus
      WHERE 1=1
    `;
    const params = [];

    if (status !== undefined) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (parent_id !== undefined) {
      if (parent_id === null) {
        query += ' AND parent_id IS NULL';
      } else {
        query += ' AND parent_id = ?';
        params.push(parent_id);
      }
    }

    query += ' ORDER BY COALESCE(parent_id, id), urutan ASC, id ASC';

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, nama_menu, slug, url, icon, parent_id, urutan, status, created_at, updated_at
       FROM menus
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async slugExists(slug, excludeId = null) {
    let query = 'SELECT id FROM menus WHERE slug = ?';
    const params = [slug];

    if (excludeId) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  },

  async create({ nama_menu, slug, url, icon, parent_id, urutan, status }) {
    const [result] = await db.query(
      `INSERT INTO menus (nama_menu, slug, url, icon, parent_id, urutan, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama_menu, slug, url, icon, parent_id, urutan, status]
    );
    return result;
  },

  async update(id, { nama_menu, slug, url, icon, parent_id, urutan, status }) {
    const [result] = await db.query(
      `UPDATE menus
       SET nama_menu = ?, slug = ?, url = ?, icon = ?, parent_id = ?, urutan = ?, status = ?
       WHERE id = ?`,
      [nama_menu, slug, url, icon, parent_id, urutan, status, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);
    return result;
  }
};

module.exports = MenuModel;
