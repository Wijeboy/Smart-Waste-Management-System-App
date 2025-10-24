require('dotenv').config();
const mongoose = require('mongoose');
const Bin = require('./models/Bin');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected\n');
  
  const bins = await Bin.find({});
  console.log(`📦 Found ${bins.length} bins\n`);
  
  // Update each bin with a realistic fill level
  const updates = [];
  
  for (const bin of bins) {
    // Generate random fill level between 40-95%
    const fillLevel = Math.floor(Math.random() * 55) + 40;
    
    bin.fillLevel = fillLevel;
    
    // Mark as full if over 85%
    if (fillLevel >= 85) {
      bin.status = 'full';
    } else {
      bin.status = 'active';
    }
    
    await bin.save();
    
    console.log(`✅ ${bin.binId} (${bin.binType}): ${fillLevel}% full, ${bin.status}`);
  }
  
  console.log(`\n✅ Updated ${bins.length} bins with realistic fill levels`);
  
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
