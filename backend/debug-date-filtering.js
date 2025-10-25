require('dotenv').config();
const mongoose = require('mongoose');
const Route = require('./models/Route');
const User = require('./models/User');

async function debugDateIssue() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');
    console.log('=' .repeat(60));
    console.log('DATE FILTERING DEBUG - DashboardScreen Issue');
    console.log('='.repeat(60) + '\n');
    
    // Get Jhon's routes
    const jhon = await User.findOne({ username: 'jhon' });
    console.log(`Checking routes for: ${jhon.firstName} ${jhon.lastName}\n`);
    
    const jhonRoutes = await Route.find({ assignedTo: jhon._id })
      .sort({ scheduledDate: -1 });
    
    console.log(`Total routes assigned to Jhon: ${jhonRoutes.length}\n`);
    
    // Get today's date in the format the frontend uses
    const today = new Date().toISOString().split('T')[0];
    console.log(`Today's date (ISO format): ${today}`);
    console.log(`Today's date object: ${new Date()}\n`);
    
    console.log('Routes and their scheduled dates:\n');
    jhonRoutes.forEach((route, idx) => {
      const routeDate = new Date(route.scheduledDate).toISOString().split('T')[0];
      const isToday = routeDate === today;
      const statusMatch = route.status === 'scheduled' || route.status === 'in-progress';
      const wouldShow = isToday && statusMatch;
      
      console.log(`${idx + 1}. ${route.routeName}`);
      console.log(`   Status: ${route.status}`);
      console.log(`   Scheduled Date (stored): ${route.scheduledDate}`);
      console.log(`   Scheduled Date (ISO): ${routeDate}`);
      console.log(`   Is Today?: ${isToday ? '✅ YES' : '❌ NO'}`);
      console.log(`   Status Match?: ${statusMatch ? '✅ YES' : '❌ NO'}`);
      console.log(`   Would show on dashboard?: ${wouldShow ? '✅ YES' : '❌ NO'}\n`);
    });
    
    // Check if there's a route for today
    const todayRoute = jhonRoutes.find(r => {
      const routeDate = new Date(r.scheduledDate).toISOString().split('T')[0];
      return routeDate === today && (r.status === 'scheduled' || r.status === 'in-progress');
    });
    
    console.log('='.repeat(60));
    if (todayRoute) {
      console.log(`✅ TODAY'S ROUTE FOUND: ${todayRoute.routeName}`);
    } else {
      console.log('❌ NO ROUTE FOR TODAY');
      console.log('\nPossible reasons:');
      console.log('1. All routes are scheduled for past dates');
      console.log('2. All routes are "completed" status');
      console.log('3. Routes are scheduled for future dates');
      console.log('\nTo fix: Create a new route with today\'s date');
    }
    console.log('='.repeat(60));
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugDateIssue();
