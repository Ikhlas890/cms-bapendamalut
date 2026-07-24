const express = require('express');
const router = express.Router();
const panduanController = require('../controllers/panduanController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Panduan
 *   description: Endpoint CRUD panduan CMS
 *
 * /api/panduan:
 *   get:
 *     tags: [Panduan]
 *     summary: Ambil daftar panduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Filter status panduan.
 *       - in: query
 *         name: tipe
 *         required: false
 *         schema:
 *           type: string
 *           enum: [video, teks, link, file]
 *         description: Filter tipe panduan.
 *     responses:
 *       200:
 *         description: Daftar panduan. Jika data belum ada, response berupa array kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Panduan'
 *       400:
 *         description: Query filter tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *   post:
 *     tags: [Panduan]
 *     summary: Tambah panduan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PanduanInput'
 *     responses:
 *       201:
 *         description: Panduan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Panduan berhasil ditambahkan
 *                 panduan:
 *                   $ref: '#/components/schemas/Panduan'
 *       400:
 *         description: Data wajib belum lengkap atau tipe/status tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *
 * /api/panduan/{id}:
 *   get:
 *     tags: [Panduan]
 *     summary: Ambil detail panduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panduan
 *     responses:
 *       200:
 *         description: Detail panduan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Panduan'
 *       400:
 *         description: ID tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Panduan tidak ditemukan
 *   put:
 *     tags: [Panduan]
 *     summary: Edit panduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panduan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PanduanInput'
 *     responses:
 *       200:
 *         description: Panduan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Panduan berhasil diperbarui
 *                 panduan:
 *                   $ref: '#/components/schemas/Panduan'
 *       400:
 *         description: Data wajib belum lengkap atau tipe/status/id tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Panduan tidak ditemukan
 *   delete:
 *     tags: [Panduan]
 *     summary: Hapus panduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panduan
 *     responses:
 *       200:
 *         description: Panduan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Panduan berhasil dihapus
 *       400:
 *         description: ID tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Panduan tidak ditemukan
 */
router.use(auth);
router.get('/', panduanController.getPanduan);
router.get('/:id', panduanController.getPanduanById);
router.post('/', panduanController.addPanduan);
router.put('/:id', panduanController.editPanduan);
router.delete('/:id', panduanController.deletePanduan);

module.exports = router;
