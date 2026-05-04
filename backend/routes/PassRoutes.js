const express = require('express');
const router = express.Router();

const { createPass, getPasses, getPassById, checkin, checkout, revokePass } = require('../controllers/PassController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

// POST /api/passes - Create a new pass
/**
 * Route: /api/passes
 * Description: Create a new pass
 * Method: POST
 */
router.post('/', requireAuth, allowRoles('admin', 'security'), createPass);

// GET /api/passes - Get all passes
/**
 * Route: /api/passes
 * Description: Get all passes
 * Method: GET
 */
router.get('/', requireAuth, allowRoles('admin', 'security'), getPasses);

// GET /api/passes/:id - Get a pass by ID
/**
 * Route: /api/passes/:id
 * Description: Get a pass by ID
 * Method: GET
 */
router.get('/:id', requireAuth, getPassById);

// PUT /api/passes/:id/checkin - Check in a pass
/**
 * Route: /api/passes/:id/checkin
 * Description: Check in a pass
 * Method: PUT
 */
router.put('/:id/checkin', requireAuth, allowRoles('admin', 'security'), checkin);

// PUT /api/passes/:id/checkout - Check out a pass
/**
 * Route: /api/passes/:id/checkout
 * Description: Check out a pass
 * Method: PUT
 */
router.put('/:id/checkout', requireAuth, allowRoles('admin', 'security'), checkout);

// PUT /api/passes/:id/revoke - Revoke a pass
/**
 * Route: /api/passes/:id/revoke
 * Description: Revoke a pass
 * Method: PUT
 */
router.put('/:id/revoke', requireAuth, allowRoles('admin'), revokePass);

module.exports = router;