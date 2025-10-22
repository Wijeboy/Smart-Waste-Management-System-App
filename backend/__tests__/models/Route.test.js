/**
 * Route Model Tests
 * Comprehensive test suite for Route model
 * Coverage: >80% - All CRUD operations, validations, virtuals, and edge cases
 */

const mongoose = require('mongoose');
const Route = require('../../models/Route');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup: Connect to in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Teardown: Disconnect and stop MongoDB
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await Route.deleteMany({});
});

describe('Route Model - Schema Validation', () => {
  describe('✅ POSITIVE: Valid Route Creation', () => {
    it('should create a valid route with all required fields', async () => {
      const validRoute = {
        routeName: 'Downtown Collection Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date('2025-10-25'),
        scheduledTime: '09:00 AM',
        bins: [
          {
            bin: new mongoose.Types.ObjectId(),
            order: 1,
            status: 'pending'
          }
        ]
      };

      const route = new Route(validRoute);
      const savedRoute = await route.save();

      expect(savedRoute._id).toBeDefined();
      expect(savedRoute.routeName).toBe(validRoute.routeName);
      expect(savedRoute.createdBy).toEqual(validRoute.createdBy);
      expect(savedRoute.status).toBe('scheduled');
      expect(savedRoute.createdAt).toBeDefined();
      expect(savedRoute.updatedAt).toBeDefined();
    });

    it('should create route with optional assignedTo field', async () => {
      const collectorId = new mongoose.Types.ObjectId();
      const route = new Route({
        routeName: 'Assigned Route',
        createdBy: new mongoose.Types.ObjectId(),
        assignedTo: collectorId,
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM',
        bins: []
      });

      const savedRoute = await route.save();
      expect(savedRoute.assignedTo).toEqual(collectorId);
    });

    it('should create route with multiple bins in correct order', async () => {
      const route = new Route({
        routeName: 'Multi-Bin Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '08:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1 },
          { bin: new mongoose.Types.ObjectId(), order: 2 },
          { bin: new mongoose.Types.ObjectId(), order: 3 }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.bins).toHaveLength(3);
      expect(savedRoute.bins[0].order).toBe(1);
      expect(savedRoute.bins[2].order).toBe(3);
    });
  });

  describe('❌ NEGATIVE: Invalid Route Creation', () => {
    it('should fail without routeName', async () => {
      const route = new Route({
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should fail without createdBy', async () => {
      const route = new Route({
        routeName: 'Test Route',
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should fail without scheduledDate', async () => {
      const route = new Route({
        routeName: 'Test Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledTime: '09:00 AM'
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should fail without scheduledTime', async () => {
      const route = new Route({
        routeName: 'Test Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date()
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should fail with duplicate routeName', async () => {
      const routeData = {
        routeName: 'Duplicate Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      };

      await new Route(routeData).save();
      const duplicateRoute = new Route(routeData);

      await expect(duplicateRoute.save()).rejects.toThrow();
    });

    it('should fail with invalid status enum value', async () => {
      const route = new Route({
        routeName: 'Invalid Status Route',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'invalid-status'
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should fail with invalid bin status enum value', async () => {
      const route = new Route({
        routeName: 'Invalid Bin Status',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [{
          bin: new mongoose.Types.ObjectId(),
          order: 1,
          status: 'invalid-bin-status'
        }]
      });

      await expect(route.save()).rejects.toThrow();
    });
  });

  describe('🔍 BOUNDARY: Field Length and Value Limits', () => {
    it('should fail when routeName exceeds 100 characters', async () => {
      const route = new Route({
        routeName: 'A'.repeat(101),
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should accept routeName at exactly 100 characters', async () => {
      const route = new Route({
        routeName: 'A'.repeat(100),
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const savedRoute = await route.save();
      expect(savedRoute.routeName).toHaveLength(100);
    });

    it('should fail when notes exceed 500 characters', async () => {
      const route = new Route({
        routeName: 'Notes Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        notes: 'A'.repeat(501)
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should accept notes at exactly 500 characters', async () => {
      const notes = 'A'.repeat(500);
      const route = new Route({
        routeName: 'Notes Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        notes
      });

      const savedRoute = await route.save();
      expect(savedRoute.notes).toHaveLength(500);
    });

    it('should fail when bin order is less than 1', async () => {
      const route = new Route({
        routeName: 'Order Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [{
          bin: new mongoose.Types.ObjectId(),
          order: 0
        }]
      });

      await expect(route.save()).rejects.toThrow();
    });

    it('should accept bin order at minimum value of 1', async () => {
      const route = new Route({
        routeName: 'Order Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [{
          bin: new mongoose.Types.ObjectId(),
          order: 1
        }]
      });

      const savedRoute = await route.save();
      expect(savedRoute.bins[0].order).toBe(1);
    });
  });
});

describe('Route Model - Virtuals', () => {
  describe('✅ POSITIVE: Virtual Field Calculations', () => {
    it('should calculate totalBins correctly', async () => {
      const route = new Route({
        routeName: 'Virtual Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1 },
          { bin: new mongoose.Types.ObjectId(), order: 2 },
          { bin: new mongoose.Types.ObjectId(), order: 3 }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.totalBins).toBe(3);
    });

    it('should calculate collectedBins correctly', async () => {
      const route = new Route({
        routeName: 'Collected Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 3, status: 'pending' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.collectedBins).toBe(2);
    });

    it('should calculate pendingBins correctly', async () => {
      const route = new Route({
        routeName: 'Pending Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'pending' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 3, status: 'pending' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.pendingBins).toBe(2);
    });

    it('should calculate skippedBins correctly', async () => {
      const route = new Route({
        routeName: 'Skipped Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'skipped' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 3, status: 'skipped' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.skippedBins).toBe(2);
    });

    it('should calculate progress percentage correctly', async () => {
      const route = new Route({
        routeName: 'Progress Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'pending' },
          { bin: new mongoose.Types.ObjectId(), order: 3, status: 'pending' },
          { bin: new mongoose.Types.ObjectId(), order: 4, status: 'pending' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.progress).toBe(25); // 1/4 = 25%
    });

    it('should return true for isComplete when all bins are collected', async () => {
      const route = new Route({
        routeName: 'Complete Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'collected' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.isComplete).toBe(true);
    });

    it('should return true for isComplete when bins are collected or skipped', async () => {
      const route = new Route({
        routeName: 'Mixed Complete Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'skipped' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.isComplete).toBe(true);
    });

    it('should return false for isComplete when any bin is pending', async () => {
      const route = new Route({
        routeName: 'Incomplete Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'pending' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.isComplete).toBe(false);
    });
  });

  describe('🔍 BOUNDARY: Virtual Edge Cases', () => {
    it('should return 0 for progress when bins array is empty', async () => {
      const route = new Route({
        routeName: 'Empty Bins',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: []
      });

      const savedRoute = await route.save();
      expect(savedRoute.progress).toBe(0);
    });

    it('should return false for isComplete when bins array is empty', async () => {
      const route = new Route({
        routeName: 'Empty Bins Complete',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: []
      });

      const savedRoute = await route.save();
      expect(savedRoute.isComplete).toBe(false);
    });

    it('should return 100 for progress when all bins are collected', async () => {
      const route = new Route({
        routeName: '100% Progress',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
          { bin: new mongoose.Types.ObjectId(), order: 2, status: 'collected' }
        ]
      });

      const savedRoute = await route.save();
      expect(savedRoute.progress).toBe(100);
    });
  });
});

describe('Route Model - Middleware', () => {
  describe('✅ POSITIVE: Pre-save Middleware', () => {
    it('should update updatedAt timestamp on save', async () => {
      const route = new Route({
        routeName: 'Timestamp Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const savedRoute = await route.save();
      const initialUpdatedAt = savedRoute.updatedAt;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 10));
      savedRoute.routeName = 'Updated Route Name';
      await savedRoute.save();

      expect(savedRoute.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });
});

describe('Route Model - CRUD Operations', () => {
  describe('✅ POSITIVE: Read Operations', () => {
    it('should find route by ID', async () => {
      const route = new Route({
        routeName: 'Find By ID',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const savedRoute = await route.save();
      const foundRoute = await Route.findById(savedRoute._id);

      expect(foundRoute).toBeDefined();
      expect(foundRoute.routeName).toBe('Find By ID');
    });

    it('should find routes by status', async () => {
      await Route.create([
        {
          routeName: 'Scheduled 1',
          createdBy: new mongoose.Types.ObjectId(),
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM',
          status: 'scheduled'
        },
        {
          routeName: 'In Progress 1',
          createdBy: new mongoose.Types.ObjectId(),
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM',
          status: 'in-progress'
        }
      ]);

      const scheduledRoutes = await Route.find({ status: 'scheduled' });
      expect(scheduledRoutes).toHaveLength(1);
      expect(scheduledRoutes[0].routeName).toBe('Scheduled 1');
    });
  });

  describe('✅ POSITIVE: Update Operations', () => {
    it('should update route status', async () => {
      const route = new Route({
        routeName: 'Status Update',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'scheduled'
      });

      const savedRoute = await route.save();
      savedRoute.status = 'in-progress';
      savedRoute.startedAt = new Date();
      await savedRoute.save();

      const updatedRoute = await Route.findById(savedRoute._id);
      expect(updatedRoute.status).toBe('in-progress');
      expect(updatedRoute.startedAt).toBeDefined();
    });

    it('should update bin status', async () => {
      const route = new Route({
        routeName: 'Bin Update',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        bins: [
          { bin: new mongoose.Types.ObjectId(), order: 1, status: 'pending' }
        ]
      });

      const savedRoute = await route.save();
      savedRoute.bins[0].status = 'collected';
      savedRoute.bins[0].collectedAt = new Date();
      await savedRoute.save();

      const updatedRoute = await Route.findById(savedRoute._id);
      expect(updatedRoute.bins[0].status).toBe('collected');
      expect(updatedRoute.bins[0].collectedAt).toBeDefined();
    });
  });

  describe('✅ POSITIVE: Delete Operations', () => {
    it('should delete route by ID', async () => {
      const route = new Route({
        routeName: 'Delete Test',
        createdBy: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM'
      });

      const savedRoute = await route.save();
      await Route.findByIdAndDelete(savedRoute._id);

      const deletedRoute = await Route.findById(savedRoute._id);
      expect(deletedRoute).toBeNull();
    });
  });
});

describe('Route Model - JSON Serialization', () => {
  it('should include virtuals in JSON output', async () => {
    const route = new Route({
      routeName: 'JSON Test',
      createdBy: new mongoose.Types.ObjectId(),
      scheduledDate: new Date(),
      scheduledTime: '09:00 AM',
      bins: [
        { bin: new mongoose.Types.ObjectId(), order: 1, status: 'collected' },
        { bin: new mongoose.Types.ObjectId(), order: 2, status: 'pending' }
      ]
    });

    const savedRoute = await route.save();
    const json = savedRoute.toJSON();

    expect(json.totalBins).toBe(2);
    expect(json.collectedBins).toBe(1);
    expect(json.pendingBins).toBe(1);
    expect(json.progress).toBe(50);
    expect(json.isComplete).toBe(false);
  });
});
