const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Sample seed data for users   
const seedData = [
    {
        name: 'Gyanwi Gupta',
        email: 'gyanwi17gupta@gmail.com',
        password: 'gg@123',
        role: 'admin'
    },
    {
        name: 'Rupak Saha',
        email: 'rs@gmail.com',
        password: 'rs@123',
        role: 'security'
    },
    {
        name: 'P. Shruthi',
        email: 'ps@gmail.com',
        password: 'ps@123',
        role: 'employee'
    },
    {
        name: 'R. Gupta',
        email: 'rg@gmail.com',
        password: 'rg@123',
        role: 'visitor'
    }
];

// Function to seed the database    
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // clear existing users
        await User.deleteMany();

        // create one by one so pre('save') hook runs and hashes password
        await User.create({ name: 'Gyanwi Gupta', email: 'gyanwi17gupta@gmail.com', password: 'gg@123', role: 'admin' });
        await User.create({ name: 'Rupak Saha', email: 'rs@gmail.com', password: 'rs@123', role: 'security' });
        await User.create({ name: 'P. Shruthi', email: 'ps@gmail.com', password: 'ps@123', role: 'employee' });
        await User.create({ name: 'R. Gupta', email: 'rg@gmail.com', password: 'rg@123', role: 'visitor' });

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedDB();