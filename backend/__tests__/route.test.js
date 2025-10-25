const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Route = require('../models/Route');
const Bin = require('../models/Bin');
const jwt = require('jsonwebtoken');

describe('Route Controller - Pre-Route Checklist & Post-Route Summary', () => {
  let collectorToken;
  let collectorUser;
  let adminToken;
  let adminUser;
  let testRoute;
  let testBins = [];

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management_test');
    }
  }, 10000);

  beforeEach(async () => {
    // Clear test data
    await User.deleteMany({});
    await Route.deleteMany({});
    await Bin.deleteMany({});

    // Generate unique short identifier
    const uniqueId = Date.now().toString().slice(-8);

    // Create test collector user
    collectorUser = await User.create({
      firstName: 'Test',
      lastName: 'Collector',
      username: 'col' + uniqueId,
      email: 'col' + uniqueId + '@test.com',
      password: 'password123',
      nic: '123456789V',
      dateOfBirth: new Date('1990-01-01'),
      phoneNo: '0771234567',
      role: 'collector'
    });

    // Create test admin user
    adminUser = await User.create({
      firstName: 'Test',
      lastName: 'Admin',
      username: 'adm' + uniqueId,
      email: 'adm' + uniqueId + '@test.com',
      password: 'password123',
      nic: '987654321V',
      dateOfBirth: new Date('1985-01-01'),
      phoneNo: '0779876543',
      role: 'admin'
    });

    // Generate tokens
    collectorToken = jwt.sign(
      { id: collectorUser._id, role: collectorUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    // Create test bins
    testBins = await Bin.create([
      {
        binId: 'BIN-' + uniqueId + '-1',
        location: 'Test Street 1',
        zone: 'Zone A',
        binType: 'General Waste',
        capacity: 100,
        fillLevel: 80,
        status: 'active'
      },
      {
        binId: 'BIN-' + uniqueId + '-2',
        location: 'Test Street 2',
        zone: 'Zone A',
        binType: 'Recyclable',
        capacity: 50,
        fillLevel: 60,
        status: 'active'
      },
      {
        binId: 'BIN-' + uniqueId + '-3',
        location: 'Test Street 3',
        zone: 'Zone A',
        binType: 'Organic',
        capacity: 75,
        fillLevel: 90,
        status: 'active'
      }
    ]);

    // Create test route
    testRoute = await Route.create({
      routeName: 'Test Route ' + uniqueId,
      createdBy: adminUser._id,
      assignedTo: collectorUser._id,
      bins: [
        { bin: testBins[0]._id, order: 1, status: 'pending' },
        { bin: testBins[1]._id, order: 2, status: 'pending' },
        { bin: testBins[2]._id, order: 3, status: 'pending' }
      ],
      scheduledDate: new Date(),
      scheduledTime: '09:00 AM',
      status: 'scheduled'
    });
  }, 10000);

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await Route.deleteMany({});
    await Bin.deleteMany({});
    await mongoose.connection.close();
  });

  // ==================== PRE-ROUTE CHECKLIST TESTS ====================

  describe('PUT /api/routes/:id/start - Pre-Route Checklist', () => {
    it('should start route with valid pre-route checklist', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Route started successfully');
      expect(response.body.data.route.status).toBe('in-progress');
      expect(response.body.data.route.preRouteChecklist.completed).toBe(true);
      expect(response.body.data.route.preRouteChecklist.items).toHaveLength(5);
      expect(response.body.data.route.startedAt).toBeDefined();
    });

    it('should fail if pre-route checklist is missing', async () => {
      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Pre-route checklist is required before starting the route');
    });

    it('should fail if checklist items array is missing', async () => {
      const preRouteChecklist = {
        completedAt: new Date()
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Pre-route checklist is required before starting the route');
    });

    it('should fail if checklist items is not an array', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: 'not an array'
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Pre-route checklist is required before starting the route');
    });

    it('should fail if not all checklist items are checked', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: false }, // Not checked
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All pre-route checklist items must be checked before starting');
    });

    it('should fail if multiple checklist items are not checked', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: false },
          { id: '2', label: 'Safety equipment available', checked: false },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All pre-route checklist items must be checked before starting');
    });

    it('should fail if route is not assigned to the collector', async () => {
      // Create another collector
      const uniqueId = Date.now().toString().slice(-8);
      const otherCollector = await User.create({
        firstName: 'Other',
        lastName: 'Collector',
        username: 'oth' + uniqueId,
        email: 'oth' + uniqueId + '@test.com',
        password: 'password123',
        nic: '111222333V',
        dateOfBirth: new Date('1992-01-01'),
        phoneNo: '0771112222',
        role: 'collector'
      });

      const otherToken = jwt.sign(
        { id: otherCollector._id, role: otherCollector.role },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
      );

      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('This route is not assigned to you');
    });

    it('should fail if route is not in scheduled status', async () => {
      // Update route to in-progress
      testRoute.status = 'in-progress';
      await testRoute.save();

      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route is not in scheduled status');
    });

    it('should fail without authentication', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(401);
    });

    it('should fail if user is not a collector', async () => {
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ preRouteChecklist });

      expect(response.status).toBe(403);
    });
  });

  // ==================== POST-ROUTE SUMMARY TESTS ====================

  describe('PUT /api/routes/:id/complete - Post-Route Summary', () => {
    beforeEach(async () => {
      // Start the route first with pre-route checklist
      testRoute.status = 'in-progress';
      testRoute.startedAt = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      testRoute.preRouteChecklist = {
        completed: true,
        completedAt: new Date(Date.now() - 60 * 60 * 1000),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };
      await testRoute.save();
    });

    it('should complete route with all bins collected', async () => {
      // Collect all bins with actual weight
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].collectedAt = new Date();
      testRoute.bins[0].fillLevelAtCollection = 80;
      testRoute.bins[0].actualWeight = 80; // kg

      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].collectedAt = new Date();
      testRoute.bins[1].fillLevelAtCollection = 60;
      testRoute.bins[1].actualWeight = 30; // kg

      testRoute.bins[2].status = 'collected';
      testRoute.bins[2].collectedAt = new Date();
      testRoute.bins[2].fillLevelAtCollection = 90;
      testRoute.bins[2].actualWeight = 67.5; // kg

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Route completed successfully');
      
      // Verify route completion data
      const completedRoute = response.body.data.route;
      expect(completedRoute.status).toBe('completed');
      expect(completedRoute.completedAt).toBeDefined();
      expect(completedRoute.routeDuration).toBeGreaterThan(0);
      expect(completedRoute.binsCollected).toBe(3);
      expect(completedRoute.wasteCollected).toBe(178); // 80 + 30 + 67.5 rounded
      expect(completedRoute.recyclableWaste).toBe(30); // Only bin 1 is recyclable
      expect(completedRoute.efficiency).toBe(100); // 3/3 * 100
      
      // Verify analytics data
      const analytics = response.body.data.analytics;
      expect(analytics.binsCollected).toBe(3);
      expect(analytics.wasteCollected).toBe(178);
      expect(analytics.recyclableWaste).toBe(30);
      expect(analytics.efficiency).toBe(100);
    });

    it('should complete route with some bins skipped', async () => {
      // Collect first two bins, skip the third
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].collectedAt = new Date();
      testRoute.bins[0].actualWeight = 80;

      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].collectedAt = new Date();
      testRoute.bins[1].actualWeight = 30;

      testRoute.bins[2].status = 'skipped';
      testRoute.bins[2].notes = 'Bin inaccessible due to construction';

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.binsCollected).toBe(2);
      expect(response.body.data.route.wasteCollected).toBe(110); // 80 + 30
      expect(response.body.data.route.efficiency).toBe(67); // 2/3 * 100 rounded
    });

    it('should calculate recyclable waste correctly', async () => {
      // Collect all bins
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].actualWeight = 80; // General Waste

      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].actualWeight = 30; // Recyclable

      testRoute.bins[2].status = 'collected';
      testRoute.bins[2].actualWeight = 67.5; // Organic

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.route.recyclableWaste).toBe(30); // Only bin 1 is recyclable
    });

    it('should calculate route duration correctly', async () => {
      // Set start time to 2 hours ago
      testRoute.startedAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      // Collect all bins
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].actualWeight = 80;
      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].actualWeight = 30;
      testRoute.bins[2].status = 'collected';
      testRoute.bins[2].actualWeight = 67.5;

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      // Duration should be around 120 minutes (2 hours)
      expect(response.body.data.route.routeDuration).toBeGreaterThan(110);
      expect(response.body.data.route.routeDuration).toBeLessThan(130);
    });

    it('should use estimated weight if actual weight is not provided', async () => {
      // Collect bins without actual weight
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].fillLevelAtCollection = 80;
      // No actualWeight provided

      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].fillLevelAtCollection = 60;
      // No actualWeight provided

      testRoute.bins[2].status = 'collected';
      testRoute.bins[2].fillLevelAtCollection = 90;
      // No actualWeight provided

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      // Estimated: (80% * 100) + (60% * 50) + (90% * 75) = 80 + 30 + 67.5 = 177.5 rounded to 178
      expect(response.body.data.route.wasteCollected).toBe(178);
    });

    it('should handle actual weight of 0 kg correctly', async () => {
      // Collect bins with 0 actual weight (valid case - bin was empty)
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].actualWeight = 0;

      testRoute.bins[1].status = 'collected';
      testRoute.bins[1].actualWeight = 0;

      testRoute.bins[2].status = 'collected';
      testRoute.bins[2].actualWeight = 0;

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.route.wasteCollected).toBe(0);
      expect(response.body.data.route.recyclableWaste).toBe(0);
    });

    it('should fail if route is not in-progress', async () => {
      // Reset route to scheduled
      testRoute.status = 'scheduled';
      testRoute.bins[0].status = 'collected';
      testRoute.bins[1].status = 'collected';
      testRoute.bins[2].status = 'collected';
      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route must be in-progress to complete');
    });

    it('should fail if not all bins are processed', async () => {
      // Only collect one bin, leave others pending
      testRoute.bins[0].status = 'collected';
      testRoute.bins[0].actualWeight = 80;
      // bins[1] and bins[2] remain 'pending'

      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All bins must be collected or skipped before completing the route');
      
      // Verify detailed data is returned
      expect(response.body.data.totalBins).toBe(3);
      expect(response.body.data.collectedBins).toBe(1);
      expect(response.body.data.pendingBins).toBe(2);
      expect(response.body.data.skippedBins).toBe(0);
    });

    it('should fail if route is not assigned to the collector', async () => {
      // Create another collector
      const uniqueId = Date.now().toString().slice(-8);
      const otherCollector = await User.create({
        firstName: 'Other',
        lastName: 'Collector',
        username: 'oth' + uniqueId,
        email: 'oth' + uniqueId + '@test.com',
        password: 'password123',
        nic: '111222333V',
        dateOfBirth: new Date('1992-01-01'),
        phoneNo: '0771112222',
        role: 'collector'
      });

      const otherToken = jwt.sign(
        { id: otherCollector._id, role: otherCollector.role },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
      );

      // Collect all bins
      testRoute.bins[0].status = 'collected';
      testRoute.bins[1].status = 'collected';
      testRoute.bins[2].status = 'collected';
      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('This route is not assigned to you');
    });

    it('should fail without authentication', async () => {
      testRoute.bins[0].status = 'collected';
      testRoute.bins[1].status = 'collected';
      testRoute.bins[2].status = 'collected';
      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .send({});

      expect(response.status).toBe(401);
    });

    it('should fail if user is not a collector', async () => {
      testRoute.bins[0].status = 'collected';
      testRoute.bins[1].status = 'collected';
      testRoute.bins[2].status = 'collected';
      await testRoute.save();

      const response = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(403);
    });

    it('should calculate efficiency as 0 for route with no bins', async () => {
      // Create route with no bins
      const uniqueId = Date.now().toString().slice(-8);
      const emptyRoute = await Route.create({
        routeName: 'Empty Route ' + uniqueId,
        createdBy: adminUser._id,
        assignedTo: collectorUser._id,
        bins: [],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress',
        startedAt: new Date()
      });

      const response = await request(app)
        .put(`/api/routes/${emptyRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.route.efficiency).toBe(0);
      expect(response.body.data.route.binsCollected).toBe(0);
      expect(response.body.data.route.wasteCollected).toBe(0);
    });
  });

  // ==================== INTEGRATION TEST ====================

  describe('Integration: Complete Route Flow with Pre & Post Route', () => {
    it('should complete full route lifecycle from start to completion', async () => {
      // Step 1: Start route with pre-route checklist
      const preRouteChecklist = {
        completedAt: new Date(),
        items: [
          { id: '1', label: 'Vehicle inspection completed', checked: true },
          { id: '2', label: 'Safety equipment available', checked: true },
          { id: '3', label: 'Collection containers ready', checked: true },
          { id: '4', label: 'Route map reviewed', checked: true },
          { id: '5', label: 'Communication device functional', checked: true }
        ]
      };

      const startResponse = await request(app)
        .put(`/api/routes/${testRoute._id}/start`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({ preRouteChecklist });

      expect(startResponse.status).toBe(200);
      expect(startResponse.body.data.route.status).toBe('in-progress');
      expect(startResponse.body.data.route.preRouteChecklist.completed).toBe(true);

      // Step 2: Collect bins one by one
      const route = await Route.findById(testRoute._id);
      
      // Set startedAt to 30 minutes ago to ensure duration > 0
      route.startedAt = new Date(Date.now() - 30 * 60 * 1000);
      
      route.bins[0].status = 'collected';
      route.bins[0].collectedAt = new Date();
      route.bins[0].actualWeight = 80;

      route.bins[1].status = 'collected';
      route.bins[1].collectedAt = new Date();
      route.bins[1].actualWeight = 30;

      route.bins[2].status = 'collected';
      route.bins[2].collectedAt = new Date();
      route.bins[2].actualWeight = 67.5;

      await route.save();

      // Step 3: Complete route and verify post-route summary
      const completeResponse = await request(app)
        .put(`/api/routes/${testRoute._id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({});

      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.success).toBe(true);
      
      const completedRoute = completeResponse.body.data.route;
      
      // Verify complete route data
      expect(completedRoute.status).toBe('completed');
      expect(completedRoute.startedAt).toBeDefined();
      expect(completedRoute.completedAt).toBeDefined();
      expect(completedRoute.preRouteChecklist.completed).toBe(true);
      expect(completedRoute.binsCollected).toBe(3);
      expect(completedRoute.wasteCollected).toBe(178);
      expect(completedRoute.recyclableWaste).toBe(30);
      expect(completedRoute.efficiency).toBe(100);
      expect(completedRoute.routeDuration).toBeGreaterThanOrEqual(25); // Should be around 30 minutes
      expect(completedRoute.routeDuration).toBeLessThan(35);
      
      // Verify all bins were processed
      expect(completedRoute.bins.length).toBe(3);
      expect(completedRoute.bins.every(b => b.status === 'collected')).toBe(true);
    });
  });
});
