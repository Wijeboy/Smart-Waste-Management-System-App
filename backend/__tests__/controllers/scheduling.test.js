/**
 * Scheduling Controller Tests
 * Test suite for route scheduling functionality
 */

const mongoose = require('mongoose');
const Route = require('../../models/Route');
const Bin = require('../../models/Bin');
const User = require('../../models/User');
const { createRoute, getAllRoutes, updateRoute } = require('../../controllers/routeController');
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

describe('Scheduling - createRoute', () => {
  describe('✅ POSITIVE: Successful Route Scheduling', () => {
    it('should create a scheduled route with all required fields', async () => {
      // Create admin user
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'adminuser',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
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
        fillLevel: 50,
        status: 'active'
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Morning Collection Route',
          bins: [{ binId: bin._id.toString(), order: 1 }],
          scheduledDate: new Date('2025-10-26'),
          scheduledTime: '09:00 AM',
          notes: 'Test route'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Route created successfully'
        })
      );
    });

    it('should create a route with multiple bins', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Two',
        username: 'admintwo',
        email: 'admin2@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '2234567890',
        nic: '199112345678',
        dateOfBirth: new Date('1991-01-01')
      });

      const bin1 = await Bin.create({
        binId: 'BIN002',
        location: '456 Oak Ave',
        zone: 'Zone B',
        binType: 'Recyclable',
        capacity: 80,
        fillLevel: 60,
        status: 'active'
      });

      const bin2 = await Bin.create({
        binId: 'BIN003',
        location: '789 Pine St',
        zone: 'Zone C',
        binType: 'Organic',
        capacity: 70,
        fillLevel: 40,
        status: 'active'
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Multi-Bin Route',
          bins: [
            { binId: bin1._id.toString(), order: 1 },
            { binId: bin2._id.toString(), order: 2 }
          ],
          scheduledDate: new Date('2025-10-27'),
          scheduledTime: '10:00 AM'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const route = await Route.findOne({ routeName: 'Multi-Bin Route' });
      expect(route.bins).toHaveLength(2);
    });

    it('should create a route with assigned collector', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Three',
        username: 'adminthree',
        email: 'admin3@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '3334567890',
        nic: '199212345678',
        dateOfBirth: new Date('1992-01-01')
      });

      const collector = await User.create({
        firstName: 'John',
        lastName: 'Collector',
        username: 'johncollector',
        email: 'collector@test.com',
        password: 'password123',
        role: 'collector',
        phoneNo: '4444567890',
        nic: '199312345678',
        dateOfBirth: new Date('1993-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN004',
        location: '111 Elm St',
        zone: 'Zone D',
        binType: 'General Waste',
        capacity: 90,
        fillLevel: 75,
        status: 'active'
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Assigned Route',
          bins: [{ binId: bin._id.toString(), order: 1 }],
          scheduledDate: new Date('2025-10-28'),
          scheduledTime: '11:00 AM',
          assignedTo: collector._id.toString()
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const route = await Route.findOne({ routeName: 'Assigned Route' });
      expect(route.assignedTo.toString()).toBe(collector._id.toString());
    });
  });

  describe('❌ NEGATIVE: Failed Route Scheduling', () => {
    it('should fail without routeName', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Four',
        username: 'adminfour',
        email: 'admin4@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '5554567890',
        nic: '199412345678',
        dateOfBirth: new Date('1994-01-01')
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          bins: [],
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    it('should fail without scheduledDate', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Five',
        username: 'adminfive',
        email: 'admin5@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '6664567890',
        nic: '199512345678',
        dateOfBirth: new Date('1995-01-01')
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Test Route',
          bins: [],
          scheduledTime: '09:00 AM'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail without scheduledTime', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Six',
        username: 'adminsix',
        email: 'admin6@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '7774567890',
        nic: '199612345678',
        dateOfBirth: new Date('1996-01-01')
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Test Route',
          bins: [],
          scheduledDate: new Date()
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail with empty bins array', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Seven',
        username: 'adminseven',
        email: 'admin7@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '8884567890',
        nic: '199712345678',
        dateOfBirth: new Date('1997-01-01')
      });

      const req = {
        user: { id: admin._id.toString() },
        body: {
          routeName: 'Empty Route',
          bins: [],
          scheduledDate: new Date(),
          scheduledTime: '09:00 AM'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

describe('Scheduling - getAllRoutes', () => {
  describe('✅ POSITIVE: Get Scheduled Routes', () => {
    it('should retrieve all scheduled routes', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Eight',
        username: 'admineight',
        email: 'admin8@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '9994567890',
        nic: '199812345678',
        dateOfBirth: new Date('1998-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN005',
        location: '222 Cedar Ln',
        zone: 'Zone A',
        binType: 'General Waste',
        capacity: 85,
        fillLevel: 55,
        status: 'active'
      });

      await Route.create({
        routeName: 'Test Route 1',
        createdBy: admin._id,
        bins: [{ bin: bin._id, order: 1, status: 'pending' }],
        scheduledDate: new Date('2025-10-30'),
        scheduledTime: '08:00 AM'
      });

      const req = {
        query: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            routes: expect.any(Array)
          })
        })
      );
    });

    it('should filter routes by status', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Nine',
        username: 'adminnine',
        email: 'admin9@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '1114567890',
        nic: '199912345678',
        dateOfBirth: new Date('1999-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN006',
        location: '333 Birch Rd',
        zone: 'Zone B',
        binType: 'Recyclable',
        capacity: 75,
        fillLevel: 65,
        status: 'active'
      });

      await Route.create({
        routeName: 'Scheduled Route',
        createdBy: admin._id,
        bins: [{ bin: bin._id, order: 1, status: 'pending' }],
        scheduledDate: new Date('2025-11-01'),
        scheduledTime: '09:00 AM',
        status: 'scheduled'
      });

      const req = {
        query: {
          status: 'scheduled'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getAllRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

describe('Scheduling - updateRoute', () => {
  describe('✅ POSITIVE: Update Scheduled Route', () => {
    it('should update scheduled date and time', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Ten',
        username: 'adminten',
        email: 'admin10@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '2224567890',
        nic: '200012345678',
        dateOfBirth: new Date('2000-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN007',
        location: '444 Maple Dr',
        zone: 'Zone C',
        binType: 'Organic',
        capacity: 65,
        fillLevel: 45,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'Update Test Route',
        createdBy: admin._id,
        bins: [{ bin: bin._id, order: 1, status: 'pending' }],
        scheduledDate: new Date('2025-11-02'),
        scheduledTime: '10:00 AM',
        status: 'scheduled'
      });

      const req = {
        user: { id: admin._id.toString() },
        params: { id: route._id.toString() },
        body: {
          scheduledDate: new Date('2025-11-03'),
          scheduledTime: '11:00 AM'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const updatedRoute = await Route.findById(route._id);
      expect(updatedRoute.scheduledTime).toBe('11:00 AM');
    });
  });

  describe('❌ NEGATIVE: Failed Route Update', () => {
    it('should not update in-progress route', async () => {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'Eleven',
        username: 'admineleven',
        email: 'admin11@test.com',
        password: 'password123',
        role: 'admin',
        phoneNo: '3334567890',
        nic: '200112345678',
        dateOfBirth: new Date('2001-01-01')
      });

      const bin = await Bin.create({
        binId: 'BIN008',
        location: '555 Willow Way',
        zone: 'Zone D',
        binType: 'General Waste',
        capacity: 95,
        fillLevel: 85,
        status: 'active'
      });

      const route = await Route.create({
        routeName: 'In Progress Route',
        createdBy: admin._id,
        bins: [{ bin: bin._id, order: 1, status: 'pending' }],
        scheduledDate: new Date('2025-11-04'),
        scheduledTime: '12:00 PM',
        status: 'in-progress'
      });

      const req = {
        user: { id: admin._id.toString() },
        params: { id: route._id.toString() },
        body: {
          scheduledDate: new Date('2025-11-05')
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Cannot update route that is in-progress or completed'
        })
      );
    });
  });
});
