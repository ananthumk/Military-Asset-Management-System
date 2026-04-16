const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('COMMANDER'), createAssignment);
router.get('/', protect, getAssignments);

module.exports = router;