require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected\n');
    
    // Find all collectors
    const collectors = await User.find({ role: 'collector' });
    
    console.log(`📊 All Collectors in Database (${collectors.length}):\n`);
    
    if (collectors.length === 0) {
      console.log('❌ No collectors found');
    } else {
      collectors.forEach((collector, index) => {
        console.log(`${index + 1}. ${collector.firstName} ${collector.lastName}`);
        console.log(`   ID: ${collector._id}`);
        console.log(`   Email: ${collector.email}`);
        console.log(`   Username: ${collector.username}`);
        console.log(`   Phone: ${collector.phoneNo}\n`);
      });
    }
    
    await mongoose.connection.close();
    console.log('✅ Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
