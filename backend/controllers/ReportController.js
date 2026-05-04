const Visitor = require('../models/Visitor');
const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const Checklog = require('../models/Checklog');

const SummaryReport = async (req, res) => {
    try {
        const totalVisitors = await Visitor.countDocuments();
        const totalPasses = await Pass.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        res.json({totalVisitors, totalAppointments, totalPasses});
    } catch (error) {
        console.error("Error generating summary report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getVisitorReport = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.json(visitors);
    } catch (error) {
        console.error("Error generating visitor report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAppointmentReport = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        console.error("Error generating appointment report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPassReport = async (req, res) => {
    try {
        const passes = await Pass.find();
        res.json(passes);
    } catch (error) {
        console.error("Error generating pass report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { SummaryReport, getVisitorReport, getAppointmentReport, getPassReport };