const Visitor = require('../models/Visitor');
const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const Checklog = require('../models/Checklog');

// Generate summary report with total counts of visitors, appointments, and passes
const SummaryReport = async (req, res) => {
    try {
        const totalVisitors = await Visitor.countDocuments();
        const totalPasses = await Pass.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        res.json({totalVisitors, totalAppointments, totalPasses});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Report of all visitors with their details
const getVisitorReport = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Report of all appointments with their details
const getAppointmentReport = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Report of all passes with their details
const getPassReport = async (req, res) => {
    try {
        const passes = await Pass.find();
        res.json(passes);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { SummaryReport, getVisitorReport, getAppointmentReport, getPassReport };