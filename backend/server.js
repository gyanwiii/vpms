const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors= require("cors");

dotenv.config();

// Import routes
const authRoutes = require('./routes/AuthRoutes');
const visitorRoutes = require('./routes/VisitorRoutes');
const appointmentRoutes = require('./routes/AppointmentRoutes');
const passRoutes = require('./routes/PassRoutes');
const reportRoutes = require('./routes/ReportRoutes');
const path=require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/reports', reportRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to our application!" });
});

// PORT No.
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT} and connected to MongoDB`);
  })
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});