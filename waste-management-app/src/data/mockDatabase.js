// Mock Database for Waste Management System
export const mockDatabase = {
  // Registered Trucks
  trucks: [
    {
      id: 'TRUCK001',
      driverName: 'John Silva',
      licensePlate: 'WP-ABC-1234',
      capacity: 5000, // kg
      status: 'active',
      currentRoute: 'Colombo Central',
      registrationDate: '2024-01-15',
      lastMaintenance: '2024-01-10'
    },
    {
      id: 'TRUCK002',
      driverName: 'Kamal Perera',
      licensePlate: 'WP-XYZ-5678',
      capacity: 3000, // kg
      status: 'active',
      currentRoute: 'Colombo North',
      registrationDate: '2024-01-20',
      lastMaintenance: '2024-01-18'
    },
    {
      id: 'TRUCK003',
      driverName: 'Nimal Fernando',
      licensePlate: 'WP-DEF-9012',
      capacity: 4000, // kg
      status: 'maintenance',
      currentRoute: null,
      registrationDate: '2024-01-25',
      lastMaintenance: '2024-02-01'
    }
  ],

  // Registered Bins
  bins: [
    {
      id: 'BIN001',
      location: 'Colombo 01 - Fort Area',
      zone: 'Zone A',
      binType: 'General Waste',
      capacity: 100, // kg
      status: 'active',
      registrationDate: '2024-01-10',
      lastCollection: '2024-02-15',
      coordinates: { lat: 6.9271, lng: 79.8612 }
    },
    {
      id: 'BIN002',
      location: 'Colombo 02 - Slave Island',
      zone: 'Zone A',
      binType: 'Recyclable',
      capacity: 80, // kg
      status: 'active',
      registrationDate: '2024-01-12',
      lastCollection: '2024-02-14',
      coordinates: { lat: 6.9200, lng: 79.8500 }
    },
    {
      id: 'BIN003',
      location: 'Colombo 03 - Kollupitiya',
      zone: 'Zone B',
      binType: 'General Waste',
      capacity: 120, // kg
      status: 'active',
      registrationDate: '2024-01-15',
      lastCollection: '2024-02-13',
      coordinates: { lat: 6.9100, lng: 79.8400 }
    },
    {
      id: 'BIN004',
      location: 'Colombo 04 - Bambalapitiya',
      zone: 'Zone B',
      binType: 'Organic',
      capacity: 90, // kg
      status: 'active',
      registrationDate: '2024-01-18',
      lastCollection: '2024-02-12',
      coordinates: { lat: 6.9000, lng: 79.8300 }
    },
    {
      id: 'BIN005',
      location: 'Colombo 05 - Wellawatta',
      zone: 'Zone C',
      binType: 'General Waste',
      capacity: 110, // kg
      status: 'active',
      registrationDate: '2024-01-20',
      lastCollection: '2024-02-11',
      coordinates: { lat: 6.8900, lng: 79.8200 }
    },
    {
      id: 'BIN006',
      location: 'Colombo 06 - Pamankada',
      zone: 'Zone C',
      binType: 'Recyclable',
      capacity: 85, // kg
      status: 'active',
      registrationDate: '2024-01-22',
      lastCollection: '2024-02-10',
      coordinates: { lat: 6.8800, lng: 79.8100 }
    },
    {
      id: 'BIN007',
      location: 'Colombo 07 - Cinnamon Gardens',
      zone: 'Zone D',
      binType: 'General Waste',
      capacity: 95, // kg
      status: 'active',
      registrationDate: '2024-01-25',
      lastCollection: '2024-02-09',
      coordinates: { lat: 6.8700, lng: 79.8000 }
    },
    {
      id: 'BIN008',
      location: 'Colombo 08 - Borella',
      zone: 'Zone D',
      binType: 'Organic',
      capacity: 100, // kg
      status: 'active',
      registrationDate: '2024-01-28',
      lastCollection: '2024-02-08',
      coordinates: { lat: 6.8600, lng: 79.7900 }
    }
  ],

  // Collection Records
  collections: [
    {
      id: 'COL001',
      truckId: 'TRUCK001',
      driverName: 'John Silva',
      date: '2024-02-15',
      route: 'Colombo Central',
      binsCollected: [
        { binId: 'BIN001', wasteWeight: 85, binType: 'General Waste', collectionTime: '08:30' },
        { binId: 'BIN002', wasteWeight: 65, binType: 'Recyclable', collectionTime: '09:15' }
      ],
      totalWeight: 150,
      totalBins: 2,
      status: 'completed',
      startTime: '08:00',
      endTime: '10:00'
    },
    {
      id: 'COL002',
      truckId: 'TRUCK002',
      driverName: 'Kamal Perera',
      date: '2024-02-15',
      route: 'Colombo North',
      binsCollected: [
        { binId: 'BIN003', wasteWeight: 95, binType: 'General Waste', collectionTime: '09:00' },
        { binId: 'BIN004', wasteWeight: 70, binType: 'Organic', collectionTime: '09:45' }
      ],
      totalWeight: 165,
      totalBins: 2,
      status: 'completed',
      startTime: '08:30',
      endTime: '10:30'
    },
    {
      id: 'COL003',
      truckId: 'TRUCK001',
      driverName: 'John Silva',
      date: '2024-02-14',
      route: 'Colombo Central',
      binsCollected: [
        { binId: 'BIN001', wasteWeight: 90, binType: 'General Waste', collectionTime: '08:15' },
        { binId: 'BIN002', wasteWeight: 60, binType: 'Recyclable', collectionTime: '09:00' }
      ],
      totalWeight: 150,
      totalBins: 2,
      status: 'completed',
      startTime: '08:00',
      endTime: '09:45'
    },
    {
      id: 'COL004',
      truckId: 'TRUCK002',
      driverName: 'Kamal Perera',
      date: '2024-02-14',
      route: 'Colombo North',
      binsCollected: [
        { binId: 'BIN003', wasteWeight: 100, binType: 'General Waste', collectionTime: '09:30' },
        { binId: 'BIN004', wasteWeight: 75, binType: 'Organic', collectionTime: '10:15' }
      ],
      totalWeight: 175,
      totalBins: 2,
      status: 'completed',
      startTime: '09:00',
      endTime: '11:00'
    },
    {
      id: 'COL005',
      truckId: 'TRUCK001',
      driverName: 'John Silva',
      date: '2024-02-13',
      route: 'Colombo Central',
      binsCollected: [
        { binId: 'BIN001', wasteWeight: 80, binType: 'General Waste', collectionTime: '08:45' },
        { binId: 'BIN002', wasteWeight: 55, binType: 'Recyclable', collectionTime: '09:30' }
      ],
      totalWeight: 135,
      totalBins: 2,
      status: 'completed',
      startTime: '08:30',
      endTime: '10:00'
    }
  ],

  // Routes
  routes: [
    {
      id: 'ROUTE001',
      name: 'Colombo Central',
      zones: ['Zone A', 'Zone B'],
      bins: ['BIN001', 'BIN002', 'BIN003', 'BIN004'],
      estimatedTime: 120, // minutes
      distance: 15.5 // km
    },
    {
      id: 'ROUTE002',
      name: 'Colombo North',
      zones: ['Zone C', 'Zone D'],
      bins: ['BIN005', 'BIN006', 'BIN007', 'BIN008'],
      estimatedTime: 100, // minutes
      distance: 12.3 // km
    }
  ],

  // Analytics Data
  analytics: {
    dailyStats: {
      '2024-02-15': {
        totalBinsCollected: 4,
        totalWeight: 315,
        totalRoutes: 2,
        averageWeightPerBin: 78.75,
        collectionEfficiency: 95
      },
      '2024-02-14': {
        totalBinsCollected: 4,
        totalWeight: 325,
        totalRoutes: 2,
        averageWeightPerBin: 81.25,
        collectionEfficiency: 92
      },
      '2024-02-13': {
        totalBinsCollected: 2,
        totalWeight: 135,
        totalRoutes: 1,
        averageWeightPerBin: 67.5,
        collectionEfficiency: 88
      }
    },
    weeklyStats: {
      'Week 1 (Feb 8-14)': {
        totalBinsCollected: 28,
        totalWeight: 2100,
        averageDailyWeight: 300,
        collectionEfficiency: 90
      },
      'Week 2 (Feb 15-21)': {
        totalBinsCollected: 32,
        totalWeight: 2400,
        averageDailyWeight: 343,
        collectionEfficiency: 94
      }
    },
    monthlyStats: {
      'February 2024': {
        totalBinsCollected: 120,
        totalWeight: 9000,
        averageDailyWeight: 321,
        collectionEfficiency: 91
      }
    }
  },

  // Notifications
  notifications: [
    {
      id: 'NOTIF001',
      type: 'pattern_change',
      title: 'Collection Pattern Alert',
      message: 'Waste collection increased by 14% this week (300kg → 343kg)',
      date: '2024-02-15',
      priority: 'high',
      status: 'unread'
    },
    {
      id: 'NOTIF002',
      type: 'maintenance',
      title: 'Truck Maintenance Due',
      message: 'TRUCK003 requires maintenance - last service 15 days ago',
      date: '2024-02-14',
      priority: 'medium',
      status: 'read'
    },
    {
      id: 'NOTIF003',
      type: 'collection',
      title: 'Collection Efficiency Improved',
      message: 'Collection efficiency increased to 94% this week',
      date: '2024-02-13',
      priority: 'low',
      status: 'read'
    }
  ]
};

// Helper functions for data analysis
export const getCollectionStats = (date) => {
  const collections = mockDatabase.collections.filter(col => col.date === date);
  const totalBins = collections.reduce((sum, col) => sum + col.totalBins, 0);
  const totalWeight = collections.reduce((sum, col) => sum + col.totalWeight, 0);
  const totalRoutes = new Set(collections.map(col => col.route)).size;
  
  return {
    totalBinsCollected: totalBins,
    totalWeight: totalWeight,
    totalRoutes: totalRoutes,
    averageWeightPerBin: totalBins > 0 ? totalWeight / totalBins : 0,
    collectionEfficiency: totalBins > 0 ? Math.min(100, (totalBins / mockDatabase.bins.length) * 100) : 0
  };
};

export const getUncollectedBins = (date) => {
  const collections = mockDatabase.collections.filter(col => col.date === date);
  const collectedBinIds = collections.flatMap(col => col.binsCollected.map(bin => bin.binId));
  return mockDatabase.bins.filter(bin => !collectedBinIds.includes(bin.id));
};

export const getPatternAnalysis = () => {
  const weeklyData = Object.values(mockDatabase.analytics.weeklyStats);
  if (weeklyData.length >= 2) {
    const currentWeek = weeklyData[weeklyData.length - 1];
    const previousWeek = weeklyData[weeklyData.length - 2];
    const weightChange = ((currentWeek.averageDailyWeight - previousWeek.averageDailyWeight) / previousWeek.averageDailyWeight) * 100;
    
    return {
      weightChange: weightChange,
      isSignificant: Math.abs(weightChange) > 10,
      trend: weightChange > 0 ? 'increasing' : 'decreasing'
    };
  }
  return { weightChange: 0, isSignificant: false, trend: 'stable' };
};
