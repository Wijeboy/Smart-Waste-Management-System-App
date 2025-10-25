require('dotenv').config();
const mongoose = require('mongoose');
const Bin = require('./models/Bin');
const Route = require('./models/Route');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  // Check Users
  const users = await User.find({});
  console.log('👥 USERS:', users.length);
  users.forEach(u => {
    console.log(`   - ${u.firstName} ${u.lastName} (${u.role})`);
  });
  
  // Check Bins
  const bins = await Bin.find({});
  console.log('\n📦 BINS:', bins.length);
  const binsByType = await Bin.aggregate([
    { $group: { _id: '$binType', count: { $sum: 1 } } }
  ]);
  binsByType.forEach(b => {
    console.log(`   - ${b._id}: ${b.count}`);
  });
  
  // Show first 3 bins
  console.log('\n   First 3 bins:');
  bins.slice(0, 3).forEach(b => {
    console.log(`   - ${b.binId}: ${b.binType}, Fill: ${b.fillLevel}%, Capacity: ${b.capacity}kg`);
  });
  
  // Check Routes
  const routes = await Route.find({});
  console.log('\n🚛 ROUTES:', routes.length);
  const routesByStatus = await Route.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  routesByStatus.forEach(r => {
    console.log(`   - ${r._id}: ${r.count}`);
  });
  
  // Check completed routes with analytics fields
  const completedRoutes = await Route.find({ status: 'completed' });
  console.log('\n📊 COMPLETED ROUTES:', completedRoutes.length);
  
  if (completedRoutes.length > 0) {
    console.log('\n   Sample completed route:');
    const sample = completedRoutes[0];
    console.log(`   - Name: ${sample.routeName}`);
    console.log(`   - Status: ${sample.status}`);
    console.log(`   - Bins Collected: ${sample.binsCollected || 'NOT SET'}`);
    console.log(`   - Waste Collected: ${sample.wasteCollected || 'NOT SET'}kg`);
    console.log(`   - Recyclable: ${sample.recyclableWaste || 'NOT SET'}kg`);
    console.log(`   - Efficiency: ${sample.efficiency || 'NOT SET'}%`);
    console.log(`   - Satisfaction: ${sample.satisfaction || 'NOT SET'}/5`);
    console.log(`   - Completed At: ${sample.completedAt || 'NOT SET'}`);
    
    // Count how many have analytics data
    const withBinsCollected = completedRoutes.filter(r => r.binsCollected && r.binsCollected > 0).length;
    const withWaste = completedRoutes.filter(r => r.wasteCollected && r.wasteCollected > 0).length;
    console.log(`\n   Routes with binsCollected > 0: ${withBinsCollected}/${completedRoutes.length}`);
    console.log(`   Routes with wasteCollected > 0: ${withWaste}/${completedRoutes.length}`);
  }
  
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
