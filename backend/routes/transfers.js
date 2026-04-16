const express = require('express');
const router = express.Router();
const { createTransfer, getTransfers } = require('../controllers/transferController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ADMIN', 'COMMANDER'), createTransfer);
router.get('/', protect, getTransfers);

module.exports = router;