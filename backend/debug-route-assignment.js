require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('./models/Route');
const User = require('./models/User');
const Bin = require('./models/Bin');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected\n');
    
    // Find a collector
    const collector = await User.findOne({ role: 'collector' });
    if (!collector) {
      console.log('❌ No collector found in database');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log('📊 Collector found:');
    console.log(`   ID: ${collector._id}`);
    console.log(`   Name: ${collector.firstName} ${collector.lastName}`);
    console.log(`   Email: ${collector.email}\n`);
    
    // Find routes assigned to this collector
    const assignedRoutes = await Route.find({ assignedTo: collector._id })
      .populate('bins.bin', 'binId location')
      .populate('assignedTo', 'firstName lastName email');
    
    console.log(`📋 Routes assigned to ${collector.firstName}:`);
    console.log(`   Total: ${assignedRoutes.length}\n`);
    
    if (assignedRoutes.length > 0) {
      assignedRoutes.forEach((route, index) => {
        console.log(`   ${index + 1}. Route: ${route.routeName}`);
        console.log(`      Status: ${route.status}`);
        console.log(`      Assigned To: ${route.assignedTo ? route.assignedTo.firstName + ' ' + route.assignedTo.lastName : 'None'}`);
        console.log(`      Bins: ${route.bins.length}`);
        console.log(`      Created: ${route.createdAt}\n`);
      });
    } else {
      console.log('   ⚠️ No routes assigned to this collector\n');
    }
    
    // Check all routes
    const allRoutes = await Route.find()
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');
    
    console.log(`\n📊 All Routes in Database (${allRoutes.length}):`);
    allRoutes.forEach((route, index) => {
      console.log(`\n   ${index + 1}. ${route.routeName}`);
      console.log(`      ID: ${route._id}`);
      console.log(`      Status: ${route.status}`);
      console.log(`      Created By: ${route.createdBy ? route.createdBy.firstName + ' ' + route.createdBy.lastName : 'Unknown'}`);
      console.log(`      Assigned To: ${route.assignedTo ? route.assignedTo.firstName + ' ' + route.assignedTo.lastName + ' (' + route.assignedTo._id + ')' : 'None (null)'}`);
      console.log(`      assignedTo field value: ${route.assignedTo}`);
      console.log(`      Bins: ${route.bins.length}`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Done');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
