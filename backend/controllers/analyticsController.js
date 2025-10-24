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

// Get Bin Analytics (NEW)
exports.getBinAnalytics = async (req, res) => {
  try {
    const binAnalytics = await getBinAnalyticsData();

    res.status(200).json({
      success: true,
      data: binAnalytics
    });
  } catch (error) {
    console.error('Bin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bin analytics data'
    });
  }
};

// Get User Analytics (NEW)
exports.getUserAnalyticsData = async (req, res) => {
  try {
    const userAnalytics = await getUserAnalyticsDetailed();

    res.status(200).json({
      success: true,
      data: userAnalytics
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user analytics data'
    });
  }
};

// Get Zone Analytics (NEW)
exports.getZoneAnalytics = async (req, res) => {
  try {
    const zoneAnalytics = await getZoneAnalyticsData();

    res.status(200).json({
      success: true,
      data: zoneAnalytics
    });
  } catch (error) {
    console.error('Zone analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch zone analytics data'
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

// NEW: Bin Analytics Data
async function getBinAnalyticsData() {
  const bins = await Bin.find();
  
  // Bin Status Distribution
  const statusDistribution = {
    active: await Bin.countDocuments({ status: 'active' }),
    full: await Bin.countDocuments({ status: 'full' }),
    maintenance: await Bin.countDocuments({ status: 'maintenance' }),
    inactive: await Bin.countDocuments({ status: 'inactive' })
  };
  
  // Bin Type Distribution
  const typeDistribution = {
    Organic: await Bin.countDocuments({ binType: 'Organic' }),
    Recyclable: await Bin.countDocuments({ binType: 'Recyclable' }),
    'General Waste': await Bin.countDocuments({ binType: 'General Waste' }),
    Hazardous: await Bin.countDocuments({ binType: 'Hazardous' })
  };
  
  // Fill Level Analysis
  const fillLevels = {
    empty: await Bin.countDocuments({ fillLevel: { $lt: 25 } }),
    low: await Bin.countDocuments({ fillLevel: { $gte: 25, $lt: 50 } }),
    medium: await Bin.countDocuments({ fillLevel: { $gte: 50, $lt: 75 } }),
    high: await Bin.countDocuments({ fillLevel: { $gte: 75, $lt: 90 } }),
    critical: await Bin.countDocuments({ fillLevel: { $gte: 90 } })
  };
  
  // Average fill level
  const avgFillResult = await Bin.aggregate([
    { $group: { _id: null, avgFill: { $avg: '$fillLevel' } } }
  ]);
  const averageFillLevel = avgFillResult.length > 0 ? Math.round(avgFillResult[0].avgFill) : 0;
  
  // Capacity utilization
  const capacityResult = await Bin.aggregate([
    { $group: { _id: null, totalCapacity: { $sum: '$capacity' }, totalWeight: { $sum: '$weight' } } }
  ]);
  const capacityUtilization = capacityResult.length > 0 
    ? Math.round((capacityResult[0].totalWeight / capacityResult[0].totalCapacity) * 100)
    : 0;
  
  return {
    statusDistribution: Object.keys(statusDistribution).map(key => ({
      status: key.charAt(0).toUpperCase() + key.slice(1),
      count: statusDistribution[key],
      percentage: Math.round((statusDistribution[key] / bins.length) * 100),
      color: key === 'active' ? '#10B981' : key === 'full' ? '#EF4444' : key === 'maintenance' ? '#F59E0B' : '#6B7280'
    })),
    typeDistribution: Object.keys(typeDistribution).map(key => ({
      type: key,
      count: typeDistribution[key],
      percentage: Math.round((typeDistribution[key] / bins.length) * 100),
      color: key === 'Organic' ? '#10B981' : key === 'Recyclable' ? '#3B82F6' : key === 'General Waste' ? '#6B7280' : '#EF4444'
    })),
    fillLevels: Object.keys(fillLevels).map(key => ({
      level: key.charAt(0).toUpperCase() + key.slice(1),
      count: fillLevels[key],
      percentage: Math.round((fillLevels[key] / bins.length) * 100),
      color: key === 'empty' ? '#10B981' : key === 'low' ? '#3B82F6' : key === 'medium' ? '#F59E0B' : key === 'high' ? '#EF4444' : '#991B1B'
    })),
    summary: {
      totalBins: bins.length,
      averageFillLevel,
      capacityUtilization,
      criticalBins: fillLevels.critical,
      fullBins: statusDistribution.full
    }
  };
}

// NEW: User Analytics Detailed Data
async function getUserAnalyticsDetailed() {
  const users = await User.find();
  
  // Role Distribution
  const roleDistribution = {
    admin: await User.countDocuments({ role: 'admin' }),
    collector: await User.countDocuments({ role: 'collector' }),
    user: await User.countDocuments({ role: 'user' })
  };
  
  // Activity Status
  const activityStatus = {
    active: await User.countDocuments({ isActive: true }),
    inactive: await User.countDocuments({ isActive: false })
  };
  
  // Account Status
  const accountStatus = {
    active: await User.countDocuments({ accountStatus: 'active' }),
    suspended: await User.countDocuments({ accountStatus: 'suspended' }),
    pending: await User.countDocuments({ accountStatus: 'pending' })
  };
  
  // User growth over time (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  return {
    roleDistribution: Object.keys(roleDistribution).map(key => ({
      role: key.charAt(0).toUpperCase() + key.slice(1),
      count: roleDistribution[key],
      percentage: Math.round((roleDistribution[key] / users.length) * 100),
      color: key === 'admin' ? '#EF4444' : key === 'collector' ? '#3B82F6' : '#10B981'
    })),
    activityStatus: Object.keys(activityStatus).map(key => ({
      status: key.charAt(0).toUpperCase() + key.slice(1),
      count: activityStatus[key],
      percentage: Math.round((activityStatus[key] / users.length) * 100),
      color: key === 'active' ? '#10B981' : '#6B7280'
    })),
    accountStatus: Object.keys(accountStatus).map(key => ({
      status: key.charAt(0).toUpperCase() + key.slice(1),
      count: accountStatus[key],
      percentage: Math.round((accountStatus[key] / users.length) * 100),
      color: key === 'active' ? '#10B981' : key === 'suspended' ? '#EF4444' : '#F59E0B'
    })),
    userGrowth: userGrowth.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      count: item.count
    })),
    summary: {
      totalUsers: users.length,
      activeUsers: activityStatus.active,
      totalCollectors: roleDistribution.collector,
      totalAdmins: roleDistribution.admin
    }
  };
}

// NEW: Zone Analytics Data
async function getZoneAnalyticsData() {
  const bins = await Bin.find();
  
  // Group bins by zone
  const zoneGroups = {};
  bins.forEach(bin => {
    const zone = bin.zone || 'Unassigned';
    if (!zoneGroups[zone]) {
      zoneGroups[zone] = {
        zone,
        binCount: 0,
        totalCapacity: 0,
        totalWeight: 0,
        avgFillLevel: 0,
        fullBins: 0,
        bins: []
      };
    }
    zoneGroups[zone].binCount++;
    zoneGroups[zone].totalCapacity += bin.capacity || 0;
    zoneGroups[zone].totalWeight += bin.weight || 0;
    zoneGroups[zone].bins.push(bin.fillLevel || 0);
    if (bin.status === 'full' || bin.fillLevel >= 90) {
      zoneGroups[zone].fullBins++;
    }
  });
  
  // Calculate averages and format data
  const zoneAnalytics = Object.values(zoneGroups).map((zone, index) => {
    const avgFill = zone.bins.length > 0 
      ? Math.round(zone.bins.reduce((a, b) => a + b, 0) / zone.bins.length)
      : 0;
    const utilization = zone.totalCapacity > 0 
      ? Math.round((zone.totalWeight / zone.totalCapacity) * 100)
      : 0;
    
    return {
      zone: zone.zone,
      binCount: zone.binCount,
      totalCapacity: zone.totalCapacity,
      totalWeight: zone.totalWeight,
      averageFillLevel: avgFill,
      utilization,
      fullBins: zone.fullBins,
      percentage: Math.round((zone.binCount / bins.length) * 100),
      color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]
    };
  }).sort((a, b) => b.binCount - a.binCount);
  
  return zoneAnalytics;
}
