const nodemailer = require('nodemailer');

// create transporter using gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// function to send appointment approval email
const sendAppointmentApproved = async (visitorEmail, visitorName, date) => {
    try {
        // send email to visitor
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
                <p>Thank you!</p>
            `
        });
        console.log('Email sent to:', visitorEmail);
    } catch (error) {
        console.log('Email failed:', error.message);
    }
};

// function to send appointment rejection email
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
                <p>Please contact us for any query or more information.</p>
                <p>Thank you!</p>
            `
        });
        console.log('Email sent to:', visitorEmail);
    } catch (error) {
        console.log('Email failed:', error.message);
    }
};

module.exports = { sendAppointmentApproved, sendAppointmentRejected };