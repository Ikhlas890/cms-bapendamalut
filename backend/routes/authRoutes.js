const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint untuk ambil nama daftar instansi
 */

router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags: [Auth]
 *     summary: Ambil semua user/admin
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
 */
router.post('/users', authController.addUser);
router.get('/users', authController.getUsers);
router.put('/users/:id', authController.editUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
