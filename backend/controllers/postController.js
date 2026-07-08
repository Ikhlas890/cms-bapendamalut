const jwt = require('jsonwebtoken');
const PostModel = require('../models/postModel');
const upload = require('../middleware/upload');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

// Helper untuk ambil client_id dari token
function getClientIdFromToken(req) {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.client_id;
  } catch (err) {
    return null;
  }
}

exports.getAllPosts = async (req, res) => {
  const clientId = getClientIdFromToken(req);
  if (!clientId) return res.status(401).json({ message: 'Tidak memiliki akses' });

  const posts = await PostModel.getAllByClient(clientId);
  res.json(posts);
};

exports.getPostById = async (req, res) => {
  const clientId = req.user?.client_id;
  const id = req.params.id;

  const post = await PostModel.getByIdAndClient(id, clientId);
  if (!post) return res.status(404).json({ message: 'Post tidak ditemukan' });

  res.json(post);
};


exports.createPost = [
  upload.single('gambar_berita'),
  async (req, res) => {
    const clientId = getClientIdFromToken(req);
    if (!clientId) return res.status(401).json({ message: 'Tidak memiliki akses' });

    const { judul_berita, tanggal_berita, isi_berita, sumber_berita } = req.body;
    const gambar_berita = req.file ? req.file.filename : null;

    try {
      const postId = await PostModel.create({ judul_berita, tanggal_berita, isi_berita, sumber_berita, gambar_berita, client_id: clientId });
      res.json({ message: 'Post berhasil ditambahkan', id: postId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.updatePost = [
  upload.single('gambar_berita'),
  async (req, res) => {
    const clientId = getClientIdFromToken(req);
    const { judul_berita, tanggal_berita, isi_berita, sumber_berita } = req.body;
    const gambar_berita = req.file ? req.file.filename : null;

    try {
      const success = await PostModel.updateByClient(req.params.id, {
        judul_berita,
        tanggal_berita,
        isi_berita,
        sumber_berita,
        gambar_berita,
        client_id: clientId,
      });

      if (!success) return res.status(404).json({ message: 'Post tidak ditemukan atau bukan milik Anda' });

      res.json({ message: 'Post berhasil diupdate' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deletePost = async (req, res) => {
  const clientId = getClientIdFromToken(req);
  const success = await PostModel.deleteByClient(req.params.id, clientId);

  if (!success) return res.status(404).json({ message: 'Post tidak ditemukan atau bukan milik Anda' });

  res.json({ message: 'Post berhasil dihapus' });
};
