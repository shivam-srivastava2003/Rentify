import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@roomfinder.com' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@roomfinder.com',
      password: 'AdminPassword123!',
      role: 'ADMIN',
    });

    await adminUser.save();

    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
