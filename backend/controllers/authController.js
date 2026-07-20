const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const AdminModel = require('../models/adminModel');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;

  return req.cookies?.token || bearerToken;
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query(
      `SELECT a.id, a.username, a.password, a.client_id, c.nama_instansi
       FROM admins a
       JOIN clients c ON a.client_id = c.id
       WHERE a.username = ?`,
      [username]
    );

    const admin = rows[0];
    if (!admin) return res.status(401).json({ message: 'Akun tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        client_id: admin.client_id,
        nama_instansi: admin.nama_instansi
      },
      secret,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 86400000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      username: admin.username,
      client_id: admin.client_id,
      nama_instansi: admin.nama_instansi,
      token
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

exports.me = (req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, admin: req.user });
  }

  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: 'Belum login' });

  try {
    const decoded = jwt.verify(token, secret);
    res.json({ loggedIn: true, admin: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

exports.addUser = async (req, res) => {
  const { username, password, client_id } = req.body;

  if (!username || !password || !client_id) {
    return res.status(400).json({ message: 'Username, password, dan client_id wajib diisi' });
  }

  try {
    const usernameExists = await AdminModel.usernameExists(username);
    if (usernameExists) {
      return res.status(409).json({ message: 'Username sudah digunakan' });
    }

    const clientExists = await AdminModel.clientExists(client_id);
    if (!clientExists) {
      return res.status(400).json({ message: 'client_id tidak ditemukan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await AdminModel.createAdmin({ username, password: hashedPassword, client_id });
    const user = await AdminModel.findById(result.insertId);

    res.status(201).json({
      message: 'User berhasil ditambahkan',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, client_id } = req.body;

  if (!username || !client_id) {
    return res.status(400).json({ message: 'Username dan client_id wajib diisi' });
  }

  try {
    const existingUser = await AdminModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const usernameExists = await AdminModel.usernameExists(username, id);
    if (usernameExists) {
      return res.status(409).json({ message: 'Username sudah digunakan' });
    }

    const clientExists = await AdminModel.clientExists(client_id);
    if (!clientExists) {
      return res.status(400).json({ message: 'client_id tidak ditemukan' });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await AdminModel.updateAdmin(id, {
      username,
      password: hashedPassword,
      client_id
    });

    const user = await AdminModel.findById(id);
    res.json({
      message: 'User berhasil diperbarui',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AdminModel.deleteAdmin(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const { username, nama_instansi } = req.query;

  try {
    const admins = await AdminModel.getAllAdmins({ username, nama_instansi });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ message: 'Logout berhasil' });
};
