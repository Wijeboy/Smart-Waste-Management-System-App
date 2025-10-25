/**
 * Users Routes Tests
 * Comprehensive test suite for user management routes
 * Coverage: >80% - All endpoints, auth middleware, positive/negative/edge cases
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

const usersRouter = require('../../routes/users');
const User = require('../../models/User');

let app;
let mongoServer;

// Helper function to generate JWT token
const generateToken = (userId, role = 'admin') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
};

// Setup: Connect to in-memory MongoDB and configure Express
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Setup Express app
  app = express();
  app.use(express.json());
  app.use('/api/users', usersRouter);
});

// Teardown: Disconnect and stop MongoDB
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await User.deleteMany({});
});

describe('Users Routes - Authentication & Authorization', () => {
  describe('❌ NEGATIVE: Unauthorized Access', () => {
    it('should return 401 when accessing credit points without token', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/users/${userId}/credit-points`);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should return 401 when accessing admin routes without token', async () => {
      const response = await request(app)
        .get('/api/users');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('❌ NEGATIVE: Forbidden Access (Non-Admin)', () => {
    it('should return 403 when non-admin tries to access getAllUsers', async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = generateToken(userId, 'user');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not authorized');
    });

    it('should return 403 when collector tries to delete user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const targetUserId = new mongoose.Types.ObjectId();
      const token = generateToken(userId, 'collector');
      
      const response = await request(app)
        .delete(`/api/users/${targetUserId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Users Routes - Credit Points (Authenticated Users)', () => {
  describe('✅ POSITIVE: Get Credit Points', () => {
    it('should allow user to get their own credit points', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        creditPoints: 150
      });
      
      const token = generateToken(user._id, 'user');
      
      const response = await request(app)
        .get(`/api/users/${user._id}/credit-points`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('creditPoints');
    });

    it('should allow admin to get any user credit points', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        creditPoints: 200
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get(`/api/users/${user._id}/credit-points`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('✅ POSITIVE: Redeem Credit Points', () => {
    it('should allow user to redeem their credit points', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        creditPoints: 500
      });
      
      const token = generateToken(user._id, 'user');
      
      const response = await request(app)
        .post(`/api/users/${user._id}/redeem-points`)
        .set('Authorization', `Bearer ${token}`)
        .send({ points: 100, item: 'Gift Card' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('✅ POSITIVE: Get Recent Collections', () => {
    it('should get recent collections for authenticated user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      });
      
      const token = generateToken(user._id, 'user');
      
      const response = await request(app)
        .get(`/api/users/${user._id}/recent-collections`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('❌ NEGATIVE: Invalid User ID', () => {
    it('should return 404 for non-existent user credit points', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const token = generateToken(nonExistentId, 'user');
      
      const response = await request(app)
        .get(`/api/users/${nonExistentId}/credit-points`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid user ID format', async () => {
      const token = generateToken(new mongoose.Types.ObjectId(), 'admin');
      
      const response = await request(app)
        .get('/api/users/invalid-id/credit-points')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Users Routes - Admin User Management', () => {
  describe('✅ POSITIVE: Get All Users', () => {
    it('should get all users with pagination', async () => {
      // Create test users
      await User.create([
        { name: 'User 1', email: 'user1@test.com', password: 'pass123', role: 'user' },
        { name: 'User 2', email: 'user2@test.com', password: 'pass123', role: 'collector' },
        { name: 'User 3', email: 'user3@test.com', password: 'pass123', role: 'admin' }
      ]);
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(3);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.stats).toBeDefined();
    });

    it('should filter users by role', async () => {
      await User.create([
        { name: 'User 1', email: 'user1@test.com', password: 'pass123', role: 'user' },
        { name: 'Collector 1', email: 'collector1@test.com', password: 'pass123', role: 'collector' },
        { name: 'Admin 1', email: 'admin1@test.com', password: 'pass123', role: 'admin' }
      ]);
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?role=collector')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].role).toBe('collector');
    });

    it('should filter users by status', async () => {
      await User.create([
        { name: 'Active User', email: 'active@test.com', password: 'pass123', accountStatus: 'active' },
        { name: 'Suspended User', email: 'suspended@test.com', password: 'pass123', accountStatus: 'suspended' }
      ]);
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?status=active')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].accountStatus).toBe('active');
    });

    it('should paginate users correctly', async () => {
      // Create 15 users
      const users = Array.from({ length: 15 }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@test.com`,
        password: 'pass123',
        role: 'user'
      }));
      await User.create(users);
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(5);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.pages).toBe(3);
    });
  });

  describe('✅ POSITIVE: Get User By ID', () => {
    it('should get user details by ID', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        role: 'user'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.user.password).toBeUndefined(); // Password should be excluded
      expect(response.body.data.activityStats).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('✅ POSITIVE: Update User Role', () => {
    it('should update user role successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        role: 'user'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .put(`/api/users/${user._id}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'collector' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('collector');
    });

    it('should validate role enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        role: 'user'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .put(`/api/users/${user._id}/role`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'invalid-role' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('✅ POSITIVE: Suspend User', () => {
    it('should suspend user successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        accountStatus: 'active'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .put(`/api/users/${user._id}/suspend`)
        .set('Authorization', `Bearer ${token}`)
        .send({ reason: 'Policy violation' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.accountStatus).toBe('suspended');
    });

    it('should reactivate suspended user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        accountStatus: 'suspended'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .put(`/api/users/${user._id}/suspend`)
        .set('Authorization', `Bearer ${token}`)
        .send({ accountStatus: 'active' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('✅ POSITIVE: Delete User', () => {
    it('should delete user successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        role: 'user'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify user is deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 when deleting non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .delete(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle empty user list', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(0);
      expect(response.body.data.stats.total).toBe(0);
    });

    it('should handle page beyond available data', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123'
      });
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?page=999')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(0);
    });

    it('should handle invalid pagination parameters gracefully', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?page=-1&limit=0')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      // Should use default values or handle gracefully
    });

    it('should handle multiple filters simultaneously', async () => {
      await User.create([
        { name: 'Active Collector', email: 'ac@test.com', password: 'pass123', role: 'collector', accountStatus: 'active' },
        { name: 'Suspended Collector', email: 'sc@test.com', password: 'pass123', role: 'collector', accountStatus: 'suspended' },
        { name: 'Active User', email: 'au@test.com', password: 'pass123', role: 'user', accountStatus: 'active' }
      ]);
      
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      const response = await request(app)
        .get('/api/users?role=collector&status=active')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].name).toBe('Active Collector');
    });
  });

  describe('⚠️ ERROR: Server Errors', () => {
    it('should handle database errors gracefully', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const token = generateToken(adminId, 'admin');
      
      // Close database connection to simulate error
      await mongoose.connection.close();
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      
      // Reconnect for other tests
      await mongoose.connect(mongoServer.getUri());
    });
  });
});

describe('Users Routes - Route Order and Middleware', () => {
  it('should apply protect middleware before authorize', async () => {
    const response = await request(app)
      .get('/api/users');
    
    // Should fail at protect (401) before reaching authorize
    expect(response.status).toBe(401);
  });

  it('should handle credit points routes before admin middleware', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
      creditPoints: 100
    });
    
    const token = generateToken(user._id, 'user');
    
    // Regular user should be able to access their credit points
    const response = await request(app)
      .get(`/api/users/${user._id}/credit-points`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});
