require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('./models/Route');
const Bin = require('./models/Bin');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  // Find the completed route
  const completedRoute = await Route.findOne({ status: 'completed' }).populate('bins.bin');
  
  if (!completedRoute) {
    console.log('❌ No completed route found');
    await mongoose.connection.close();
    process.exit(0);
  }
  
  console.log(`📊 Updating route: ${completedRoute.routeName}`);
  console.log(`   Bins in route: ${completedRoute.bins.length}`);
  
  // Calculate analytics
  const collectedBins = completedRoute.bins.filter(b => b.status === 'collected');
  const binsCollected = collectedBins.length;
  
  let wasteCollected = 0;
  let recyclableWaste = 0;
  
  console.log(`\n   Collected bins: ${binsCollected}`);
  
  collectedBins.forEach(binItem => {
    if (binItem.bin) {
      console.log(`   - ${binItem.bin.binId}: ${binItem.bin.binType}, Fill: ${binItem.bin.fillLevel}%, Cap: ${binItem.bin.capacity}kg`);
      const binWaste = (binItem.bin.fillLevel / 100) * binItem.bin.capacity;
      wasteCollected += binWaste;
      
      if (binItem.bin.binType === 'Recyclable') {
        recyclableWaste += binWaste;
      }
    }
  });
  
  const efficiency = completedRoute.bins.length > 0 
    ? Math.round((binsCollected / completedRoute.bins.length) * 100) 
    : 0;
  
  // Update the route
  completedRoute.binsCollected = binsCollected;
  completedRoute.wasteCollected = Math.round(wasteCollected);
  completedRoute.recyclableWaste = Math.round(recyclableWaste);
  completedRoute.efficiency = efficiency;
  completedRoute.satisfaction = 4; // Default good rating
  completedRoute.startTime = completedRoute.startedAt || completedRoute.scheduledDate;
  completedRoute.endTime = completedRoute.completedAt;
  
  await completedRoute.save();
  
  console.log(`\n✅ Route updated with analytics:`);
  console.log(`   - Bins Collected: ${binsCollected}`);
  console.log(`   - Waste Collected: ${Math.round(wasteCollected)}kg`);
  console.log(`   - Recyclable Waste: ${Math.round(recyclableWaste)}kg`);
  console.log(`   - Efficiency: ${efficiency}%`);
  console.log(`   - Satisfaction: 4/5`);
  
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
