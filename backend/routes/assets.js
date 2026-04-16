const express = require('express');
const router = express.Router();
const { createAsset, getAssets, updateAsset, deleteAsset } = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ADMIN', 'LOGISTICS'), createAsset);
router.get('/', protect, getAssets);
router.put('/:id', protect, updateAsset);
router.delete('/:id', protect, authorize('ADMIN'), deleteAsset);

module.exports = router;