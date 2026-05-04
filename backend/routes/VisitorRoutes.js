const express = require('express');
const router = express.Router();

const { createVisitor, getVisitors, getVisitorById, approveVisitor, rejectVisitor } = require('../controllers/VisitorController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/visitors - Create a new visitor with photo upload
/**
 * Route: /api/visitors
 * Description: Create a new visitor with photo upload
 * Method: POST
 * Middleware: requireAuth, upload.single('photo')
 */
router.post('/', requireAuth, upload.single('photo'), createVisitor);

// GET /api/visitors - Get all visitors
/**
 * Route: /api/visitors
 * Description: Get all visitors
 * Method: GET
 */
router.get('/', requireAuth, getVisitors);

// GET /api/visitors/:id - Get a visitor by ID
/**
 * Route: /api/visitors/:id
 * Description: Get a visitor by ID
 * Method: GET
 */
router.get('/:id', requireAuth, getVisitorById);

// PUT /api/visitors/:id/approve - Approve a visitor
/**
 * Route: /api/visitors/:id/approve
 * Description: Approve a visitor
 * Method: PUT
 */
router.put('/:id/approve', requireAuth, allowRoles('admin', 'security'), approveVisitor);

// PUT /api/visitors/:id/reject - Reject a visitor
/**
 * Route: /api/visitors/:id/reject
 * Description: Reject a visitor
 * Method: PUT
 */
router.put('/:id/reject', requireAuth, allowRoles('admin', 'security'), rejectVisitor);

module.exports = router;