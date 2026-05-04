const express= require('express');
const router=express.Router();
const { createAppointment, getAppointments, getAppointmentById, approveAppointment, rejectAppointment } = require('../controllers/AppointmentController');
const { requireAuth, allowRoles } = require('../middleware/AuthMiddleware');

router.post('/', requireAuth, createAppointment);
router.get('/', requireAuth, getAppointments);
router.get('/:id', requireAuth, getAppointmentById);
router.put('/:id/approve', requireAuth, allowRoles('admin', 'security'), approveAppointment);
router.put('/:id/reject', requireAuth, allowRoles('admin', 'security'), rejectAppointment);

module.exports=router;