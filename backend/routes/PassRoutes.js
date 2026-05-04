const express = require('express');
const router = express.Router();
const { createPass, getPasses, getPassById, checkin, checkout, revokePass } = require('../controllers/PassController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

router.post('/', requireAuth, allowRoles('admin', 'security'), createPass);
router.get('/', requireAuth, allowRoles('admin', 'security'), getPasses);
router.get('/:id', requireAuth, getPassById);
router.put('/:id/checkin', requireAuth, allowRoles('admin', 'security'), checkin);
router.put('/:id/checkout', requireAuth, allowRoles('admin', 'security'), checkout);
router.put('/:id/revoke', requireAuth, allowRoles('admin'), revokePass);

module.exports = router;