/**
 * Bin Collection Controller Tests
 * Test suite for bin collection functionality (collectBin and skipBin)
 */

const mongoose = require('mongoose');
const Route = require('../../models/Route');
const Bin = require('../../models/Bin');
const User = require('../../models/User');
const { collectBin, skipBin } = require('../../controllers/routeController');
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
  await Bin.deleteMany({});
  await User.deleteMany({});
});

describe('Bin Collection - collectBin', () => {
  describe('✅ POSITIVE: Successful Bin Collection', () => {
    it('should successfully collect a bin with actual weight', async () => {
      // Create test user (collector)
      const collector = await User.create({
        firstName: 'John',
        lastName: 'Collector',
        username: 'johncollector',
        email: 'john@collector.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '1234567890',
        nic: '199012345678',
        dateOfBirth: new Date('1990-01-01')
      });

      // Create test bin
      const bin = await Bin.create({
        binId: 'BIN001',
        location: '123 Main St',
        zone: 'Zone A',
        binType: 'General Waste',
        capacity: 100,
        fillLevel: 80,
        status: 'active'
      });

      // Create test route
      const route = await Route.create({
        routeName: 'Test Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      // Mock request and response
      const req = {
        params: { id: route._id.toString(), binId: bin._id.toString() },
        body: { actualWeight: 75 },
        user: { id: collector._id.toString(), firstName: 'John', lastName: 'Collector' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bin collected successfully',
          data: expect.objectContaining({
            collectedWeight: 75
          })
        })
      );

      // Verify route was updated
      const updatedRoute = await Route.findById(route._id);
      expect(updatedRoute.bins[0].status).toBe('collected');
      expect(updatedRoute.bins[0].actualWeight).toBe(75);
      expect(updatedRoute.bins[0].collectedAt).toBeDefined();
    });

    it('should collect bin without weight and use default', async () => {
      const collector = await User.create({
        firstName: 'Jane',
        lastName: 'Collector',
        username: 'janecollector',
        email: 'jane@collector.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '9876543210',
        nic: '199112345678',
        dateOfBirth: new Date('1991-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN002',
        location: '456 Oak Ave',
        zone: 'Zone B',
        binType: 'Recyclable',
        capacity: 50,
        fillLevel: 60,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Recycle Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id.toString(), binId: bin._id.toString() },
        body: {},
        user: { id: collector._id.toString(), firstName: 'Jane', lastName: 'Collector' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bin collected successfully'
        })
      );
    });
  });

  describe('❌ NEGATIVE: Failed Bin Collection', () => {
    it('should fail when route not found', async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId(), binId: new mongoose.Types.ObjectId() },
        body: { actualWeight: 50 },
        user: { id: new mongoose.Types.ObjectId().toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Route not found'
        })
      );
    });

    it('should fail when route not assigned to collector', async () => {
      const collector1 = await User.create({
        firstName: 'Collector',
        lastName: 'One',
        username: 'collector1',
        email: 'collector1@test.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '1111111111',
        nic: '199212345678',
        dateOfBirth: new Date('1992-01-01')
      });

      const collector2 = await User.create({
        firstName: 'Collector',
        lastName: 'Two',
        username: 'collector2',
        email: 'collector2@test.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '2222222222',
        nic: '199312345678',
        dateOfBirth: new Date('1993-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN003',
        location: '789 Pine St',
        zone: 'Zone C',
        binType: 'General Waste',
        capacity: 80,
        fillLevel: 50,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Assigned Route',
        createdBy: collector1._id,
        assignedTo: collector1._id,
        scheduledDate: new Date(),
        scheduledTime: '11:00 AM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id, binId: bin._id },
        body: { actualWeight: 40 },
        user: { id: collector2._id.toString() } // Different collector
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'This route is not assigned to you'
        })
      );
    });

    it('should fail when route is not in-progress', async () => {
      const collector = await User.create({
        firstName: 'Test',
        lastName: 'Collector',
        username: 'testcollector',
        email: 'test@collector.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '3333333333',
        nic: '199412345678',
        dateOfBirth: new Date('1994-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN004',
        location: '321 Elm St',
        zone: 'Zone D',
        binType: 'Organic',
        capacity: 60,
        fillLevel: 70,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Scheduled Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '12:00 PM',
        status: 'scheduled', // Not in-progress
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id, binId: bin._id },
        body: { actualWeight: 45 },
        user: { id: collector._id.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Route must be in-progress to collect bins'
        })
      );
    });

    it('should fail with invalid actual weight', async () => {
      const collector = await User.create({
        firstName: 'Weight',
        lastName: 'Tester',
        username: 'weighttester',
        email: 'weight@test.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '4444444444',
        nic: '199512345678',
        dateOfBirth: new Date('1995-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN005',
        location: '555 Maple Dr',
        zone: 'Zone A',
        binType: 'General Waste',
        capacity: 90,
        fillLevel: 85,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Weight Test Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '01:00 PM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id, binId: bin._id },
        body: { actualWeight: -10 }, // Negative weight
        user: { id: collector._id.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Actual weight must be a positive number'
        })
      );
    });

    it('should fail when bin not found in route', async () => {
      const collector = await User.create({
        firstName: 'Bin',
        lastName: 'Finder',
        username: 'binfinder',
        email: 'bin@finder.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '5555555555',
        nic: '199612345678',
        dateOfBirth: new Date('1996-01-01')
      });

      const bin1 = await Bin.create({
        binId: 'BIN006',
        location: '666 Cedar Ln',
        zone: 'Zone B',
        binType: 'General Waste',
        capacity: 70,
        fillLevel: 40,
        status: 'active'
      });

      const bin2 = await Bin.create({
        binId: 'BIN007',
        location: '777 Birch Rd',
        zone: 'Zone C',
        binType: 'Recyclable',
        capacity: 55,
        fillLevel: 30,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Single Bin Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '02:00 PM',
        status: 'in-progress',
        bins: [{
          bin: bin1._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id, binId: bin2._id }, // Different bin
        body: { actualWeight: 30 },
        user: { id: collector._id.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await collectBin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Bin not found in this route'
        })
      );
    });
  });
});

describe('Bin Collection - skipBin', () => {
  describe('✅ POSITIVE: Successfully Skip Bin', () => {
    it('should skip a bin with valid reason', async () => {
      const collector = await User.create({
        firstName: 'Skip',
        lastName: 'Tester',
        username: 'skiptester',
        email: 'skip@test.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '6666666666',
        nic: '199712345678',
        dateOfBirth: new Date('1997-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN008',
        location: '888 Willow Way',
        zone: 'Zone D',
        binType: 'General Waste',
        capacity: 75,
        fillLevel: 20,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Skip Test Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '03:00 PM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id.toString(), binId: bin._id.toString() },
        body: { reason: 'Bin not accessible due to parked car' },
        user: { id: collector._id.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await skipBin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bin skipped successfully'
        })
      );

      // Verify route was updated
      const updatedRoute = await Route.findById(route._id);
      expect(updatedRoute.bins[0].status).toBe('skipped');
      expect(updatedRoute.bins[0].notes).toBe('Bin not accessible due to parked car');
    });
  });

  describe('❌ NEGATIVE: Failed Skip Bin', () => {
    it('should fail when reason is not provided', async () => {
      const collector = await User.create({
        firstName: 'No',
        lastName: 'Reason',
        username: 'noreason',
        email: 'no@reason.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '7777777777',
        nic: '199812345678',
        dateOfBirth: new Date('1998-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN009',
        location: '999 Ash Blvd',
        zone: 'Zone A',
        binType: 'Recyclable',
        capacity: 65,
        fillLevel: 25,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'No Reason Route',
        createdBy: collector._id,
        assignedTo: collector._id,
        scheduledDate: new Date(),
        scheduledTime: '04:00 PM',
        status: 'in-progress',
        bins: [{
          bin: bin._id,
          order: 1,
          status: 'pending'
        }]
      });

      const req = {
        params: { id: route._id, binId: bin._id },
        body: {}, // No reason provided
        user: { id: collector._id.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await skipBin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Reason is required for skipping a bin'
        })
      );
    });
  });
});
