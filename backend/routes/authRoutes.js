const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint authentication dan user management CMS
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user CMS
 *     description: Login akan mengembalikan data user, client_id, nama_instansi, dan JWT token. Token juga disimpan sebagai httpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin malut
 *               password:
 *                 type: string
 *                 format: password
 *                 example: adminmalut123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: admin malut
 *                 client_id:
 *                   type: integer
 *                   example: 2
 *                 nama_instansi:
 *                   type: string
 *                   example: Bapenda Maluku Utara
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Username atau password belum diisi
 *       401:
 *         description: Akun tidak ditemukan atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 *
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Ambil data user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: admin malut
 *                     client_id:
 *                       type: integer
 *                       example: 2
 *                     nama_instansi:
 *                       type: string
 *                       example: Bapenda Maluku Utara
 *       401:
 *         description: Belum login atau token tidak valid
 *
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user CMS
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout berhasil
 */

router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/users:
 *   post:
 *     tags: [Auth]
 *     summary: Tambah user CMS
 *     description: Membuat user/admin sebagai entitas pengelola informasi CMS untuk client/instansi tertentu.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - client_id
 *             properties:
 *               username:
 *                 type: string
 *                 example: operator-bapenda
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               client_id:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Status user/admin. 1 aktif, 0 tidak aktif. Default 1.
 *                 example: 1
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User berhasil ditambahkan
 *                 user:
 *                   $ref: '#/components/schemas/UserCms'
 *       400:
 *         description: Data wajib belum lengkap atau client_id tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       409:
 *         description: Username sudah digunakan
 *       500:
 *         description: Terjadi kesalahan server
 *   get:
 *     tags: [Auth]
 *     summary: Ambil semua user/admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter username
 *       - in: query
 *         name: nama_instansi
 *         schema:
 *           type: string
 *         description: Filter nama_instansi
 *     responses:
 *       200:
 *         description: Daftar user/admin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserCms'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       500:
 *         description: Terjadi kesalahan server
 *
 * /api/auth/users/{id}:
 *   put:
 *     tags: [Auth]
 *     summary: Edit user CMS
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user/admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - client_id
 *             properties:
 *               username:
 *                 type: string
 *                 example: operator-bapenda
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Opsional. Jika dikosongkan, password lama tidak berubah.
 *                 example: passwordBaru123
 *               client_id:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Status user/admin. 1 aktif, 0 tidak aktif.
 *                 example: 1
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User berhasil diperbarui
 *                 user:
 *                   $ref: '#/components/schemas/UserCms'
 *       400:
 *         description: Data wajib belum lengkap atau client_id tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       409:
 *         description: Username sudah digunakan
 *       500:
 *         description: Terjadi kesalahan server
 *   delete:
 *     tags: [Auth]
 *     summary: Hapus user CMS
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user/admin
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.use('/users', auth);
router.post('/users', authController.addUser);
router.get('/users', authController.getUsers);
router.put('/users/:id', authController.editUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
