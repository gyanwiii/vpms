# Visitor Pass Management System

A MERN stack application to manage visitor passes digitally.

## Video Description Link:- https://drive.google.com/file/d/1yJX1js8bZ8gCEgaPsaNl3m8NXbsKepQw/view?usp=sharing

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
- Admin: gyanwi17gupta@gmail.com / gg@123
- Security: rs@gmail.com / rs@123
- Employee: ps@gmail.com / ps@123
- Visitor: rg@gmail.com / rg@123

## Environmental Variables Used
- PORT
- MONGO_URI
- SECRET_KEY
- EMAIL_USER
- EMAIL_PASS

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