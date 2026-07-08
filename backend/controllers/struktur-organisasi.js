const jwt = require('jsonwebtoken');
const StrukturOrganisasiModel = require('../models/struktur-organisasi');
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

exports.getAllData = async (req, res) => {
  const clientId = getClientIdFromToken(req);
  if (!clientId) return res.status(401).json({ message: 'Tidak memiliki akses' });

  const datas = await StrukturOrganisasiModel.getAllByClient(clientId);
  res.json(datas);
};

exports.getDataById = async (req, res) => {
  try {
    const clientId = req.user?.client_id;
    const id = req.params.id;

    const data = await StrukturOrganisasiModel.getByIdAndClient(id, clientId);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.json(data); // <-- gunakan variabel data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createData = [
  upload.single('foto'),
  async (req, res) => {
    const clientId = getClientIdFromToken(req);
    if (!clientId) return res.status(401).json({ message: 'Tidak memiliki akses' });

    const { nama_jabatan, nama_pegawai, parent_id, deskripsi, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
      const dataId = await StrukturOrganisasiModel.create({ nama_jabatan, nama_pegawai, parent_id, deskripsi, foto, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, client_id: clientId });
      res.json({ message: 'Data berhasil ditambahkan', id: dataId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.updateData = [
  upload.single('foto'),
  async (req, res) => {
    const clientId = getClientIdFromToken(req);
    const { nama_jabatan, nama_pegawai, parent_id, deskripsi, status, pendidikan, pengalaman_jabatan, pengalaman_organisasi, } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
      const success = await StrukturOrganisasiModel.updateByClient(req.params.id, {
        nama_jabatan,
        nama_pegawai,
        parent_id,
        deskripsi,
        status,
        foto,
        pendidikan,
        pengalaman_jabatan, 
        pengalaman_organisasi,
        client_id: clientId,
      });

      if (!success) return res.status(404).json({ message: 'Data tidak ditemukan atau bukan milik Anda' });

      res.json({ message: 'Data berhasil diupdate' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deleteData = async (req, res) => {
  const clientId = getClientIdFromToken(req);
  const success = await StrukturOrganisasiModel.deleteByClient(req.params.id, clientId);

  if (!success) return res.status(404).json({ message: 'Data tidak ditemukan atau bukan milik Anda' });

  res.json({ message: 'Data berhasil dihapus' });
};
