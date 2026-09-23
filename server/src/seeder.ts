import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Check if any admin user already exists in the database
    const adminExists = await User.findOne({ role: 'ADMIN' });
    
    if (adminExists) {
      console.log('An Administrator account already exists in database. Skipping seeding.');
      process.exit();
    }

    const adminUser = new User({
      name: 'System Administrator',
      email: process.env.INITIAL_ADMIN_EMAIL,
      password: process.env.INITIAL_ADMIN_PASSWORD,
      role: 'ADMIN',
    });

    await adminUser.save();

    console.log('Initial administrator user created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
