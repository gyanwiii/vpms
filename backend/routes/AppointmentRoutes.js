const express= require('express');
const router=express.Router();

const { createAppointment, getAppointments, getAppointmentById, approveAppointment, rejectAppointment } = require('../controllers/AppointmentController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

// POST /api/appointments - Create a new appointment
/**
 * Route: /api/appointments
 * Description: Create a new appointment
 * Method: POST
 */
router.post('/', requireAuth, createAppointment);

// GET /api/appointments - Get all appointments
/**
 * Route: /api/appointments
 * Description: Get all appointments
 * Method: GET
 */
router.get('/', requireAuth, getAppointments);

// GET /api/appointments/:id - Get an appointment by ID
/**
 * Route: /api/appointments/:id
 * Description: Get an appointment by ID
 * Method: GET
 */
router.get('/:id', requireAuth, getAppointmentById);

// PUT /api/appointments/:id/approve - Approve an appointment
/**
 * Route: /api/appointments/:id/approve
 * Description: Approve an appointment
 * Method: PUT
 */
router.put('/:id/approve', requireAuth, allowRoles('admin', 'security'), approveAppointment);

// PUT /api/appointments/:id/reject - Reject an appointment
/**
 * Route: /api/appointments/:id/reject
 * Description: Reject an appointment
 * Method: PUT
 */
router.put('/:id/reject', requireAuth, allowRoles('admin', 'security'), rejectAppointment);

module.exports=router;