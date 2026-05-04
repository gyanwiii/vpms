const Appointment=require('../models/Appointment');
const { sendAppointmentApproved, sendAppointmentRejected } = require('./emailService');

const createAppointment=async(req,res)=>{
    try{
        const {visitorName,visitorEmail,visitorPhone,purpose,date} = req.body;
        const appointment = await Appointment.create({ visitorName, visitorEmail, visitorPhone, purpose, date, hostId: req.user._id });
        res.status(201).json(appointment);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const getAppointments=async(req,res)=>{
    try{
        const appointments=await Appointment.find({ hostId: req.user._id });
        res.status(200).json(appointments);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const getAppointmentById=async(req,res)=>{
    try{
        const appointment=await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({message:'Appointment not found'});
        }
        res.status(200).json(appointment);
    }catch(error){
        res.status(400).json({message:error.message});
    }
};

const approveAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await sendAppointmentApproved(appointment.visitorEmail,appointment.visitorName,appointment.date);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const rejectAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await sendAppointmentRejected(appointment.visitorEmail,appointment.visitorName);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports={createAppointment,getAppointments,getAppointmentById,approveAppointment,rejectAppointment};