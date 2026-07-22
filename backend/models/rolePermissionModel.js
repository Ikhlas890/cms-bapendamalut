const db = require('../config/db');

const permissionSelect = `
  SELECT
    rp.id,
    rp.client_id,
    c.nama_instansi,
    c.slug AS client_slug,
    rp.menu_id,
    m.nama_menu,
    m.slug AS menu_slug,
    m.url,
    m.icon,
    m.parent_id,
    m.urutan,
    rp.can_view,
    rp.can_create,
    rp.can_update,
    rp.can_delete,
    rp.created_at,
    rp.updated_at
  FROM role_permissions rp
  JOIN clients c ON rp.client_id = c.id
  JOIN menus m ON rp.menu_id = m.id
`;

const RolePermissionModel = {
  async getAll({ client_id, menu_id } = {}) {
    let query = `${permissionSelect} WHERE 1=1`;
    const params = [];

    if (client_id !== undefined) {
      query += ' AND rp.client_id = ?';
      params.push(client_id);
    }

    if (menu_id !== undefined) {
      query += ' AND rp.menu_id = ?';
      params.push(menu_id);
    }

    query += ' ORDER BY c.nama_instansi ASC, m.urutan ASC, m.id ASC';

    const [rows] = await db.query(query, params);
    return rows;
  },

  async getMenusByClient(client_id) {
    const [rows] = await db.query(
      `SELECT
        m.id AS menu_id,
        m.nama_menu,
        m.slug AS menu_slug,
        m.url,
        m.icon,
        m.parent_id,
        m.urutan,
        m.status,
        rp.id AS permission_id,
        ? AS client_id,
        COALESCE(rp.can_view, 0) AS can_view,
        COALESCE(rp.can_create, 0) AS can_create,
        COALESCE(rp.can_update, 0) AS can_update,
        COALESCE(rp.can_delete, 0) AS can_delete
       FROM menus m
       LEFT JOIN role_permissions rp
        ON rp.menu_id = m.id AND rp.client_id = ?
       ORDER BY COALESCE(m.parent_id, m.id), m.urutan ASC, m.id ASC`,
      [client_id, client_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(`${permissionSelect} WHERE rp.id = ?`, [id]);
    return rows[0];
  },

  async clientExists(client_id) {
    const [rows] = await db.query('SELECT id FROM clients WHERE id = ?', [client_id]);
    return rows.length > 0;
  },

  async menuExists(menu_id) {
    const [rows] = await db.query('SELECT id FROM menus WHERE id = ?', [menu_id]);
    return rows.length > 0;
  },

  async clientMenuExists(client_id, menu_id, excludeId = null) {
    let query = 'SELECT id FROM role_permissions WHERE client_id = ? AND menu_id = ?';
    const params = [client_id, menu_id];

    if (excludeId) {
      query += ' AND id <> ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  },

  async create({ client_id, menu_id, can_view, can_create, can_update, can_delete }) {
    const [result] = await db.query(
      `INSERT INTO role_permissions
        (client_id, menu_id, can_view, can_create, can_update, can_delete)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, menu_id, can_view, can_create, can_update, can_delete]
    );
    return result;
  },

  async update(id, { client_id, menu_id, can_view, can_create, can_update, can_delete }) {
    const [result] = await db.query(
      `UPDATE role_permissions
       SET client_id = ?, menu_id = ?, can_view = ?, can_create = ?, can_update = ?, can_delete = ?
       WHERE id = ?`,
      [client_id, menu_id, can_view, can_create, can_update, can_delete, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM role_permissions WHERE id = ?', [id]);
    return result;
  }
};

module.exports = RolePermissionModel;
