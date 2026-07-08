const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Endpoint publik untuk melihat berita
 */
router.get('/struktur-organisasi/:clientSlug/:id', publicController.getHirarkiByClientAndId);
router.get('/struktur-organisasi/:clientSlug', publicController.getHirarkiByClient);

/**
 * @swagger
 * /api/public/{clientSlug}/{id}:
 *   get:
 *     tags: [Public]
 *     summary: Mendapatkan berita berdasarkan client dan id
 *     parameters:
 *       - in: path
 *         name: clientSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug client
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID berita
 *     responses:
 *       200:
 *         description: Data berita berhasil diambil
 */
router.get('/:clientSlug/:id', publicController.getPostByClientAndId);

/**
 * @swagger
 * /api/public/{clientSlug}:
 *   get:
 *     tags: [Public]
 *     summary: Mendapatkan semua berita berdasarkan client
 *     parameters:
 *       - in: path
 *         name: clientSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug client
 *     responses:
 *       200:
 *         description: Daftar berita berhasil diambil
 */
router.get('/:clientSlug', publicController.getPostsByClient);

module.exports = router;
