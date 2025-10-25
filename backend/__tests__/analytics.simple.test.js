/**
 * Analytics  Tests
 */

const {
  getAnalytics,
  getKPIs,
  getCollectionTrends,
  getWasteDistribution,
  getRoutePerformance,
  getBinAnalytics,
  getUserAnalyticsData,
  getZoneAnalytics
} = require('../controllers/analyticsController');

// Mock models
jest.mock('../models/User');
jest.mock('../models/Route');
jest.mock('../models/Bin');

const User = require('../models/User');
const Route = require('../models/Route');
const Bin = require('../models/Bin');

const mockRequest = () => ({ query: {} });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Analytics Controller - Simple Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock User
    User.countDocuments = jest.fn().mockResolvedValue(2);
    User.find = jest.fn().mockResolvedValue([
      { role: 'admin', isActive: true },
      { role: 'collector', isActive: true }
    ]);
    User.aggregate = jest.fn().mockResolvedValue([]);
    
    // Mock Route with proper chainable structure
    const mockPopulate = jest.fn().mockReturnThis();
    const mockSort = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue([
      {
        routeName: 'Test Route',
        assignedTo: { firstName: 'John', lastName: 'Doe' },
        efficiency: 100,
        satisfaction: 5,
        startTime: new Date('2024-01-01T08:00:00'),
        endTime: new Date('2024-01-01T09:00:00'),
        binsCollected: 4,
        wasteCollected: 205
      }
    ]);
    
    Route.countDocuments = jest.fn().mockResolvedValue(5);
    Route.find = jest.fn().mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      limit: mockLimit
    });
    Route.aggregate = jest.fn().mockResolvedValue([
      { _id: 'Week 1', totalCollections: 2, totalWaste: 100 },
      { _id: 'Week 2', totalCollections: 3, totalWaste: 150 }
    ]);
    
    // Mock Bin
    Bin.countDocuments = jest.fn().mockResolvedValue(6);
    Bin.find = jest.fn().mockResolvedValue([
      { binType: 'Organic', capacity: 100, fillLevel: 80, status: 'active', zone: 'Zone A', weight: 80 },
      { binType: 'Recyclable', capacity: 100, fillLevel: 50, status: 'active', zone: 'Zone A', weight: 50 },
      { binType: 'General Waste', capacity: 100, fillLevel: 30, status: 'active', zone: 'Zone B', weight: 30 },
      { binType: 'Hazardous', capacity: 50, fillLevel: 90, status: 'full', zone: 'Zone B', weight: 45 }
    ]);
    Bin.aggregate = jest.fn().mockResolvedValue([{ 
      _id: null, 
      avgFill: 62.5, 
      totalCapacity: 350, 
      totalWeight: 205 
    }]);
  });

  // Note: getAnalytics, getKPIs, and getCollectionTrends use complex helper functions
  // that are difficult to mock. They are tested via integration tests and manual testing.

  test('GET /api/admin/analytics/waste-distribution returns all waste types', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getWasteDistribution(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.json.mock.calls[0][0];
    expect(Array.isArray(call.data)).toBe(true);
    expect(call.data.length).toBe(4);
    
    const types = call.data.map(item => item.type);
    expect(types).toContain('Organic');
    expect(types).toContain('Recyclable');
    expect(types).toContain('General Waste');
    expect(types).toContain('Hazardous');
  });

  test('Waste distribution includes percentages and colors', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getWasteDistribution(req, res);

    const call = res.json.mock.calls[0][0];
    call.data.forEach(item => {
      expect(item).toHaveProperty('percentage');
      expect(item).toHaveProperty('color');
      expect(typeof item.percentage).toBe('number');
      expect(item.color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  test('GET /api/admin/analytics/route-performance returns performance data', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getRoutePerformance(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.json.mock.calls[0][0];
    expect(Array.isArray(call.data)).toBe(true);
  });

  test('GET /api/admin/analytics/bin-analytics returns bin stats', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getBinAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.json.mock.calls[0][0];
    expect(call.data).toHaveProperty('statusDistribution');
    expect(call.data).toHaveProperty('typeDistribution');
    expect(call.data).toHaveProperty('fillLevels');
    expect(call.data).toHaveProperty('summary');
    expect(call.data.summary.totalBins).toBe(4);
  });

  test('GET /api/admin/analytics/user-analytics returns user stats', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getUserAnalyticsData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.json.mock.calls[0][0];
    expect(call.data).toHaveProperty('roleDistribution');
    expect(call.data).toHaveProperty('activityStatus');
    expect(call.data).toHaveProperty('summary');
  });

  test('GET /api/admin/analytics/zone-analytics returns zone data', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getZoneAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const call = res.json.mock.calls[0][0];
    expect(Array.isArray(call.data)).toBe(true);
    
    // Should have 2 zones from our mock data
    const zones = call.data.map(z => z.zone);
    expect(zones).toContain('Zone A');
    expect(zones).toContain('Zone B');
  });

  test('Zone analytics calculates metrics correctly', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getZoneAnalytics(req, res);

    const call = res.json.mock.calls[0][0];
    const zoneA = call.data.find(z => z.zone === 'Zone A');
    expect(zoneA.binCount).toBe(2);
    
    const zoneB = call.data.find(z => z.zone === 'Zone B');
    expect(zoneB.binCount).toBe(2);
  });

  test('handles errors gracefully', async () => {
    User.countDocuments.mockRejectedValueOnce(new Error('DB Error'));

    const req = mockRequest();
    const res = mockResponse();

    await getKPIs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });


  test('Bin analytics calculates average fill level', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getBinAnalytics(req, res);

    const call = res.json.mock.calls[0][0];
    // Average of 80, 50, 30, 90 = 62.5
    expect(call.data.summary.averageFillLevel).toBeGreaterThan(60);
    expect(call.data.summary.averageFillLevel).toBeLessThan(65);
  });

  test('User analytics has correct counts', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getUserAnalyticsData(req, res);

    const call = res.json.mock.calls[0][0];
    expect(call.data.summary.totalUsers).toBe(2);
  });
});

