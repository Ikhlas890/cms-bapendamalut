const db = require('../config/db');

const PanduanModel = {
  async getAll({ status, tipe } = {}) {
    let query = `
      SELECT id, judul, tipe, konten, status, created_by, updated_by, created_at, updated_at
      FROM panduan
      WHERE 1=1
    `;
    const params = [];

    if (status !== undefined) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (tipe !== undefined) {
      query += ' AND tipe = ?';
      params.push(tipe);
    }

    query += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, judul, tipe, konten, status, created_by, updated_by, created_at, updated_at
       FROM panduan
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async create({ judul, tipe, konten, status, created_by, updated_by }) {
    const [result] = await db.query(
      `INSERT INTO panduan (judul, tipe, konten, status, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [judul, tipe, konten, status, created_by, updated_by]
    );
    return result;
  },

  async update(id, { judul, tipe, konten, status, updated_by }) {
    const [result] = await db.query(
      `UPDATE panduan
       SET judul = ?, tipe = ?, konten = ?, status = ?, updated_by = ?
       WHERE id = ?`,
      [judul, tipe, konten, status, updated_by, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM panduan WHERE id = ?', [id]);
    return result;
  }
};

module.exports = PanduanModel;
