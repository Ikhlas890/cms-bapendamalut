const MenuModel = require('../models/menuModel');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

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

function normalizeNullableString(value) {
  if (value === undefined || value === null || value === '') return null;
  return String(value).trim() || null;
}

function normalizeNullableInt(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}

function normalizeInt(value, defaultValue = 0) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : NaN;
}

function normalizeBooleanNumber(value, defaultValue = 1) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return NaN;
}

async function validateMenuPayload(body, currentId = null) {
  const nama_menu = normalizeString(body.nama_menu);
  const slug = generateSlug(nama_menu);
  const url = normalizeString(body.url);
  const icon = normalizeNullableString(body.icon);
  const parent_id = normalizeNullableInt(body.parent_id);
  const urutan = normalizeInt(body.urutan, 0);
  const status = normalizeBooleanNumber(body.status, 1);

  if (!nama_menu || !url) {
    return { error: { status: 400, message: 'nama_menu dan url wajib diisi' } };
  }

  if (!slug) {
    return { error: { status: 400, message: 'nama_menu tidak valid untuk dibuat slug' } };
  }

  if (Number.isNaN(parent_id)) {
    return { error: { status: 400, message: 'parent_id harus berupa integer positif atau null' } };
  }

  if (Number.isNaN(urutan)) {
    return { error: { status: 400, message: 'urutan harus berupa integer' } };
  }

  if (Number.isNaN(status)) {
    return { error: { status: 400, message: 'status harus bernilai 0 atau 1' } };
  }

  if (currentId && parent_id === Number(currentId)) {
    return { error: { status: 400, message: 'parent_id tidak boleh sama dengan id menu' } };
  }

  if (parent_id) {
    const parentMenu = await MenuModel.findById(parent_id);
    if (!parentMenu) {
      return { error: { status: 400, message: 'parent_id tidak ditemukan' } };
    }
  }

  const slugExists = await MenuModel.slugExists(slug, currentId);
  if (slugExists) {
    return { error: { status: 409, message: 'Slug menu sudah digunakan' } };
  }

  return {
    data: {
      nama_menu,
      slug,
      url,
      icon,
      parent_id,
      urutan,
      status
    }
  };
}

exports.getMenus = async (req, res) => {
  const { status, parent_id } = req.query;

  const normalizedStatus = status === undefined ? undefined : normalizeBooleanNumber(status);
  if (Number.isNaN(normalizedStatus)) {
    return res.status(400).json({ message: 'status harus bernilai 0 atau 1' });
  }

  let normalizedParentId;
  if (parent_id === undefined) {
    normalizedParentId = undefined;
  } else if (parent_id === 'null') {
    normalizedParentId = null;
  } else {
    normalizedParentId = normalizeNullableInt(parent_id);
    if (Number.isNaN(normalizedParentId)) {
      return res.status(400).json({ message: 'parent_id harus berupa integer positif atau null' });
    }
  }

  try {
    const menus = await MenuModel.getAll({
      status: normalizedStatus,
      parent_id: normalizedParentId
    });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await MenuModel.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMenu = async (req, res) => {
  try {
    const { data, error } = await validateMenuPayload(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    const result = await MenuModel.create(data);
    const menu = await MenuModel.findById(result.insertId);

    res.status(201).json({
      message: 'Menu berhasil ditambahkan',
      menu
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const existingMenu = await MenuModel.findById(id);
    if (!existingMenu) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    const { data, error } = await validateMenuPayload(req.body, id);
    if (error) return res.status(error.status).json({ message: error.message });

    await MenuModel.update(id, data);
    const menu = await MenuModel.findById(id);

    res.json({
      message: 'Menu berhasil diperbarui',
      menu
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const existingMenu = await MenuModel.findById(id);
    if (!existingMenu) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    await MenuModel.delete(id);
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
