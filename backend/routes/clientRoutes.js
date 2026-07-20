const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpoint group user/client CMS
 *
 * /api/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Ambil semua group user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar group user
 *   post:
 *     tags: [Clients]
 *     summary: Tambah group user
 *     description: User hanya mengirim nama_instansi. Slug dibuat otomatis dari nama_instansi.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_instansi
 *             properties:
 *               nama_instansi:
 *                 type: string
 *                 example: Jasa Raharja
 *     responses:
 *       201:
 *         description: Group user berhasil ditambahkan
 *       400:
 *         description: Nama instansi wajib diisi atau tidak valid
 *       409:
 *         description: Nama instansi sudah digunakan
 *
 * /api/clients/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Edit group user
 *     description: User hanya mengirim nama_instansi. Slug dibuat otomatis dari nama_instansi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_instansi
 *             properties:
 *               nama_instansi:
 *                 type: string
 *                 example: Jasa Raharja
 *     responses:
 *       200:
 *         description: Group user berhasil diperbarui
 *       404:
 *         description: Group user tidak ditemukan
 *       409:
 *         description: Nama instansi sudah digunakan
 *   delete:
 *     tags: [Clients]
 *     summary: Hapus group user
 *     description: Delete gagal jika client_id sudah digunakan di tabel posts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group user berhasil dihapus
 *       404:
 *         description: Group user tidak ditemukan
 *       409:
 *         description: Group user sudah digunakan di post
 */
router.use(auth);
router.get('/', clientController.getClients);
router.post('/', clientController.addClient);
router.put('/:id', clientController.editClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
