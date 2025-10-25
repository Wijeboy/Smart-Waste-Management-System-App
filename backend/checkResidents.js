const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkResidents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const residents = await User.find({ role: 'resident' }).select('_id firstName lastName email creditPoints');
    console.log('\nResidents found:', residents.length);
    
    residents.forEach(resident => {
      console.log('\n---');
      console.log('ID:', resident._id);
      console.log('Name:', resident.firstName, resident.lastName);
      console.log('Email:', resident.email);
      console.log('Credit Points:', resident.creditPoints || 0);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkResidents();
