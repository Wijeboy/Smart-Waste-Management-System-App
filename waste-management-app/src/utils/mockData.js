// Mock data for Data Analytics & Reporting module

export const mockAnalyticsData = {
  // Key Performance Indicators
  kpis: {
    totalCollections: 1247,
    totalWasteCollected: 15680, // in kg
    averageCollectionTime: 45, // minutes
    collectionEfficiency: 87.5, // percentage
    customerSatisfaction: 4.2, // out of 5
    recyclingRate: 34.8, // percentage
    missedCollections: 23,
    contaminationRate: 12.3, // percentage
  },

  // Waste collection trends over time
  collectionTrends: {
    daily: [
      { date: '2024-01-01', collections: 45, waste: 580 },
      { date: '2024-01-02', collections: 52, waste: 620 },
      { date: '2024-01-03', collections: 48, waste: 590 },
      { date: '2024-01-04', collections: 55, waste: 650 },
      { date: '2024-01-05', collections: 50, waste: 610 },
      { date: '2024-01-06', collections: 47, waste: 580 },
      { date: '2024-01-07', collections: 43, waste: 550 },
    ],
    weekly: [
      { week: 'Week 1', collections: 340, waste: 4180 },
      { week: 'Week 2', collections: 365, waste: 4450 },
      { week: 'Week 3', collections: 352, waste: 4320 },
      { week: 'Week 4', collections: 378, waste: 4620 },
    ],
    monthly: [
      { month: 'Jan', collections: 1435, waste: 17570 },
      { month: 'Feb', collections: 1380, waste: 16890 },
      { month: 'Mar', collections: 1520, waste: 18640 },
      { month: 'Apr', collections: 1480, waste: 18120 },
    ],
  },

  // Waste type distribution
  wasteDistribution: [
    { type: 'Organic', percentage: 45, amount: 7056, color: '#4CAF50' },
    { type: 'Recyclable', percentage: 30, amount: 4704, color: '#2196F3' },
    { type: 'General', percentage: 20, amount: 3136, color: '#FF9800' },
    { type: 'Hazardous', percentage: 5, amount: 784, color: '#F44336' },
  ],

  // Route performance data
  routePerformance: [
    { route: 'Route A', efficiency: 92, collections: 156, avgTime: 42 },
    { route: 'Route B', efficiency: 88, collections: 142, avgTime: 48 },
    { route: 'Route C', efficiency: 85, collections: 138, avgTime: 52 },
    { route: 'Route D', efficiency: 90, collections: 149, avgTime: 45 },
    { route: 'Route E', efficiency: 87, collections: 135, avgTime: 50 },
  ],

  // Collection crew performance
  crewPerformance: [
    { crew: 'Crew Alpha', collections: 89, efficiency: 94, rating: 4.5 },
    { crew: 'Crew Beta', collections: 76, efficiency: 91, rating: 4.3 },
    { crew: 'Crew Gamma', collections: 82, efficiency: 88, rating: 4.1 },
    { crew: 'Crew Delta', collections: 71, efficiency: 85, rating: 3.9 },
  ],

  // Customer feedback data
  customerFeedback: {
    totalResponses: 1247,
    averageRating: 4.2,
    distribution: [
      { rating: 5, count: 523, percentage: 42 },
      { rating: 4, count: 374, percentage: 30 },
      { rating: 3, count: 187, percentage: 15 },
      { rating: 2, count: 99, percentage: 8 },
      { rating: 1, count: 64, percentage: 5 },
    ],
    commonIssues: [
      { issue: 'Late collection', count: 45 },
      { issue: 'Missed collection', count: 23 },
      { issue: 'Damaged bins', count: 18 },
      { issue: 'Poor communication', count: 12 },
    ],
  },

  // Financial data
  financialData: {
    monthlyRevenue: 45680,
    operationalCosts: 32120,
    profitMargin: 29.7,
    costPerCollection: 25.8,
    revenueByService: [
      { service: 'Regular Collection', revenue: 32400, percentage: 71 },
      { service: 'Bulky Item Collection', revenue: 8900, percentage: 19 },
      { service: 'Special Waste', revenue: 4380, percentage: 10 },
    ],
  },

  // Environmental impact
  environmentalImpact: {
    co2Reduced: 1240, // kg CO2
    energySaved: 8900, // kWh
    landfillDiverted: 5230, // kg
    recyclingAchieved: 4704, // kg
  },
};

export const reportTemplates = [
  {
    id: 1,
    name: 'Daily Collection Report',
    description: 'Summary of daily waste collection activities',
    type: 'operational',
    frequency: 'daily',
  },
  {
    id: 2,
    name: 'Weekly Performance Report',
    description: 'Weekly KPI and performance metrics',
    type: 'performance',
    frequency: 'weekly',
  },
  {
    id: 3,
    name: 'Monthly Financial Report',
    description: 'Monthly revenue, costs, and profitability analysis',
    type: 'financial',
    frequency: 'monthly',
  },
  {
    id: 4,
    name: 'Environmental Impact Report',
    description: 'Environmental benefits and sustainability metrics',
    type: 'environmental',
    frequency: 'monthly',
  },
  {
    id: 5,
    name: 'Customer Satisfaction Report',
    description: 'Customer feedback and satisfaction analysis',
    type: 'customer',
    frequency: 'monthly',
  },
];
