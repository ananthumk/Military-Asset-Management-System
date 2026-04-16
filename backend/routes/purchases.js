const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ADMIN', 'LOGISTICS'), createPurchase);
router.get('/', protect, getPurchases);

module.exports = router;