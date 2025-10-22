/**
 * One-time script to fix existing users with role 'user' to 'collector'
 * Run this with: node scripts/fixUserRoles.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars - use path to parent directory's .env
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const fixUserRoles = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('ERROR: MONGODB_URI not found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    // Find all users with role 'user'
    const usersWithUserRole = await User.find({ role: 'user' });
    
    console.log(`Found ${usersWithUserRole.length} users with role 'user'`);

    // Update them to 'collector'
    const result = await User.updateMany(
      { role: 'user' },
      { $set: { role: 'collector' } }
    );

    console.log(`Updated ${result.modifiedCount} users from 'user' to 'collector'`);
    
    // Display updated users
    const updatedUsers = await User.find({ role: 'collector' }).select('firstName lastName username email role');
    console.log('\nUpdated users:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.username}) - ${user.email} - Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserRoles();
