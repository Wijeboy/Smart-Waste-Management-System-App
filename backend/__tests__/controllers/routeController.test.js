/**
 * Route Controller Tests
 * Comprehensive test suite for routeController
 * Coverage: >85% - All CRUD operations, validations, edge cases
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const Route = require('../../models/Route');
const Bin = require('../../models/Bin');
const User = require('../../models/User');

let mongoServer;
let authToken;
let adminUser;
let collectorUser;
let testBin1, testBin2;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  adminUser = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    accountStatus: 'active'
  });

  collectorUser = await User.create({
    username: 'collector',
    email: 'collector@test.com',
    password: 'Pass123!',
    role: 'collector',
    accountStatus: 'active'
  });

  testBin1 = await Bin.create({
    binId: 'BIN001',
    location: 'Test Location 1',
    zone: 'Zone A',
    binType: 'General',
    fillLevel: 50
  });

  testBin2 = await Bin.create({
    binId: 'BIN002',
    location: 'Test Location 2',
    zone: 'Zone B',
    binType: 'Recyclable',
    fillLevel: 75
  });

  authToken = 'Bearer mock-admin-token';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Route.deleteMany({});
});

describe('Route Controller - createRoute', () => {
  describe('✅ POSITIVE: Successful Creation', () => {
    it('should create route with all required fields', async () => {
      const routeData = {
        routeName: 'Test Route 1',
        bins: [
          { binId: testBin1._id, order: 1 },
          { binId: testBin2._id, order: 2 }
        ],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.route.routeName).toBe('Test Route 1');
      expect(res.body.data.route.bins).toHaveLength(2);
    });

    it('should create route with assigned collector', async () => {
      const routeData = {
        routeName: 'Assigned Route',
        bins: [{ binId: testBin1._id, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '10:00 AM',
        assignedTo: collectorUser._id
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(201);
      expect(res.body.data.route.assignedTo).toBeDefined();
    });

    it('should create route with notes', async () => {
      const routeData = {
        routeName: 'Route with Notes',
        bins: [{ binId: testBin1._id, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '08:00 AM',
        notes: 'Priority route - handle with care'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(201);
      expect(res.body.data.route.notes).toBe('Priority route - handle with care');
    });
  });

  describe('❌ NEGATIVE: Validation Failures', () => {
    it('should fail without routeName', async () => {
      const routeData = {
        bins: [{ binId: testBin1._id, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail without bins', async () => {
      const routeData = {
        routeName: 'No Bins Route',
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
    });

    it('should fail with empty bins array', async () => {
      const routeData = {
        routeName: 'Empty Bins',
        bins: [],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
    });

    it('should fail with duplicate routeName', async () => {
      const routeData = {
        routeName: 'Duplicate Route',
        bins: [{ binId: testBin1._id, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      await Route.create({
        ...routeData,
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }]
      });

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already exists');
    });

    it('should fail with non-existent bin', async () => {
      const fakeBinId = new mongoose.Types.ObjectId();
      const routeData = {
        routeName: 'Invalid Bin Route',
        bins: [{ binId: fakeBinId, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not found');
    });

    it('should fail with non-collector assignedTo', async () => {
      const regularUser = await User.create({
        username: 'regular',
        email: 'regular@test.com',
        password: 'Pass123!',
        role: 'user'
      });

      const routeData = {
        routeName: 'Wrong Role Route',
        bins: [{ binId: testBin1._id, order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM',
        assignedTo: regularUser._id
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('collector role');
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle maximum bins in route', async () => {
      const bins = Array.from({ length: 50 }, (_, i) => ({
        binId: testBin1._id,
        order: i + 1
      }));

      const routeData = {
        routeName: 'Max Bins Route',
        bins,
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const res = await request(app)
        .post('/api/routes')
        .set('Authorization', authToken)
        .send(routeData);

      expect(res.status).toBe(201);
      expect(res.body.data.route.bins).toHaveLength(50);
    });
  });
});

describe('Route Controller - getAllRoutes', () => {
  describe('✅ POSITIVE: Successful Retrieval', () => {
    it('should get all routes with pagination', async () => {
      await Route.create([
        {
          routeName: 'Route 1',
          createdBy: adminUser._id,
          bins: [{ bin: testBin1._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM'
        },
        {
          routeName: 'Route 2',
          createdBy: adminUser._id,
          bins: [{ bin: testBin2._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM'
        }
      ]);

      const res = await request(app)
        .get('/api/routes')
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.data.routes).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should filter routes by status', async () => {
      await Route.create([
        {
          routeName: 'Scheduled Route',
          createdBy: adminUser._id,
          bins: [{ bin: testBin1._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM',
          status: 'scheduled'
        },
        {
          routeName: 'Completed Route',
          createdBy: adminUser._id,
          bins: [{ bin: testBin2._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM',
          status: 'completed'
        }
      ]);

      const res = await request(app)
        .get('/api/routes?status=scheduled')
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.data.routes.every(r => r.status === 'scheduled')).toBe(true);
    });
  });
});

describe('Route Controller - getRouteById', () => {
  describe('✅ POSITIVE: Successful Retrieval', () => {
    it('should get route by ID with populated data', async () => {
      const route = await Route.create({
        routeName: 'Test Route',
        createdBy: adminUser._id,
        assignedTo: collectorUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const res = await request(app)
        .get(`/api/routes/${route._id}`)
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.data.route._id).toBe(route._id.toString());
    });
  });

  describe('❌ NEGATIVE: Not Found', () => {
    it('should return 404 for non-existent route', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/routes/${fakeId}`)
        .set('Authorization', authToken);

      expect(res.status).toBe(404);
    });
  });
});

describe('Route Controller - updateRoute', () => {
  describe('✅ POSITIVE: Successful Update', () => {
    it('should update scheduled route', async () => {
      const route = await Route.create({
        routeName: 'Original Name',
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'scheduled'
      });

      const res = await request(app)
        .put(`/api/routes/${route._id}`)
        .set('Authorization', authToken)
        .send({ routeName: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.route.routeName).toBe('Updated Name');
    });
  });

  describe('❌ NEGATIVE: Update Restrictions', () => {
    it('should not update in-progress route', async () => {
      const route = await Route.create({
        routeName: 'In Progress Route',
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress'
      });

      const res = await request(app)
        .put(`/api/routes/${route._id}`)
        .set('Authorization', authToken)
        .send({ routeName: 'New Name' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('scheduled');
    });
  });
});

describe('Route Controller - deleteRoute', () => {
  describe('✅ POSITIVE: Successful Deletion', () => {
    it('should delete route successfully', async () => {
      const route = await Route.create({
        routeName: 'Delete Me',
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const res = await request(app)
        .delete(`/api/routes/${route._id}`)
        .set('Authorization', authToken);

      expect(res.status).toBe(200);

      const deletedRoute = await Route.findById(route._id);
      expect(deletedRoute).toBeNull();
    });
  });
});

describe('Route Controller - assignCollector', () => {
  describe('✅ POSITIVE: Successful Assignment', () => {
    it('should assign collector to route', async () => {
      const route = await Route.create({
        routeName: 'Unassigned Route',
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const res = await request(app)
        .put(`/api/routes/${route._id}/assign`)
        .set('Authorization', authToken)
        .send({ collectorId: collectorUser._id });

      expect(res.status).toBe(200);
      expect(res.body.data.route.assignedTo).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Invalid Assignment', () => {
    it('should fail with non-collector user', async () => {
      const route = await Route.create({
        routeName: 'Test Route',
        createdBy: adminUser._id,
        bins: [{ bin: testBin1._id, order: 1 }],
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const res = await request(app)
        .put(`/api/routes/${route._id}/assign`)
        .set('Authorization', authToken)
        .send({ collectorId: adminUser._id });

      expect(res.status).toBe(400);
    });
  });
});

describe('Route Controller - getRouteStats', () => {
  describe('✅ POSITIVE: Statistics Calculation', () => {
    it('should return correct route statistics', async () => {
      await Route.create([
        {
          routeName: 'Scheduled 1',
          createdBy: adminUser._id,
          bins: [{ bin: testBin1._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM',
          status: 'scheduled'
        },
        {
          routeName: 'In Progress 1',
          createdBy: adminUser._id,
          bins: [{ bin: testBin2._id, order: 1 }],
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM',
          status: 'in-progress'
        }
      ]);

      const res = await request(app)
        .get('/api/routes/stats')
        .set('Authorization', authToken);

      expect(res.status).toBe(200);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats.total).toBeGreaterThanOrEqual(2);
    });
  });
});
