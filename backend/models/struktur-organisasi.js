const db = require("../config/db");

const StrukturOrganisasiModel = {
  // Ambil semua post milik satu client
  async getAllByClient(client_id) {
    const [rows] = await db.query(
      "SELECT * FROM struktur_organisasi WHERE client_id = ? ORDER BY id DESC",
      [client_id]
    );
    return rows;
  },

  // Ambil post berdasarkan id dan client
  async getByIdAndClient(id, client_id) {
    const [rows] = await db.query(
      "SELECT * FROM struktur_organisasi WHERE id = ? AND client_id = ?",
      [id, client_id]
    );
    return rows[0];
  },

  // Tambah post dengan client_id
  async create({
    nama_jabatan,
    nama_pegawai,
    parent_id,
    deskripsi,
    foto,
    status,
    pendidikan,
    pengalaman_jabatan,
    pengalaman_organisasi,
    client_id,
  }) {
    const [result] = await db.query(
      `INSERT INTO struktur_organisasi 
      (nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, client_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, client_id]
    );
    return result.insertId;
  },

  // Update milik client tertentu
  async updateByClient(
    id,
    { nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, client_id }
  ) {
    const query = `
    UPDATE struktur_organisasi
    SET nama_jabatan = ?, 
        nama_pegawai = ?, 
        parent_id = ?, 
        deskripsi = ?, 
        status = ?, 
        pendidikan = ?, 
        pengalaman_jabatan = ?, 
        pengalaman_organisasi = ?, 
        foto = ?
    WHERE id = ? AND client_id = ?`;

    const values = [nama_jabatan, nama_pegawai, parent_id, deskripsi, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, foto, id, client_id];

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  },

  // Hapus milik client
  async deleteByClient(id, client_id) {
    const [result] = await db.query(
      "DELETE FROM struktur_organisasi WHERE id = ? AND client_id = ?",
      [id, client_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = StrukturOrganisasiModel;
