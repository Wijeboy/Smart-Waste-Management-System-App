const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bin = require('../models/Bin');

// Load environment variables
dotenv.config();

// Sample bin data
const bins = [
  {
    binId: 'BIN001',
    location: 'Colombo 01 - Fort Area',
    zone: 'Zone A',
    binType: 'General Waste',
    capacity: 100,
    status: 'active',
    fillLevel: 45,
    weight: 45,
    coordinates: { lat: 6.9271, lng: 79.8612 },
    registrationDate: new Date('2024-01-10'),
    lastCollection: new Date('2024-02-15')
  },
  {
    binId: 'BIN002',
    location: 'Colombo 02 - Slave Island',
    zone: 'Zone A',
    binType: 'Recyclable',
    capacity: 80,
    status: 'active',
    fillLevel: 78,
    weight: 62,
    coordinates: { lat: 6.9200, lng: 79.8500 },
    registrationDate: new Date('2024-01-12'),
    lastCollection: new Date('2024-02-14')
  },
  {
    binId: 'BIN003',
    location: 'Colombo 03 - Kollupitiya',
    zone: 'Zone B',
    binType: 'General Waste',
    capacity: 120,
    status: 'active',
    fillLevel: 92,
    weight: 110,
    coordinates: { lat: 6.9100, lng: 79.8400 },
    registrationDate: new Date('2024-01-15'),
    lastCollection: new Date('2024-02-13')
  },
  {
    binId: 'BIN004',
    location: 'Colombo 04 - Bambalapitiya',
    zone: 'Zone B',
    binType: 'Organic',
    capacity: 90,
    status: 'active',
    fillLevel: 65,
    weight: 58,
    coordinates: { lat: 6.9000, lng: 79.8300 },
    registrationDate: new Date('2024-01-18'),
    lastCollection: new Date('2024-02-12')
  },
  {
    binId: 'BIN005',
    location: 'Colombo 05 - Wellawatta',
    zone: 'Zone C',
    binType: 'General Waste',
    capacity: 110,
    status: 'active',
    fillLevel: 88,
    weight: 96,
    coordinates: { lat: 6.8900, lng: 79.8200 },
    registrationDate: new Date('2024-01-20'),
    lastCollection: new Date('2024-02-11')
  },
  {
    binId: 'BIN006',
    location: 'Colombo 06 - Pamankada',
    zone: 'Zone C',
    binType: 'Recyclable',
    capacity: 85,
    status: 'active',
    fillLevel: 55,
    weight: 46,
    coordinates: { lat: 6.8800, lng: 79.8100 },
    registrationDate: new Date('2024-01-22'),
    lastCollection: new Date('2024-02-10')
  },
  {
    binId: 'BIN007',
    location: 'Colombo 07 - Cinnamon Gardens',
    zone: 'Zone D',
    binType: 'General Waste',
    capacity: 95,
    status: 'active',
    fillLevel: 40,
    weight: 38,
    coordinates: { lat: 6.8700, lng: 79.8000 },
    registrationDate: new Date('2024-01-25'),
    lastCollection: new Date('2024-02-09')
  },
  {
    binId: 'BIN008',
    location: 'Colombo 08 - Borella',
    zone: 'Zone D',
    binType: 'Organic',
    capacity: 100,
    status: 'full',
    fillLevel: 95,
    weight: 95,
    coordinates: { lat: 6.8600, lng: 79.7900 },
    registrationDate: new Date('2024-01-28'),
    lastCollection: new Date('2024-02-08')
  },
  {
    binId: 'BIN009',
    location: 'Colombo 09 - Dematagoda',
    zone: 'Zone A',
    binType: 'Hazardous',
    capacity: 50,
    status: 'active',
    fillLevel: 30,
    weight: 15,
    coordinates: { lat: 6.8500, lng: 79.7800 },
    registrationDate: new Date('2024-02-01'),
    lastCollection: new Date('2024-02-07')
  },
  {
    binId: 'BIN010',
    location: 'Colombo 10 - Maradana',
    zone: 'Zone B',
    binType: 'Recyclable',
    capacity: 80,
    status: 'maintenance',
    fillLevel: 20,
    weight: 16,
    coordinates: { lat: 6.8400, lng: 79.7700 },
    registrationDate: new Date('2024-02-03'),
    lastCollection: new Date('2024-02-06')
  }
];

// Seed function
const seedBins = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing bins
    console.log('Clearing existing bins...');
    await Bin.deleteMany({});
    console.log('✅ Existing bins cleared');

    // Insert new bins
    console.log('Inserting sample bins...');
    const createdBins = await Bin.insertMany(bins);
    console.log(`✅ ${createdBins.length} sample bins inserted`);

    // Display summary
    console.log('\n📊 Bins Summary:');
    console.log(`   Total: ${createdBins.length}`);
    console.log(`   Active: ${createdBins.filter(b => b.status === 'active').length}`);
    console.log(`   Full: ${createdBins.filter(b => b.status === 'full').length}`);
    console.log(`   Maintenance: ${createdBins.filter(b => b.status === 'maintenance').length}`);
    
    console.log('\n📦 By Type:');
    const types = [...new Set(createdBins.map(b => b.binType))];
    types.forEach(type => {
      const count = createdBins.filter(b => b.binType === type).length;
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n🗺️  By Zone:');
    const zones = [...new Set(createdBins.map(b => b.zone))];
    zones.forEach(zone => {
      const count = createdBins.filter(b => b.zone === zone).length;
      console.log(`   ${zone}: ${count}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bins:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBins();
