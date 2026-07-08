const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');

// Semua route pakai auth
router.use(auth);

// Semua handler akan bisa akses req.client_id
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
