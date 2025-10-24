require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Route = require('./models/Route');
const Bin = require('./models/Bin'); // Add this

async function testCollectorRoutes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');
    console.log('🧪 Simulating getMyRoutes Controller Logic\n');
    console.log('='.repeat(60) + '\n');
    
    // Step 1: Get a collector from database
    console.log('Step 1: Finding Jhon (collector)...');
    const collector = await User.findOne({ username: 'jhon' });
    
    if (!collector) {
      console.log('❌ Collector not found!');
      await mongoose.connection.close();
      process.exit(1);
    }
    
    console.log('✅ Found collector:');
    console.log(`   Name: ${collector.firstName} ${collector.lastName}`);
    console.log(`   Role: ${collector.role}`);
    console.log(`   ID: ${collector._id}\n`);
    
    // Step 2: Simulate the getMyRoutes query (what the backend does)
    console.log('Step 2: Simulating getMyRoutes query...');
    console.log(`   Query: { assignedTo: ObjectId("${collector._id}") }\n`);
    
    const filter = { assignedTo: collector._id };
    const routes = await Route.find(filter)
      .populate('bins.bin', 'binId location zone binType fillLevel coordinates')
      .populate('createdBy', 'firstName lastName')
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    
    console.log(`✅ Routes found: ${routes.length}\n`);
    
    if (routes.length > 0) {
      console.log('📋 Routes assigned to Jhon:');
      routes.forEach((route, idx) => {
        console.log(`\n${idx + 1}. ${route.routeName}`);
        console.log(`   ID: ${route._id}`);
        console.log(`   Status: ${route.status}`);
        console.log(`   Bins: ${route.bins.length}`);
        console.log(`   Scheduled: ${route.scheduledDate} at ${route.scheduledTime}`);
        console.log(`   assignedTo (raw): ${route.assignedTo}`);
      });
    } else {
      console.log('⚠️  No routes found for this collector!\n');
      console.log('Debugging information:');
      console.log(`   Collector ID type: ${typeof collector._id}`);
      console.log(`   Collector ID value: ${collector._id}`);
      console.log(`   Collector ID is ObjectId: ${collector._id instanceof mongoose.Types.ObjectId}\n`);
      
      // Try to find routes with this collector's ID in ANY way
      console.log('Attempting alternative queries...\n');
      
      const routesAlt1 = await Route.find({ 'assignedTo': collector._id.toString() });
      console.log(`   Query with string ID: ${routesAlt1.length} routes`);
      
      const routesAlt2 = await Route.find().populate('assignedTo');
      const matchingRoutes = routesAlt2.filter(r => 
        r.assignedTo && r.assignedTo._id.toString() === collector._id.toString()
      );
      console.log(`   Manual filter after populate: ${matchingRoutes.length} routes\n`);
      
      if (matchingRoutes.length > 0) {
        console.log('Found routes with manual filter:');
        matchingRoutes.forEach(r => {
          console.log(`   - ${r.routeName}: assignedTo = ${r.assignedTo._id}`);
        });
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETE\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testCollectorRoutes();

