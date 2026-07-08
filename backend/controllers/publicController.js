// controllers/publicController.js
const db = require('../config/db');

// -- BERITA -- //
// GET SEMUA POST BERITA BERDASARKAN CLIENT SLUG
exports.getPostsByClient = async (req, res) => {
  const { clientSlug } = req.params;

  try {
    const [posts] = await db.query(
      `SELECT posts.id, posts.judul_berita, posts.tanggal_berita, posts.isi_berita, posts.gambar_berita, posts.sumber_berita,
              clients.nama_instansi, clients.slug
       FROM posts
       JOIN clients ON posts.client_id = clients.id
       WHERE clients.slug = ?
       ORDER BY posts.created_at DESC`,
      [clientSlug]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post tidak ditemukan untuk client ini' });
    }

    // Tambahkan base URL untuk gambar_berita
    // const baseUrl = `https://${req.get('host')}/uploads/berita/`;
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/berita/`;
    const result = posts.map(p => ({
      ...p,
      gambar_berita: p.gambar_berita ? baseUrl + p.gambar_berita : null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET 1 POST BERITA BERDASARKAN CLIENT SLUG DAN POST ID
exports.getPostByClientAndId = async (req, res) => {
  const { clientSlug, id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const [posts] = await db.query(
      `SELECT posts.id, posts.judul_berita, posts.tanggal_berita, posts.isi_berita, posts.gambar_berita, posts.sumber_berita,
              clients.nama_instansi, clients.slug
       FROM posts
       JOIN clients ON posts.client_id = clients.id
       WHERE clients.slug = ? AND posts.id = ?`,
      [clientSlug, id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post tidak ditemukan untuk client ini' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/berita/`;
    // const baseUrl = `https://${req.get('host')}/uploads/berita/`;
    const post = posts[0];
    post.gambar_berita = post.gambar_berita ? baseUrl + post.gambar_berita : null;

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -- STRUKTUR ORGANISASI -- //
// GET SEMUA STRUKTUR ORGANISAS (HIRARKI) BERDASARKAN CLIENT SLUG
exports.getHirarkiByClient = async (req, res) => {
  const { clientSlug } = req.params;

  try {
    const [clients] = await db.query('SELECT id FROM clients WHERE slug = ?', [clientSlug]);
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client tidak ditemukan' });
    }

    const clientId = clients[0].id;

    const [datas] = await db.query(
      `SELECT id, nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status
       FROM struktur_organisasi
       WHERE client_id = ?
       ORDER BY create_at DESC`,
      [clientId]
    );

    res.json(datas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET 1 STRUKTUR ORGANISASI (HIRARKI) BERDASARKAN CLIENT SLUG DAN POST ID
exports.getHirarkiByClientAndId = async (req, res) => {
  const { clientSlug, id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const [clients] = await db.query('SELECT id FROM clients WHERE slug = ?', [clientSlug]);
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client tidak ditemukan' });
    }

    const clientId = clients[0].id;

    const [datas] = await db.query(
      `SELECT id, nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status
       FROM struktur_organisasi
       WHERE client_id = ? AND id = ?`,
      [clientId, id]
    );

    if (datas.length === 0) {
      return res.status(404).json({ message: 'Struktur organisasi tidak ditemukan untuk client ini' });
    }

    res.json(datas[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


