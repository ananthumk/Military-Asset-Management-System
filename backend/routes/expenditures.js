const express = require('express');
const router = express.Router();
const { createExpenditure } = require('../controllers/expenditureController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createExpenditure);

module.exports = router;