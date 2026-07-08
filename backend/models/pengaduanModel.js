const db = require("../config/db"); // pastikan ini adalah pool/promise

const Pengaduan = {
    getAll: async () => {
        const [rows] = await db.execute("SELECT * FROM pengaduan");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.execute("SELECT * FROM pengaduan WHERE id = ?", [id]);
        return rows[0]; // ambil satu data
    },

    create: async (data) => {
        const { email, judul, isi, tanggal, lokasi, kategori, status_pengadu } = data;
        const [result] = await db.execute(
            `INSERT INTO pengaduan 
            (email, judul_laporan, isi_laporan, tanggal_kejadian, lokasi_kejadian, kategori_laporan, status_pengadu) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, judul, isi, tanggal, lokasi, kategori, status_pengadu]
        );
        return result;
    },

    update: async (id, data) => {
        const { email, judul, isi, tanggal, lokasi, kategori, status_pengadu } = data;
        const [result] = await db.execute(
            `UPDATE pengaduan SET 
            email = ?, judul_laporan = ?, isi_laporan = ?, tanggal_kejadian = ?, 
            lokasi_kejadian = ?, kategori_laporan = ?, status_pengadu = ? 
            WHERE id = ?`,
            [email, judul, isi, tanggal, lokasi, kategori, status_pengadu, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute("DELETE FROM pengaduan WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Pengaduan;
