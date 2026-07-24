const PanduanModel = require('../models/panduanModel');

const VALID_TYPES = ['video', 'teks', 'link', 'file'];

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeNullableText(value) {
  if (value === undefined || value === null || value === '') return null;
  return String(value).trim() || null;
}

function normalizeBooleanNumber(value, defaultValue = 1) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return NaN;
}

function normalizeId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}

function validatePanduanPayload(body) {
  const judul = normalizeString(body.judul);
  const tipe = normalizeString(body.tipe).toLowerCase();
  const konten = normalizeNullableText(body.konten);
  const status = normalizeBooleanNumber(body.status, 1);

  if (!judul || !tipe) {
    return { error: { status: 400, message: 'judul dan tipe wajib diisi' } };
  }

  if (!VALID_TYPES.includes(tipe)) {
    return { error: { status: 400, message: 'tipe harus bernilai video, teks, link, atau file' } };
  }

  if (Number.isNaN(status)) {
    return { error: { status: 400, message: 'status harus bernilai 0 atau 1' } };
  }

  return {
    data: {
      judul,
      tipe,
      konten,
      status
    }
  };
}

exports.getPanduan = async (req, res) => {
  const { status, tipe } = req.query;

  const normalizedStatus = status === undefined ? undefined : normalizeBooleanNumber(status);
  if (Number.isNaN(normalizedStatus)) {
    return res.status(400).json({ message: 'status harus bernilai 0 atau 1' });
  }

  const normalizedTipe = tipe === undefined ? undefined : normalizeString(tipe).toLowerCase();
  if (normalizedTipe !== undefined && !VALID_TYPES.includes(normalizedTipe)) {
    return res.status(400).json({ message: 'tipe harus bernilai video, teks, link, atau file' });
  }

  try {
    const panduan = await PanduanModel.getAll({
      status: normalizedStatus,
      tipe: normalizedTipe
    });
    res.json(panduan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPanduanById = async (req, res) => {
  const id = normalizeId(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'id harus berupa integer positif' });
  }

  try {
    const panduan = await PanduanModel.findById(id);
    if (!panduan) return res.status(404).json({ message: 'Panduan tidak ditemukan' });
    res.json(panduan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addPanduan = async (req, res) => {
  try {
    const { data, error } = validatePanduanPayload(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    const userId = req.user?.id || null;
    const result = await PanduanModel.create({
      ...data,
      created_by: userId,
      updated_by: userId
    });
    const panduan = await PanduanModel.findById(result.insertId);

    res.status(201).json({
      message: 'Panduan berhasil ditambahkan',
      panduan
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editPanduan = async (req, res) => {
  const id = normalizeId(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'id harus berupa integer positif' });
  }

  try {
    const existingPanduan = await PanduanModel.findById(id);
    if (!existingPanduan) {
      return res.status(404).json({ message: 'Panduan tidak ditemukan' });
    }

    const { data, error } = validatePanduanPayload(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    await PanduanModel.update(id, {
      ...data,
      updated_by: req.user?.id || null
    });
    const panduan = await PanduanModel.findById(id);

    res.json({
      message: 'Panduan berhasil diperbarui',
      panduan
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePanduan = async (req, res) => {
  const id = normalizeId(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'id harus berupa integer positif' });
  }

  try {
    const existingPanduan = await PanduanModel.findById(id);
    if (!existingPanduan) {
      return res.status(404).json({ message: 'Panduan tidak ditemukan' });
    }

    await PanduanModel.delete(id);
    res.json({ message: 'Panduan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
