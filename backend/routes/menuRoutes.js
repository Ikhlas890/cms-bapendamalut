const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Endpoint user management menu CMS
 *
 * /api/menus:
 *   get:
 *     tags: [Menus]
 *     summary: Ambil daftar menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Filter status menu. Kosongkan untuk mengambil semua status.
 *       - in: query
 *         name: parent_id
 *         required: false
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *               enum: ['null']
 *         description: Filter parent menu. Isi null untuk menu utama.
 *     responses:
 *       200:
 *         description: Daftar menu. Jika data belum ada, response berupa array kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *             example:
 *               - id: 1
 *                 nama_menu: Dashboard
 *                 slug: dashboard
 *                 url: /dashboard
 *                 icon: pi pi-home
 *                 parent_id: null
 *                 urutan: 1
 *                 status: 1
 *                 created_at: '2026-07-22 10:30:00'
 *                 updated_at: '2026-07-22 10:30:00'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *   post:
 *     tags: [Menus]
 *     summary: Tambah menu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuInput'
 *     responses:
 *       201:
 *         description: Menu berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu berhasil ditambahkan
 *                 menu:
 *                   $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Data wajib belum lengkap atau parent_id tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       409:
 *         description: Slug menu sudah digunakan
 *
 * /api/menus/{id}:
 *   get:
 *     tags: [Menus]
 *     summary: Ambil detail menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Detail menu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Menu tidak ditemukan
 *   put:
 *     tags: [Menus]
 *     summary: Edit menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuInput'
 *     responses:
 *       200:
 *         description: Menu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu berhasil diperbarui
 *                 menu:
 *                   $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Data wajib belum lengkap atau parent_id tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Menu tidak ditemukan
 *       409:
 *         description: Slug menu sudah digunakan
 *   delete:
 *     tags: [Menus]
 *     summary: Hapus menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Menu berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Menu tidak ditemukan
 */
router.use(auth);
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenuById);
router.post('/', menuController.addMenu);
router.put('/:id', menuController.editMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
