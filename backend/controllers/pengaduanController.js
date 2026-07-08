const Pengaduan = require('../models/pengaduanModel');

// Get all pengaduan
exports.getAllPengaduan = async (req, res) => {
  try {
    const results = await Pengaduan.getAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get pengaduan by ID
exports.getPengaduanById = async (req, res) => {
  try {
    const result = await Pengaduan.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create pengaduan
exports.createPengaduan = async (req, res) => {
  try {
    const result = await Pengaduan.create(req.body);
    res.status(201).json({ message: 'Pengaduan berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update pengaduan
exports.updatePengaduan = async (req, res) => {
  try {
    const result = await Pengaduan.update(req.params.id, req.body);
    res.json({ message: 'Pengaduan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete pengaduan
exports.deletePengaduan = async (req, res) => {
  try {
    await Pengaduan.delete(req.params.id);
    res.json({ message: 'Pengaduan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
