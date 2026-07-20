const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;
  const token = req.cookies?.token || bearerToken;
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // semua info user/token disimpan di sini
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}

module.exports = verifyToken;
