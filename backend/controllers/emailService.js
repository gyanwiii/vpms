const nodemailer = require('nodemailer');

// create transporter using gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendAppointmentApproved = async (visitorEmail, visitorName, date) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: visitorEmail,
            subject: 'Your Appointment is Approved',
            html: `
                <h2>Appointment Confirmed</h2>
                <p>Dear ${visitorName},</p>
                <p>Your appointment has been approved.</p>
                <p>Date: ${new Date(date).toLocaleDateString()}</p>
                <p>Please bring a valid ID when you arrive.</p>
            `
        });
        console.log('Email sent to:', visitorEmail);
    } catch (error) {
        console.log('Email failed:', error.message);
    }
};

const sendAppointmentRejected = async (visitorEmail, visitorName) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: visitorEmail,
            subject: 'Your Appointment Status',
            html: `
                <h2>Appointment Update</h2>
                <p>Dear ${visitorName},</p>
                <p>Unfortunately your appointment has been rejected.</p>
                <p>Please contact us for more information.</p>
            `
        });
        console.log('Email sent to:', visitorEmail);
    } catch (error) {
        console.log('Email failed:', error.message);
    }
};

module.exports = { sendAppointmentApproved, sendAppointmentRejected };