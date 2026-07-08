const express = require('express');
const router = express.Router();
const strukturController = require('../controllers/struktur-organisasi');
const auth = require('../middleware/authMiddleware');

// Semua route pakai auth
router.use(auth);

// Semua handler akan bisa akses req.client_id
router.get('/', strukturController.getAllData);
router.get('/:id', strukturController.getDataById);
router.post('/', strukturController.createData);
router.put('/:id', strukturController.updateData);
router.delete('/:id', strukturController.deleteData);

module.exports = router;
