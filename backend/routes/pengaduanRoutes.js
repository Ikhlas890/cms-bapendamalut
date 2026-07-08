const express = require('express');
const router = express.Router();
const pengaduanController = require('../controllers/pengaduanController');

router.get('/', pengaduanController.getAllPengaduan);
router.get('/:id', pengaduanController.getPengaduanById);
router.post('/', pengaduanController.createPengaduan);
router.put('/:id', pengaduanController.updatePengaduan);
router.delete('/:id', pengaduanController.deletePengaduan);

module.exports = router;
