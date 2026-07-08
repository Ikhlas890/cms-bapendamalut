const db = require("../config/db");

const PostModel = {
// Ambil semua post milik satu client beserta nama_instansi dan slug
async getAllByClient(client_id) {
  const [rows] = await db.query(
    `SELECT posts.*, clients.nama_instansi, clients.slug
     FROM posts
     JOIN clients ON posts.client_id = clients.id
     WHERE posts.client_id = ?
     ORDER BY posts.created_at DESC`,
    [client_id]
  );
  return rows;
},

// Ambil post berdasarkan id dan client beserta nama_instansi dan slug
async getByIdAndClient(id, client_id) {
  const [rows] = await db.query(
    `SELECT posts.*, clients.nama_instansi, clients.slug
     FROM posts
     JOIN clients ON posts.client_id = clients.id
     WHERE posts.id = ? AND posts.client_id = ?`,
    [id, client_id]
  );
  return rows[0];
},

  // Tambah post dengan client_id
  async create({
    judul_berita,
    tanggal_berita,
    isi_berita,
    sumber_berita,
    gambar_berita,
    client_id,
  }) {
    const [result] = await db.query(
      `INSERT INTO posts 
      (judul_berita, tanggal_berita, isi_berita, sumber_berita, gambar_berita, client_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [judul_berita, tanggal_berita, isi_berita, sumber_berita, gambar_berita, client_id]
    );
    return result.insertId;
  },

  // Update post milik client tertentu
  async updateByClient(
    id,
    { judul_berita, tanggal_berita, isi_berita, sumber_berita, gambar_berita, client_id }
  ) {
    let query = `
      UPDATE posts 
      SET judul_berita = ?, tanggal_berita = ?, isi_berita = ?, sumber_berita = ?`;
    const values = [judul_berita, tanggal_berita, isi_berita, sumber_berita];

    if (gambar_berita) {
      query += `, gambar_berita = ?`;
      values.push(gambar_berita);
    }

    query += ` WHERE id = ? AND client_id = ?`;
    values.push(id, client_id);

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  },

  // Hapus post milik client
  async deleteByClient(id, client_id) {
    const [result] = await db.query(
      "DELETE FROM posts WHERE id = ? AND client_id = ?",
      [id, client_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = PostModel;
