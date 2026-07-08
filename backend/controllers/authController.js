const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // <--- tambahkan ini
const AdminModel = require('../models/adminModel');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔹 Ambil data admin + nama_instansi dari tabel clients
    const [rows] = await db.query(
      `SELECT a.id, a.username, a.password, a.client_id, c.nama_instansi
       FROM admins a
       JOIN clients c ON a.client_id = c.id
       WHERE a.username = ?`,
      [username]
    );

    const admin = rows[0];
    if (!admin) return res.status(401).json({ message: 'Akun tidak ditemukan' });

    // 🔹 Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    // 🔹 Token berisi juga nama_instansi
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

    // 🔹 Simpan token ke cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 86400000, // 1 hari
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ message: 'Login berhasil' });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ====================== GET ME ======================
exports.me = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Belum login' });

  try {
    const decoded = jwt.verify(token, secret);
    res.json({ loggedIn: true, admin: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// ====================== ADD USER ======================
exports.addUser = async (req, res) => {
  const { username, password, client_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await AdminModel.createAdmin({ username, password: hashedPassword, client_id });
    res.status(201).json({ message: 'User berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== EDIT USER ======================
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, client_id } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await AdminModel.updateAdmin(id, {
      username,
      password: hashedPassword,
      client_id
    });

    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== DELETE USER ======================
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await AdminModel.deleteAdmin(id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== GET ALL USERS ======================
exports.getUsers = async (req, res) => {
  const { username, nama_instansi } = req.query;
  try {
    const admins = await AdminModel.getAllAdmins({ username, nama_instansi });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== LOGOUT ======================
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  res.json({ message: 'Logout berhasil' });
};
