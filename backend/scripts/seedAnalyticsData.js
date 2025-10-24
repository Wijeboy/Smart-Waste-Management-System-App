/**
 * Seed Analytics Data
 * Adds realistic test data to demonstrate analytics functionality
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Bin = require('../models/Bin');
const Route = require('../models/Route');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

async function seedData() {
  try {
    console.log('\n🌱 Starting to seed analytics data...\n');

    // Get existing users
    const admin = await User.findOne({ role: 'admin' });
    const collector = await User.findOne({ role: 'collector' });

    if (!admin || !collector) {
      console.error('❌ Error: Admin or Collector user not found!');
      console.log('Please ensure you have admin and collector users in the database.');
      process.exit(1);
    }

    console.log(`👤 Found Admin: ${admin.firstName} ${admin.lastName}`);
    console.log(`👤 Found Collector: ${collector.firstName} ${collector.lastName}\n`);

    // Clear existing test data
    console.log('🗑️  Clearing existing bins and routes...');
    await Bin.deleteMany({});
    await Route.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // =====================================================
    // SEED BINS
    // =====================================================
    console.log('📦 Creating bins...');
    
    const binsData = [
      // Organic Bins
      { binId: 'BIN-ORG-001', binType: 'Organic', location: '123 Main St, Colombo', zone: 'Zone A', coordinates: { lat: 6.9271, lng: 79.8612 }, capacity: 100, fillLevel: 85, status: 'full' },
      { binId: 'BIN-ORG-002', binType: 'Organic', location: '456 Galle Rd, Colombo', zone: 'Zone A', coordinates: { lat: 6.9147, lng: 79.8500 }, capacity: 100, fillLevel: 60, status: 'active' },
      { binId: 'BIN-ORG-003', binType: 'Organic', location: '789 Kandy Rd, Kaduwela', zone: 'Zone B', coordinates: { lat: 6.9333, lng: 79.9833 }, capacity: 150, fillLevel: 45, status: 'active' },
      { binId: 'BIN-ORG-004', binType: 'Organic', location: '321 Negombo Rd, Wattala', zone: 'Zone C', coordinates: { lat: 6.9897, lng: 79.8914 }, capacity: 100, fillLevel: 90, status: 'full' },
      
      // Recyclable Bins
      { binId: 'BIN-REC-001', binType: 'Recyclable', location: '111 Park St, Colombo', zone: 'Zone A', coordinates: { lat: 6.9200, lng: 79.8700 }, capacity: 120, fillLevel: 70, status: 'active' },
      { binId: 'BIN-REC-002', binType: 'Recyclable', location: '222 Lake Rd, Colombo', zone: 'Zone A', coordinates: { lat: 6.9100, lng: 79.8600 }, capacity: 120, fillLevel: 55, status: 'active' },
      { binId: 'BIN-REC-003', binType: 'Recyclable', location: '333 Hill St, Dehiwala', zone: 'Zone B', coordinates: { lat: 6.8571, lng: 79.8682 }, capacity: 100, fillLevel: 80, status: 'full' },
      { binId: 'BIN-REC-004', binType: 'Recyclable', location: '444 Beach Rd, Mount Lavinia', zone: 'Zone B', coordinates: { lat: 6.8385, lng: 79.8638 }, capacity: 120, fillLevel: 40, status: 'active' },
      { binId: 'BIN-REC-005', binType: 'Recyclable', location: '555 Station Rd, Nugegoda', zone: 'Zone C', coordinates: { lat: 6.8649, lng: 79.8997 }, capacity: 100, fillLevel: 65, status: 'active' },
      
      // General Waste Bins
      { binId: 'BIN-GEN-001', binType: 'General Waste', location: '777 Market St, Pettah', zone: 'Zone D', coordinates: { lat: 6.9378, lng: 79.8536 }, capacity: 200, fillLevel: 75, status: 'active' },
      { binId: 'BIN-GEN-002', binType: 'General Waste', location: '888 School Rd, Maharagama', zone: 'Zone C', coordinates: { lat: 6.8481, lng: 79.9265 }, capacity: 150, fillLevel: 50, status: 'active' },
      { binId: 'BIN-GEN-003', binType: 'General Waste', location: '999 Temple Rd, Kotte', zone: 'Zone B', coordinates: { lat: 6.8905, lng: 79.9040 }, capacity: 200, fillLevel: 85, status: 'full' },
      { binId: 'BIN-GEN-004', binType: 'General Waste', location: '101 Office Park, Battaramulla', zone: 'Zone B', coordinates: { lat: 6.8989, lng: 79.9189 }, capacity: 150, fillLevel: 60, status: 'active' },
      
      // Hazardous Bins
      { binId: 'BIN-HAZ-001', binType: 'Hazardous', location: '202 Hospital Rd, Colombo', zone: 'Zone A', coordinates: { lat: 6.9214, lng: 79.8574 }, capacity: 50, fillLevel: 30, status: 'active' },
      { binId: 'BIN-HAZ-002', binType: 'Hazardous', location: '303 Industrial Zone, Ja-Ela', zone: 'Zone D', coordinates: { lat: 7.0742, lng: 79.8919 }, capacity: 50, fillLevel: 45, status: 'active' },
    ];

    const bins = await Bin.insertMany(binsData);
    console.log(`✅ Created ${bins.length} bins`);
    console.log(`   - Organic: 4 bins`);
    console.log(`   - Recyclable: 5 bins`);
    console.log(`   - General: 4 bins`);
    console.log(`   - Hazardous: 2 bins\n`);

    // =====================================================
    // SEED ROUTES (Historical data for trends)
    // =====================================================
    console.log('🚛 Creating completed routes with historical data...');

    const now = new Date();
    const routesData = [];

    // Helper function to create route data
    const createRoute = (daysAgo, routeNum, binsCount, wasteKg, recyclableKg, efficiencyScore, satisfactionScore) => {
      const completedDate = new Date(now);
      completedDate.setDate(completedDate.getDate() - daysAgo);
      completedDate.setHours(14, 30, 0, 0); // 2:30 PM completion time
      
      const startDate = new Date(completedDate);
      startDate.setHours(8, 0, 0, 0); // 8:00 AM start time

      return {
        routeName: `Collection Route ${routeNum}`,
        createdBy: admin._id,
        assignedTo: collector._id,
        bins: [], // Empty for now, could be populated with actual bin IDs
        scheduledDate: startDate,
        scheduledTime: '08:00',
        status: 'completed',
        startedAt: startDate,
        completedAt: completedDate,
        notes: `Completed successfully. ${binsCount} bins collected, ${wasteKg}kg waste processed.`,
        // Custom fields for analytics (these will be added to the route document)
        binsCollected: binsCount,
        wasteCollected: wasteKg,
        recyclableWaste: recyclableKg,
        efficiency: efficiencyScore,
        satisfaction: satisfactionScore
      };
    };

    // Last 30 days of data (1-2 routes per day)
    let routeCounter = 1;
    
    // Week 4 (Last 7 days) - 12 routes
    for (let day = 0; day < 7; day++) {
      const routesPerDay = day % 2 === 0 ? 2 : 1; // Alternate between 1-2 routes
      for (let r = 0; r < routesPerDay; r++) {
        routesData.push(createRoute(
          day,
          routeCounter++,
          Math.floor(Math.random() * 5) + 6, // 6-10 bins
          Math.floor(Math.random() * 50) + 70, // 70-120 kg
          Math.floor(Math.random() * 30) + 20, // 20-50 kg recyclable
          Math.floor(Math.random() * 15) + 85, // 85-100% efficiency
          Math.floor(Math.random() * 2) + 3 // 3-5 satisfaction
        ));
      }
    }

    // Week 3 (8-14 days ago) - 11 routes
    for (let day = 7; day < 14; day++) {
      const routesPerDay = day % 3 === 0 ? 2 : 1;
      for (let r = 0; r < routesPerDay; r++) {
        routesData.push(createRoute(
          day,
          routeCounter++,
          Math.floor(Math.random() * 5) + 5, // 5-9 bins
          Math.floor(Math.random() * 45) + 65, // 65-110 kg
          Math.floor(Math.random() * 25) + 18, // 18-43 kg recyclable
          Math.floor(Math.random() * 15) + 82, // 82-97% efficiency
          Math.floor(Math.random() * 2) + 3 // 3-5 satisfaction
        ));
      }
    }

    // Week 2 (15-21 days ago) - 10 routes
    for (let day = 14; day < 21; day++) {
      const routesPerDay = day % 2 === 0 ? 2 : 1;
      for (let r = 0; r < routesPerDay; r++) {
        routesData.push(createRoute(
          day,
          routeCounter++,
          Math.floor(Math.random() * 4) + 6, // 6-9 bins
          Math.floor(Math.random() * 40) + 60, // 60-100 kg
          Math.floor(Math.random() * 22) + 15, // 15-37 kg recyclable
          Math.floor(Math.random() * 15) + 80, // 80-95% efficiency
          Math.floor(Math.random() * 2) + 3 // 3-5 satisfaction
        ));
      }
    }

    // Week 1 (22-28 days ago) - 9 routes
    for (let day = 21; day < 28; day++) {
      const routesPerDay = day % 3 === 0 ? 2 : 1;
      for (let r = 0; r < routesPerDay; r++) {
        routesData.push(createRoute(
          day,
          routeCounter++,
          Math.floor(Math.random() * 4) + 5, // 5-8 bins
          Math.floor(Math.random() * 35) + 55, // 55-90 kg
          Math.floor(Math.random() * 20) + 12, // 12-32 kg recyclable
          Math.floor(Math.random() * 15) + 78, // 78-93% efficiency
          Math.floor(Math.random() * 2) + 3 // 3-5 satisfaction
        ));
      }
    }

    const routes = await Route.insertMany(routesData);
    console.log(`✅ Created ${routes.length} completed routes over the past 28 days`);
    
    // Calculate statistics
    const totalBinsCollected = routes.reduce((sum, r) => sum + r.binsCollected, 0);
    const totalWaste = routes.reduce((sum, r) => sum + r.wasteCollected, 0);
    const totalRecyclable = routes.reduce((sum, r) => sum + r.recyclableWaste, 0);
    const avgEfficiency = Math.round(routes.reduce((sum, r) => sum + r.efficiency, 0) / routes.length);
    const avgSatisfaction = (routes.reduce((sum, r) => sum + r.satisfaction, 0) / routes.length).toFixed(1);

    console.log(`   - Total bins collected: ${totalBinsCollected}`);
    console.log(`   - Total waste collected: ${totalWaste}kg`);
    console.log(`   - Recyclable waste: ${totalRecyclable}kg`);
    console.log(`   - Recycling rate: ${Math.round((totalRecyclable / totalWaste) * 100)}%`);
    console.log(`   - Average efficiency: ${avgEfficiency}%`);
    console.log(`   - Average satisfaction: ${avgSatisfaction}/5\n`);

    // Create some active/scheduled routes for current stats
    console.log('📋 Creating active and scheduled routes...');
    
    const activeRoutesData = [
      {
        routeName: `North Zone Collection ${routeCounter++}`,
        createdBy: admin._id,
        assignedTo: collector._id,
        bins: [],
        scheduledDate: new Date(),
        scheduledTime: '09:00',
        status: 'in-progress',
        startedAt: new Date(),
        notes: 'Active collection in progress'
      },
      {
        routeName: `South Zone Collection ${routeCounter++}`,
        createdBy: admin._id,
        assignedTo: collector._id,
        bins: [],
        scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledTime: '08:00',
        status: 'scheduled',
        notes: 'Scheduled for tomorrow'
      },
      {
        routeName: `East Zone Collection ${routeCounter++}`,
        createdBy: admin._id,
        bins: [],
        scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
        scheduledTime: '10:00',
        status: 'scheduled',
        notes: 'Scheduled for next week'
      }
    ];

    await Route.insertMany(activeRoutesData);
    console.log(`✅ Created ${activeRoutesData.length} active/scheduled routes\n`);

    // =====================================================
    // SUMMARY
    // =====================================================
    console.log('📊 ═══════════════════════════════════════════════════');
    console.log('📊 DATA SEEDING COMPLETE!');
    console.log('📊 ═══════════════════════════════════════════════════\n');

    const finalStats = await Promise.all([
      Bin.countDocuments(),
      Route.countDocuments(),
      Route.countDocuments({ status: 'completed' }),
      Route.countDocuments({ status: 'in_progress' }),
      Route.countDocuments({ status: 'scheduled' }),
    ]);

    console.log('📦 BINS:');
    console.log(`   Total: ${finalStats[0]}`);
    console.log(`   - Organic: ${await Bin.countDocuments({ binType: 'organic' })}`);
    console.log(`   - Recyclable: ${await Bin.countDocuments({ binType: 'recyclable' })}`);
    console.log(`   - General: ${await Bin.countDocuments({ binType: 'general' })}`);
    console.log(`   - Hazardous: ${await Bin.countDocuments({ binType: 'hazardous' })}`);
    console.log(`   - Full Bins: ${await Bin.countDocuments({ status: 'full' })}\n`);

    console.log('🚛 ROUTES:');
    console.log(`   Total: ${finalStats[1]}`);
    console.log(`   - Completed: ${finalStats[2]}`);
    console.log(`   - In Progress: ${finalStats[3]}`);
    console.log(`   - Scheduled: ${finalStats[4]}\n`);

    console.log('✅ Your analytics dashboard will now show:');
    console.log('   ✓ Real bin statistics');
    console.log('   ✓ Collection trends over 4 weeks');
    console.log('   ✓ Waste distribution by type');
    console.log('   ✓ Route performance metrics');
    console.log('   ✓ Recycling rate calculations\n');

    console.log('🎉 Ready to test! Open your app and navigate to Analytics Dashboard.\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedData();

