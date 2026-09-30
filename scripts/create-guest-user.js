import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Load environment variables
dotenv.config();

// Use public DNS to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createGuestUser = async () => {
  try {
    // Check if guest user already exists
    const existingUser = await User.findOne({ email: 'guest@interview.com' });
    
    if (existingUser) {
      console.log('Guest user already exists');
      process.exit(0);
    }
    
    // Create salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('guestPassword123!', salt);
    
    // Create guest user
    const guestUser = new User({
      fullName: 'Guest Interviewer',
      username: 'guest_interviewer',
      email: 'guest@interview.com',
      password: hashedPassword,
      profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    });
    
    // Save guest user
    await guestUser.save();
    
    console.log('Guest user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating guest user:', error.message);
    process.exit(1);
  }
};

// Run the function
createGuestUser(); 