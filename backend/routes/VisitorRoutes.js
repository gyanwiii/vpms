const express = require('express');
const router = express.Router();
const { createVisitor, getVisitors, getVisitorById, approveVisitor, rejectVisitor } = require('../controllers/VisitorController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', requireAuth, upload.single('photo'), createVisitor);
router.get('/', requireAuth, getVisitors);
router.get('/:id', requireAuth, getVisitorById);
router.put('/:id/approve', requireAuth, allowRoles('admin', 'security'), approveVisitor);
router.put('/:id/reject', requireAuth, allowRoles('admin', 'security'), rejectVisitor);

module.exports = router;