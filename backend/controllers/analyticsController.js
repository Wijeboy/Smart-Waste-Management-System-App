/**
 * Analytics Controller
 * Handles analytics and reporting endpoints for admin dashboard
 */

const User = require('../models/User');
const Route = require('../models/Route');
const Bin = require('../models/Bin');

// Get comprehensive analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const [
      userStats,
      routeStats,
      binStats,
      collectionStats,
      performanceStats
    ] = await Promise.all([
      getUserAnalytics(),
      getRouteAnalytics(),
      getBinAnalytics(),
      getCollectionAnalytics(),
      getPerformanceAnalytics()
    ]);

    res.status(200).json({
      success: true,
      data: {
        userStats,
        routeStats,
        binStats,
        collectionStats,
        performanceStats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};

// Get KPIs (Key Performance Indicators)
exports.getKPIs = async (req, res) => {
  try {
    const kpis = await calculateKPIs();
    
    res.status(200).json({
      success: true,
      data: kpis
    });
  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPIs'
    });
  }
};

// Get collection trends (daily, weekly, monthly)
exports.getCollectionTrends = async (req, res) => {
  try {
    const { period = 'weekly' } = req.query;
    const trends = await getCollectionTrendsData(period);
    
    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Collection trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection trends'
    });
  }
};

// Get waste distribution analytics
exports.getWasteDistribution = async (req, res) => {
  try {
    const distribution = await getWasteDistributionData();
    
    res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Waste distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste distribution'
    });
  }
};

// Get route performance analytics
exports.getRoutePerformance = async (req, res) => {
  try {
    const performance = await getRoutePerformanceData();
    
    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Route performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route performance'
    });
  }
};

// Helper Functions

async function getUserAnalytics() {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const collectors = await User.countDocuments({ role: 'collector' });
  const admins = await User.countDocuments({ role: 'admin' });
  
  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  return {
    total: totalUsers,
    active: activeUsers,
    collectors,
    admins,
    recentRegistrations,
    inactiveUsers: totalUsers - activeUsers
  };
}

async function getRouteAnalytics() {
  const totalRoutes = await Route.countDocuments();
  const scheduledRoutes = await Route.countDocuments({ status: 'scheduled' });
  const inProgressRoutes = await Route.countDocuments({ status: 'in_progress' });
  const completedRoutes = await Route.countDocuments({ status: 'completed' });
  const unassignedRoutes = await Route.countDocuments({ assignedTo: { $exists: false } });

  // Calculate average completion time
  const completedRoutesWithTime = await Route.find({
    status: 'completed',
    startTime: { $exists: true },
    endTime: { $exists: true }
  });

  let avgCompletionTime = 0;
  if (completedRoutesWithTime.length > 0) {
    const totalTime = completedRoutesWithTime.reduce((sum, route) => {
      const duration = new Date(route.endTime) - new Date(route.startTime);
      return sum + duration;
    }, 0);
    avgCompletionTime = Math.round(totalTime / completedRoutesWithTime.length / (1000 * 60)); // minutes
  }

  return {
    totalRoutes,
    scheduledRoutes,
    inProgressRoutes,
    completedRoutes,
    unassignedRoutes,
    avgCompletionTime
  };
}

async function getBinAnalytics() {
  const totalBins = await Bin.countDocuments();
  const activeBins = await Bin.countDocuments({ status: 'active' });
  const fullBins = await Bin.countDocuments({ status: 'full' });
  const maintenanceBins = await Bin.countDocuments({ status: 'maintenance' });
  const inactiveBins = await Bin.countDocuments({ status: 'inactive' });

  // Calculate average fill level
  const binsWithFillLevel = await Bin.find({ fillLevel: { $exists: true } });
  let avgFillLevel = 0;
  if (binsWithFillLevel.length > 0) {
    const totalFillLevel = binsWithFillLevel.reduce((sum, bin) => sum + bin.fillLevel, 0);
    avgFillLevel = Math.round(totalFillLevel / binsWithFillLevel.length);
  }

  // Bin types distribution
  const binTypes = await Bin.aggregate([
    { $group: { _id: '$binType', count: { $sum: 1 } } }
  ]);

  return {
    totalBins,
    activeBins,
    fullBins,
    maintenanceBins,
    inactiveBins,
    avgFillLevel,
    binTypes: binTypes.map(type => ({
      type: type._id,
      count: type.count
    }))
  };
}

async function getCollectionAnalytics() {
  // Get actual collection data from completed routes and bins
  const completedRoutes = await Route.find({ status: 'completed' });
  
  let totalCollections = 0;
  let totalWasteCollected = 0;
  let recyclableWaste = 0;
  
  // Calculate from completed routes
  completedRoutes.forEach(route => {
    if (route.binsCollected) totalCollections += route.binsCollected;
    if (route.wasteCollected) totalWasteCollected += route.wasteCollected;
    if (route.recyclableWaste) recyclableWaste += route.recyclableWaste;
  });
  
  // Calculate recycling rate (only if we have waste data)
  const recyclingRate = totalWasteCollected > 0 
    ? Math.round((recyclableWaste / totalWasteCollected) * 100) 
    : 0;
  
  // Calculate time-based collections
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const collectionsToday = await Route.countDocuments({
    status: 'completed',
    completedAt: { $gte: today }
  });
  
  const collectionsThisWeek = await Route.countDocuments({
    status: 'completed',
    completedAt: { $gte: weekAgo }
  });
  
  const collectionsThisMonth = await Route.countDocuments({
    status: 'completed',
    completedAt: { $gte: monthAgo }
  });
  
  return {
    totalCollections,
    totalWasteCollected,
    recyclingRate,
    avgWastePerCollection: totalCollections > 0 ? Math.round(totalWasteCollected / totalCollections) : 0,
    collectionsToday,
    collectionsThisWeek,
    collectionsThisMonth
  };
}

async function getPerformanceAnalytics() {
  const routes = await Route.find({ status: 'completed' });
  
  let totalEfficiency = 0;
  let totalSatisfaction = 0;
  let completedCount = 0;
  
  routes.forEach(route => {
    if (route.efficiency) {
      totalEfficiency += route.efficiency;
      completedCount++;
    }
    if (route.satisfaction) {
      totalSatisfaction += route.satisfaction;
    }
  });
  
  const avgEfficiency = completedCount > 0 ? Math.round(totalEfficiency / completedCount) : 0;
  const avgSatisfaction = completedCount > 0 ? Math.round(totalSatisfaction / completedCount) : 0;
  
  return {
    avgEfficiency,
    avgSatisfaction,
    totalCompletedRoutes: completedCount,
    onTimeCompletionRate: Math.round(avgEfficiency * 0.9), // Simulate on-time rate
    customerSatisfactionScore: avgSatisfaction
  };
}

async function calculateKPIs() {
  const [
    userStats,
    routeStats,
    binStats,
    collectionStats,
    performanceStats
  ] = await Promise.all([
    getUserAnalytics(),
    getRouteAnalytics(),
    getBinAnalytics(),
    getCollectionAnalytics(),
    getPerformanceAnalytics()
  ]);

  return {
    totalUsers: userStats.total,
    totalRoutes: routeStats.totalRoutes,
    totalBins: binStats.totalBins,
    totalCollections: collectionStats.totalCollections,
    totalWasteCollected: collectionStats.totalWasteCollected,
    collectionEfficiency: performanceStats.avgEfficiency,
    customerSatisfaction: performanceStats.avgSatisfaction,
    recyclingRate: collectionStats.recyclingRate,
    avgCompletionTime: routeStats.avgCompletionTime,
    activeCollectors: userStats.collectors,
    unassignedRoutes: routeStats.unassignedRoutes,
    fullBins: binStats.fullBins,
    maintenanceBins: binStats.maintenanceBins
  };
}

async function getCollectionTrendsData(period) {
  // Get real collection trends from completed routes
  const now = new Date();
  let data = [];
  
  if (period === 'daily') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      const routes = await Route.find({
        status: 'completed',
        completedAt: { $gte: startOfDay, $lt: endOfDay }
      });
      
      const collections = routes.reduce((sum, route) => sum + (route.binsCollected || 0), 0);
      const wasteCollected = routes.reduce((sum, route) => sum + (route.wasteCollected || 0), 0);
      
      data.push({
        date: date.toISOString().split('T')[0],
        collections,
        wasteCollected
      });
    }
  } else if (period === 'weekly') {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - (i * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      
      const routes = await Route.find({
        status: 'completed',
        completedAt: { $gte: startDate, $lt: endDate }
      });
      
      const collections = routes.reduce((sum, route) => sum + (route.binsCollected || 0), 0);
      const wasteCollected = routes.reduce((sum, route) => sum + (route.wasteCollected || 0), 0);
      
      data.push({
        week: `Week ${4 - i}`,
        collections,
        wasteCollected
      });
    }
  } else if (period === 'monthly') {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      const routes = await Route.find({
        status: 'completed',
        completedAt: { $gte: startDate, $lt: endDate }
      });
      
      const collections = routes.reduce((sum, route) => sum + (route.binsCollected || 0), 0);
      const wasteCollected = routes.reduce((sum, route) => sum + (route.wasteCollected || 0), 0);
      
      data.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        collections,
        wasteCollected
      });
    }
  }
  
  return data;
}

async function getWasteDistributionData() {
  // Get real waste distribution from bins
  const bins = await Bin.find({ status: { $in: ['active', 'full', 'maintenance'] } });
  
  // Initialize waste type counters - matching Bin model enum values
  const wasteTypes = {
    'Organic': { type: 'Organic', weight: 0, color: '#10B981' },
    'Recyclable': { type: 'Recyclable', weight: 0, color: '#3B82F6' },
    'General Waste': { type: 'General Waste', weight: 0, color: '#6B7280' },
    'Hazardous': { type: 'Hazardous', weight: 0, color: '#EF4444' }
  };
  
  let totalWeight = 0;
  
  // Calculate weight for each bin type
  bins.forEach(bin => {
    const binType = bin.binType || 'General Waste';
    // Estimate weight based on fill level and capacity
    const estimatedWeight = bin.fillLevel && bin.capacity 
      ? (bin.fillLevel / 100) * bin.capacity 
      : 0;
    
    if (wasteTypes[binType]) {
      wasteTypes[binType].weight += estimatedWeight;
      totalWeight += estimatedWeight;
    } else {
      wasteTypes['General Waste'].weight += estimatedWeight;
      totalWeight += estimatedWeight;
    }
  });
  
  // Calculate percentages
  const distribution = Object.values(wasteTypes).map(item => ({
    type: item.type,
    weight: Math.round(item.weight),
    percentage: totalWeight > 0 ? Math.round((item.weight / totalWeight) * 100) : 0,
    color: item.color
  }));
  
  // Filter out types with 0 weight if there's no data
  return totalWeight > 0 ? distribution : [];
}

async function getRoutePerformanceData() {
  const routes = await Route.find({ status: 'completed' })
    .populate('assignedTo', 'firstName lastName')
    .sort({ efficiency: -1 }) // Sort by efficiency descending
    .limit(10); // Get top 10 performing routes
  
  return routes.map(route => {
    // Calculate completion time if we have start and end times
    let completionTime = 0;
    if (route.startTime && route.endTime) {
      completionTime = Math.round((new Date(route.endTime) - new Date(route.startTime)) / (1000 * 60)); // minutes
    }
    
    return {
      routeId: route.routeNumber,
      routeName: route.name,
      collector: route.assignedTo ? `${route.assignedTo.firstName} ${route.assignedTo.lastName}` : 'Unassigned',
      efficiency: route.efficiency || 0,
      satisfaction: route.satisfaction || 0,
      completionTime: completionTime || 0,
      binsCollected: route.binsCollected || 0,
      wasteCollected: route.wasteCollected || 0
    };
  });
}
