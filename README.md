# Visitor Pass Management System

A MERN stack application to manage visitor passes digitally.

## Setup Instructions

### Backend
    cd backend
    npm install
    node seed.js
    node server.js

### Frontend
    cd frontend
    npm install
    npm start

## Demo Accounts
- Admin: admin@vps.com / Admin@123
- Security: security@vps.com / Admin@123
- Employee: employee@vps.com / Admin@123
- Visitor: visitor@vps.com / Admin@123

## Features
1. JWT Authentication with role-based access
2. Visitor registration with photo upload
3. Appointment scheduling with email notifications
4. Pass issuance with QR code and PDF badge
5. QR code scanning for check-in/check-out
6. Dashboard with reports and analytics

## Tech Stack
- MongoDB, Express, React, Node.js
- JWT, bcryptjs, nodemailer, qrcode, pdfkit, multer