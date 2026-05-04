const express = require('express');
const router = express.Router();

const { SummaryReport, getVisitorReport, getAppointmentReport, getPassReport } = require('../controllers/ReportController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

router.get('/summary', requireAuth, allowRoles('admin', 'security'), SummaryReport);
router.get('/visitors', requireAuth, allowRoles('admin', 'security'), getVisitorReport);
router.get('/appointments', requireAuth, allowRoles('admin', 'security'), getAppointmentReport);
router.get('/passes', requireAuth, allowRoles('admin', 'security'), getPassReport);

module.exports = router;