const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = [
    {
        name: 'Admin User',
        email: 'admin@vps.com',
        password: 'Admin@123',
        role: 'admin'
    },
    {
        name: 'Security Guard',
        email: 'security@vps.com',
        password: 'Admin@123',
        role: 'security'
    },
    {
        name: 'John Employee',
        email: 'employee@vps.com',
        password: 'Admin@123',
        role: 'employee'
    },
    {
        name: 'Jane Visitor',
        email: 'visitor@vps.com',
        password: 'Admin@123',
        role: 'visitor'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // clear existing users
        await User.deleteMany();
        console.log('Cleared existing users');

        // create one by one so pre('save') hook runs and hashes password
        await User.create({ name: 'Admin User', email: 'admin@vps.com', password: 'Admin@123', role: 'admin' });
        await User.create({ name: 'Security Guard', email: 'security@vps.com', password: 'Admin@123', role: 'security' });
        await User.create({ name: 'John Employee', email: 'employee@vps.com', password: 'Admin@123', role: 'employee' });
        await User.create({ name: 'Jane Visitor', email: 'visitor@vps.com', password: 'Admin@123', role: 'visitor' });

        console.log('Demo users created successfully');
        console.log('Admin    → admin@vps.com / Admin@123');
        console.log('Security → security@vps.com / Admin@123');
        console.log('Employee → employee@vps.com / Admin@123');
        console.log('Visitor  → visitor@vps.com / Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedDB();