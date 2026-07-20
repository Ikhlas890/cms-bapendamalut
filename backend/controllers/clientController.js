const ClientModel = require('../models/clientModel');

function generateSlug(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getClients = async (req, res) => {
  try {
    const clients = await ClientModel.getAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addClient = async (req, res) => {
  const { nama_instansi } = req.body;

  if (!nama_instansi || !nama_instansi.trim()) {
    return res.status(400).json({ message: 'Nama instansi wajib diisi' });
  }

  const normalizedName = nama_instansi.trim();
  const slug = generateSlug(normalizedName);

  if (!slug) {
    return res.status(400).json({ message: 'Nama instansi tidak valid untuk dibuat slug' });
  }

  try {
    const slugExists = await ClientModel.slugExists(slug);
    if (slugExists) {
      return res.status(409).json({ message: 'Nama instansi sudah digunakan' });
    }

    const result = await ClientModel.create({ nama_instansi: normalizedName, slug });
    const client = await ClientModel.findById(result.insertId);

    res.status(201).json({
      message: 'Group user berhasil ditambahkan',
      client
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editClient = async (req, res) => {
  const { id } = req.params;
  const { nama_instansi } = req.body;

  if (!nama_instansi || !nama_instansi.trim()) {
    return res.status(400).json({ message: 'Nama instansi wajib diisi' });
  }

  const normalizedName = nama_instansi.trim();
  const slug = generateSlug(normalizedName);

  if (!slug) {
    return res.status(400).json({ message: 'Nama instansi tidak valid untuk dibuat slug' });
  }

  try {
    const existingClient = await ClientModel.findById(id);
    if (!existingClient) {
      return res.status(404).json({ message: 'Group user tidak ditemukan' });
    }

    const slugExists = await ClientModel.slugExists(slug, id);
    if (slugExists) {
      return res.status(409).json({ message: 'Nama instansi sudah digunakan' });
    }

    await ClientModel.update(id, { nama_instansi: normalizedName, slug });
    const client = await ClientModel.findById(id);

    res.json({
      message: 'Group user berhasil diperbarui',
      client
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const existingClient = await ClientModel.findById(id);
    if (!existingClient) {
      return res.status(404).json({ message: 'Group user tidak ditemukan' });
    }

    const usedInPosts = await ClientModel.isUsedInPosts(id);
    if (usedInPosts) {
      return res.status(409).json({
        message: 'Group user tidak dapat dihapus karena client_id sudah digunakan di post'
      });
    }

    await ClientModel.delete(id);
    res.json({ message: 'Group user berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
