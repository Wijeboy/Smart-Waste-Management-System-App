require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('./models/Route');
const User = require('./models/User');
const Bin = require('./models/Bin');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected\n');
    console.log('='.repeat(60));
    console.log('ROUTE ASSIGNMENT VERIFICATION TEST');
    console.log('='.repeat(60) + '\n');
    
    // Step 1: List all collectors
    const collectors = await User.find({ role: 'collector' });
    console.log(`📊 STEP 1: Available Collectors (${collectors.length})`);
    console.log('-'.repeat(60));
    collectors.forEach((collector, index) => {
      console.log(`${index + 1}. ${collector.firstName} ${collector.lastName}`);
      console.log(`   ID: ${collector._id}`);
      console.log(`   Email: ${collector.email}\n`);
    });
    
    // Step 2: List all routes and their assignments
    const routes = await Route.find()
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 }); // Most recent first
    
    console.log(`\n📋 STEP 2: All Routes (${routes.length})`);
    console.log('-'.repeat(60));
    routes.forEach((route, index) => {
      console.log(`${index + 1}. "${route.routeName}" [${route.status}]`);
      console.log(`   Route ID: ${route._id}`);
      console.log(`   Created: ${route.createdAt}`);
      console.log(`   Created By: ${route.createdBy ? route.createdBy.firstName + ' ' + route.createdBy.lastName : 'Unknown'}`);
      console.log(`   Assigned To: ${route.assignedTo ? route.assignedTo.firstName + ' ' + route.assignedTo.lastName + ' (' + route.assignedTo._id + ')' : '❌ NOT ASSIGNED (null)'}`);
      console.log(`   Bins: ${route.bins.length}`);
      console.log('');
    });
    
    // Step 3: Check each collector's routes
    console.log(`\n📦 STEP 3: Routes Per Collector`);
    console.log('-'.repeat(60));
    for (const collector of collectors) {
      const collectorRoutes = await Route.find({ assignedTo: collector._id })
        .populate('bins.bin', 'binId location');
      
      console.log(`\n👤 ${collector.firstName} ${collector.lastName} (${collector._id})`);
      console.log(`   Email: ${collector.email}`);
      console.log(`   Assigned Routes: ${collectorRoutes.length}`);
      
      if (collectorRoutes.length > 0) {
        collectorRoutes.forEach((route, idx) => {
          console.log(`   ${idx + 1}. ${route.routeName} [${route.status}] - ${route.bins.length} bins`);
        });
      } else {
        console.log(`   ⚠️  No routes assigned`);
      }
    }
    
    // Step 4: Check for orphaned routes (not assigned to anyone)
    const unassignedRoutes = await Route.find({ assignedTo: null });
    console.log(`\n\n⚠️  STEP 4: Unassigned Routes`);
    console.log('-'.repeat(60));
    console.log(`Total unassigned routes: ${unassignedRoutes.length}\n`);
    if (unassignedRoutes.length > 0) {
      unassignedRoutes.forEach((route, idx) => {
        console.log(`${idx + 1}. "${route.routeName}" [${route.status}]`);
        console.log(`   Created: ${route.createdAt}`);
        console.log(`   Bins: ${route.bins.length}\n`);
      });
    }
    
    // Step 5: Verify the assignedTo field structure
    console.log(`\n🔍 STEP 5: Field Type Verification`);
    console.log('-'.repeat(60));
    if (routes.length > 0) {
      const sampleRoute = routes[0];
      console.log(`Sample route: "${sampleRoute.routeName}"`);
      console.log(`assignedTo field type: ${typeof sampleRoute.assignedTo}`);
      console.log(`assignedTo value: ${sampleRoute.assignedTo}`);
      console.log(`assignedTo is ObjectId: ${sampleRoute.assignedTo instanceof mongoose.Types.ObjectId}`);
      
      if (sampleRoute.assignedTo) {
        console.log(`Collector ID: ${sampleRoute.assignedTo._id}`);
        console.log(`Collector Name: ${sampleRoute.assignedTo.firstName} ${sampleRoute.assignedTo.lastName}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETE');
    console.log('='.repeat(60) + '\n');
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
