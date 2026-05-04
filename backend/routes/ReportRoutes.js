const express = require('express');
const router = express.Router();

const { SummaryReport, getVisitorReport, getAppointmentReport, getPassReport } = require('../controllers/ReportController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

// GET /api/reports/summary - Get summary report
/**
 * Route: /api/reports/summary
 * Description: Get summary report
 * Method: GET
 * Access: Admin and Security
 */
router.get('/summary', requireAuth, allowRoles('admin', 'security'), SummaryReport);

// GET /api/reports/visitors - Get visitor report
/**
 * Route: /api/reports/visitors
 * Description: Get visitor report
 * Method: GET 
 * Access: Admin and Security
 */
router.get('/visitors', requireAuth, allowRoles('admin', 'security'), getVisitorReport);

// GET /api/reports/appointments - Get appointment report
/**
 * Route: /api/reports/appointments
 * Description: Get appointment report
 * Method: GET 
 * Access: Admin and Security
 */
router.get('/appointments', requireAuth, allowRoles('admin', 'security'), getAppointmentReport);

// GET /api/reports/passes - Get pass report
/**
 * Route: /api/reports/passes
 * Description: Get pass report
 * Method: GET 
 * Access: Admin and Security
 */
router.get('/passes', requireAuth, allowRoles('admin', 'security'), getPassReport);

module.exports = router;