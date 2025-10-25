/**
 * Routes Routes Tests
 * Comprehensive test suite for route management endpoints
 * Coverage: >80% - Admin & Collector endpoints, auth, positive/negative/edge cases
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

// Mock the auth middleware - must be before requiring routes
jest.mock('../../middleware/auth', () => ({
  protect: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  },
  authorize: (...roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `User role ${req.user?.role} is not authorized to access this route` 
        });
      }
      next();
    };
  }
}));

const routesRouter = require('../../routes/routes');
const Route = require('../../models/Route');

let app;
let mongoServer;

const generateToken = (userId, role = 'admin') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  app = express();
  app.use(express.json());
  app.use('/api/routes', routesRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Route.deleteMany({});
});

describe('Routes - Authentication & Authorization', () => {
  describe('❌ NEGATIVE: Unauthorized Access', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/routes');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/routes')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.status).toBe(401);
    });
  });

  describe('❌ NEGATIVE: Forbidden Access', () => {
    it('should return 403 when user tries to access admin routes', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'user');
      const response = await request(app)
        .get('/api/routes')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it('should return 403 when collector tries to create route', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'collector');
      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send({ routeName: 'Test Route' });
      expect(response.status).toBe(403);
    });

    it('should return 403 when admin tries to access collector routes', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      const response = await request(app)
        .get('/api/routes/my-routes')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(403);
    });
  });
});

describe('Admin Routes - CRUD Operations', () => {
  describe('✅ POSITIVE: Create Route', () => {
    it('should create route successfully', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const routeData = {
        routeName: 'Downtown Collection',
        scheduledDate: new Date('2025-10-30'),
        scheduledTime: '09:00 AM',
        bins: []
      };
      
      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send(routeData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.routeName).toBe('Downtown Collection');
    });

    it('should create route with bins', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const routeData = {
        routeName: 'Multi-Bin Route',
        scheduledDate: new Date('2025-10-30'),
        scheduledTime: '10:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1 },
          { bin: new mongoose.Types.ObjectId(), order: 2 }
        ]
      };
      
      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send(routeData);
      
      expect(response.status).toBe(201);
      expect(response.body.data.route.bins).toHaveLength(2);
    });
  });

  describe('❌ NEGATIVE: Create Route Validation', () => {
    it('should fail without routeName', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate routeName', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      await Route.create({
        routeName: 'Duplicate Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          routeName: 'Duplicate Route',
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('✅ POSITIVE: Get All Routes', () => {
    it('should get all routes with pagination', async () => {
      const adminId = new mongoose.Types.ObjectId();
      
      await Route.create([
        { routeName: 'Route 1', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '09:00 AM' },
        { routeName: 'Route 2', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '10:00 AM' },
        { routeName: 'Route 3', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '11:00 AM' }
      ]);
      
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/routes')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.routes).toHaveLength(3);
    });

    it('should filter routes by status', async () => {
      const adminId = new mongoose.Types.ObjectId();
      
      await Route.create([
        { routeName: 'Scheduled Route', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '09:00 AM', status: 'scheduled' },
        { routeName: 'In Progress Route', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '10:00 AM', status: 'in-progress' }
      ]);
      
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/routes?status=scheduled')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.routes).toHaveLength(1);
      expect(response.body.data.routes[0].status).toBe('scheduled');
    });
  });

  describe('✅ POSITIVE: Get Route By ID', () => {
    it('should get route details by ID', async () => {
      const route = await Route.create({
        routeName: 'Test Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .get(`/api/routes/${route._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.routeName).toBe('Test Route');
    });

    it('should return 404 for non-existent route', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/routes/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('✅ POSITIVE: Update Route', () => {
    it('should update route successfully', async () => {
      const route = await Route.create({
        routeName: 'Original Name',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ routeName: 'Updated Name' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.routeName).toBe('Updated Name');
    });
  });

  describe('✅ POSITIVE: Delete Route', () => {
    it('should delete route successfully', async () => {
      const route = await Route.create({
        routeName: 'Delete Me',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .delete(`/api/routes/${route._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const deletedRoute = await Route.findById(route._id);
      expect(deletedRoute).toBeNull();
    });
  });

  describe('✅ POSITIVE: Assign Collector', () => {
    it('should assign collector to route', async () => {
      const route = await Route.create({
        routeName: 'Unassigned Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const collectorId = new mongoose.Types.ObjectId();
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/assign`)
        .set('Authorization', `Bearer ${token}`)
        .send({ collectorId });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.assignedTo).toBeDefined();
    });
  });

  describe('✅ POSITIVE: Get Route Stats', () => {
    it('should get route statistics', async () => {
      const adminId = new mongoose.Types.ObjectId();
      
      await Route.create([
        { routeName: 'Route 1', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '09:00 AM', status: 'scheduled' },
        { routeName: 'Route 2', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '10:00 AM', status: 'in-progress' },
        { routeName: 'Route 3', createdBy: adminId, scheduledDate: new Date(), scheduledTime: '11:00 AM', status: 'completed' }
      ]);
      
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/routes/stats')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
    });
  });
});

describe('Collector Routes - Route Management', () => {
  describe('✅ POSITIVE: Get My Routes', () => {
    it('should get collector assigned routes', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      
      await Route.create([
        { routeName: 'My Route 1', createdBy: new mongoose.Types.ObjectId(), assignedTo: collectorId, scheduledDate: new Date(), scheduledTime: '09:00 AM' },
        { routeName: 'Other Route', createdBy: new mongoose.Types.ObjectId(), assignedTo: new mongoose.Types.ObjectId(), scheduledDate: new Date(), scheduledTime: '10:00 AM' }
      ]);
      
      const token = generateToken(collectorId, 'collector');
      
      const response = await request(app)
        .get('/api/routes/my-routes')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.routes).toHaveLength(1);
    });
  });

  describe('✅ POSITIVE: Start Route', () => {
    it('should start route successfully', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      const route = await Route.create({
        routeName: 'Start Me',
        createdBy: new mongoose.Types.ObjectId(),
        assignedTo: collectorId,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'scheduled'
      });
      
      const token = generateToken(collectorId, 'collector');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/start`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.status).toBe('in-progress');
    });
  });

  describe('✅ POSITIVE: Complete Route', () => {
    it('should complete route successfully', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      const route = await Route.create({
        routeName: 'Complete Me',
        createdBy: new mongoose.Types.ObjectId(),
        assignedTo: collectorId,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress'
      });
      
      const token = generateToken(collectorId, 'collector');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/complete`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.route.status).toBe('completed');
    });
  });

  describe('✅ POSITIVE: Collect Bin', () => {
    it('should mark bin as collected', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      const binId = new mongoose.Types.ObjectId();
      const route = await Route.create({
        routeName: 'Bin Collection Route',
        createdBy: new mongoose.Types.ObjectId(),
        assignedTo: collectorId,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress',
        bins: [{ bin: binId, order: 1, status: 'pending' }]
      });
      
      const token = generateToken(collectorId, 'collector');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/bins/${binId}/collect`)
        .set('Authorization', `Bearer ${token}`)
        .send({ wasteType: 'general', weight: 15 });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('✅ POSITIVE: Skip Bin', () => {
    it('should mark bin as skipped with reason', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      const binId = new mongoose.Types.ObjectId();
      const route = await Route.create({
        routeName: 'Skip Bin Route',
        createdBy: new mongoose.Types.ObjectId(),
        assignedTo: collectorId,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress',
        bins: [{ bin: binId, order: 1, status: 'pending' }]
      });
      
      const token = generateToken(collectorId, 'collector');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/bins/${binId}/skip`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Bin not accessible' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

describe('Routes - Edge Cases', () => {
  describe('🔍 BOUNDARY: Empty Results', () => {
    it('should handle empty route list', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .get('/api/routes')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.routes).toHaveLength(0);
    });

    it('should handle collector with no assigned routes', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'collector');
      
      const response = await request(app)
        .get('/api/routes/my-routes')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.routes).toHaveLength(0);
    });
  });

  describe('🔍 BOUNDARY: Invalid IDs', () => {
    it('should return 400 for invalid route ID format', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .get('/api/routes/invalid-id')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid bin ID format', async () => {
      const route = await Route.create({
        routeName: 'Test Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });
      
      const token = generateToken(new mongoose.Types.ObjectId(), 'collector');
      
      const response = await request(app)
        .put(`/api/routes/${route._id}/bins/invalid-bin-id/collect`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
    });
  });
});
