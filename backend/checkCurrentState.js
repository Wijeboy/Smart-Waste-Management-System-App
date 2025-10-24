require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('./models/Route');
const Bin = require('./models/Bin');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  // Check all completed routes
  const completedRoutes = await Route.find({ status: 'completed' }).populate('bins.bin');
  
  console.log(`📊 COMPLETED ROUTES: ${completedRoutes.length}\n`);
  
  completedRoutes.forEach((route, index) => {
    console.log(`${index + 1}. ${route.routeName}`);
    console.log(`   Status: ${route.status}`);
    console.log(`   Bins Collected: ${route.binsCollected}`);
    console.log(`   Waste Collected: ${route.wasteCollected}kg`);
    console.log(`   Recyclable: ${route.recyclableWaste}kg`);
    console.log(`   Efficiency: ${route.efficiency}%`);
    console.log(`   Bins in route: ${route.bins.length}`);
    
    route.bins.forEach(b => {
      if (b.bin) {
        console.log(`     - ${b.bin.binId}: ${b.status}, Fill: ${b.bin.fillLevel}%`);
      }
    });
    console.log('');
  });
  
  // Check all bins current fill levels
  const bins = await Bin.find({});
  console.log(`📦 ALL BINS (${bins.length}):\n`);
  bins.forEach(b => {
    console.log(`   ${b.binId}: ${b.binType}, Fill: ${b.fillLevel}%, Last Collection: ${b.lastCollection ? new Date(b.lastCollection).toLocaleTimeString() : 'Never'}`);
  });
  
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
