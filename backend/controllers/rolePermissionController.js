const RolePermissionModel = require('../models/rolePermissionModel');

function normalizePositiveInt(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}

function normalizeBooleanNumber(value, defaultValue = 0) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return NaN;
}

async function validatePermissionPayload(body, currentId = null) {
  const client_id = normalizePositiveInt(body.client_id);
  const menu_id = normalizePositiveInt(body.menu_id);
  const can_view = normalizeBooleanNumber(body.can_view);
  const can_create = normalizeBooleanNumber(body.can_create);
  const can_update = normalizeBooleanNumber(body.can_update);
  const can_delete = normalizeBooleanNumber(body.can_delete);

  if (Number.isNaN(client_id) || Number.isNaN(menu_id)) {
    return { error: { status: 400, message: 'client_id dan menu_id wajib berupa integer positif' } };
  }

  if ([can_view, can_create, can_update, can_delete].some(Number.isNaN)) {
    return { error: { status: 400, message: 'Permission harus bernilai 0 atau 1' } };
  }

  const clientExists = await RolePermissionModel.clientExists(client_id);
  if (!clientExists) {
    return { error: { status: 400, message: 'client_id tidak ditemukan' } };
  }

  const menuExists = await RolePermissionModel.menuExists(menu_id);
  if (!menuExists) {
    return { error: { status: 400, message: 'menu_id tidak ditemukan' } };
  }

  const clientMenuExists = await RolePermissionModel.clientMenuExists(client_id, menu_id, currentId);
  if (clientMenuExists) {
    return { error: { status: 409, message: 'Permission untuk client_id dan menu_id sudah ada' } };
  }

  return {
    data: {
      client_id,
      menu_id,
      can_view,
      can_create,
      can_update,
      can_delete
    }
  };
}

exports.getRolePermissions = async (req, res) => {
  const { client_id, menu_id } = req.query;

  const normalizedClientId = client_id === undefined ? undefined : normalizePositiveInt(client_id);
  const normalizedMenuId = menu_id === undefined ? undefined : normalizePositiveInt(menu_id);

  if (Number.isNaN(normalizedClientId) || Number.isNaN(normalizedMenuId)) {
    return res.status(400).json({ message: 'client_id dan menu_id harus berupa integer positif' });
  }

  try {
    const permissions = await RolePermissionModel.getAll({
      client_id: normalizedClientId,
      menu_id: normalizedMenuId
    });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRolePermissionById = async (req, res) => {
  try {
    const permission = await RolePermissionModel.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Role permission tidak ditemukan' });
    }

    res.json(permission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientMenuPermissions = async (req, res) => {
  const client_id = normalizePositiveInt(req.params.client_id);
  if (Number.isNaN(client_id)) {
    return res.status(400).json({ message: 'client_id harus berupa integer positif' });
  }

  try {
    const clientExists = await RolePermissionModel.clientExists(client_id);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client tidak ditemukan' });
    }

    const menus = await RolePermissionModel.getMenusByClient(client_id);
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addRolePermission = async (req, res) => {
  try {
    const { data, error } = await validatePermissionPayload(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    const result = await RolePermissionModel.create(data);
    const permission = await RolePermissionModel.findById(result.insertId);

    res.status(201).json({
      message: 'Role permission berhasil ditambahkan',
      permission
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editRolePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPermission = await RolePermissionModel.findById(id);
    if (!existingPermission) {
      return res.status(404).json({ message: 'Role permission tidak ditemukan' });
    }

    const { data, error } = await validatePermissionPayload(req.body, id);
    if (error) return res.status(error.status).json({ message: error.message });

    await RolePermissionModel.update(id, data);
    const permission = await RolePermissionModel.findById(id);

    res.json({
      message: 'Role permission berhasil diperbarui',
      permission
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRolePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPermission = await RolePermissionModel.findById(id);
    if (!existingPermission) {
      return res.status(404).json({ message: 'Role permission tidak ditemukan' });
    }

    await RolePermissionModel.delete(id);
    res.json({ message: 'Role permission berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
