
/**
 * Payment Controller Tests
 * Tests for Stripe payment processing endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123456789',
        client_secret: 'pi_test_123456789_secret_test',
        status: 'requires_payment_method'
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_test_123456789',
        status: 'succeeded',
        payment_method: 'pm_test_card'
      })
    },
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test_123456789'
      }),
      list: jest.fn().mockResolvedValue({
        data: []
      })
    },
    paymentMethods: {
      list: jest.fn().mockResolvedValue({
        data: []
      }),
      attach: jest.fn().mockResolvedValue({
        id: 'pm_test_card'
      })
    }
  }));
});

describe('Payment Controller', () => {
  let residentToken;
  let residentUser;
  let collectorToken;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management_test');
    }
  }, 10000); // Increase timeout for database connection

  beforeEach(async () => {
    // Clear test data
    await User.deleteMany({});
    await Payment.deleteMany({});

    // Generate unique short identifier
    const uniqueId = Date.now().toString().slice(-8);

    // Create test resident user
    residentUser = await User.create({
      firstName: 'Test',
      lastName: 'Resident',
      username: 'res' + uniqueId,
      email: 'res' + uniqueId + '@test.com',
      password: 'password123',
      nic: '123456789V',
      dateOfBirth: new Date('1990-01-01'),
      phoneNo: '0771234567',
      role: 'resident',
      creditPoints: 150
    });

    // Create test collector user
    const collectorUser = await User.create({
      firstName: 'Test',
      lastName: 'Collector',
      username: 'col' + uniqueId,
      email: 'col' + uniqueId + '@test.com',
      password: 'password123',
      nic: '987654321V',
      dateOfBirth: new Date('1990-01-01'),
      phoneNo: '0779876543',
      role: 'collector'
    });

    // Generate tokens
    residentToken = jwt.sign(
      { id: residentUser._id, role: residentUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    collectorToken = jwt.sign(
      { id: collectorUser._id, role: collectorUser.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
  }, 10000); // Increase timeout for beforeEach

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
    await Payment.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/payments/create-intent', () => {
    it('should create a payment intent for resident', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          amount: 75.00,
          appliedPoints: 0,
          paymentDetails: {
            name: 'Test Resident',
            email: 'testresidentpayment@test.com'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('clientSecret');
      expect(response.body.data).toHaveProperty('paymentIntentId');
      expect(response.body.data.paymentIntentId).toBe('pi_test_123456789');
    });

    it('should create payment intent with applied points', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          amount: 65.00,
          appliedPoints: 100,
          paymentDetails: {
            name: 'Test Resident',
            email: 'testresidentpayment@test.com'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('clientSecret');
    });

    it('should fail if amount is invalid', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          amount: 0,
          appliedPoints: 0,
          paymentDetails: {}
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid payment amount');
    });

    it('should fail if applied points exceed available points', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          amount: 75.00,
          appliedPoints: 200, // User only has 150 points
          paymentDetails: {}
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient credit points');
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({
          amount: 75.00,
          appliedPoints: 0,
          paymentDetails: {}
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Only residents can make payments');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .send({
          amount: 75.00,
          appliedPoints: 0,
          paymentDetails: {}
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/payments/confirm', () => {
    it('should confirm payment and deduct points', async () => {
      const initialPoints = residentUser.creditPoints;

      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          paymentIntentId: 'pi_test_123456789',
          appliedPoints: 100,
          amount: 75.00
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('payment');
      expect(response.body.data).toHaveProperty('remainingPoints');
      expect(response.body.data.remainingPoints).toBe(initialPoints - 100);

      // Verify payment was saved
      const payment = await Payment.findOne({ paymentIntentId: 'pi_test_123456789' });
      expect(payment).toBeTruthy();
      expect(payment.user.toString()).toBe(residentUser._id.toString());
      expect(payment.amount).toBe(75);
      expect(payment.appliedPoints).toBe(100);
      expect(payment.status).toBe('completed');
    });

    it('should confirm payment without points', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          paymentIntentId: 'pi_test_123456789',
          appliedPoints: 0,
          amount: 75.00
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.remainingPoints).toBe(150); // Points unchanged
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({
          paymentIntentId: 'pi_test_123456789',
          appliedPoints: 0,
          amount: 75.00
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/payments/history', () => {
    beforeEach(async () => {
      // Create test payments
      await Payment.create([
        {
          user: residentUser._id,
          paymentIntentId: 'pi_test_1',
          amount: 75,
          appliedPoints: 0,
          finalAmount: 75,
          status: 'completed',
          paymentMethod: 'card'
        },
        {
          user: residentUser._id,
          paymentIntentId: 'pi_test_2',
          amount: 65,
          appliedPoints: 100,
          finalAmount: 65,
          status: 'completed',
          paymentMethod: 'card'
        }
      ]);
    });

    it('should get payment history for resident', async () => {
      const response = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('paymentIntentId');
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('status');
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/payments/history');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/payments/customer', () => {
    it('should create Stripe customer for resident', async () => {
      const response = await request(app)
        .post('/api/payments/customer')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('customerId');
      expect(response.body.data.customerId).toBe('cus_test_123456789');

      // Verify user was updated
      const updatedUser = await User.findById(residentUser._id);
      expect(updatedUser.stripeCustomerId).toBe('cus_test_123456789');
    });

    it('should return existing customer ID if already created', async () => {
      // First request creates customer
      await request(app)
        .post('/api/payments/customer')
        .set('Authorization', `Bearer ${residentToken}`);

      // Second request returns existing
      const response = await request(app)
        .post('/api/payments/customer')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerId).toBe('cus_test_123456789');
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .post('/api/payments/customer')
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/payments/config', () => {
    it('should return Stripe publishable key', async () => {
      const response = await request(app)
        .get('/api/payments/config')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('publishableKey');
    });

    it('should work for any authenticated user', async () => {
      const response = await request(app)
        .get('/api/payments/config')
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/payments/config');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/payments/saved-methods', () => {
    it('should return saved payment methods for resident', async () => {
      const response = await request(app)
        .get('/api/payments/saved-methods')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
    });

    it('should return empty array if no Stripe customer', async () => {
      const response = await request(app)
        .get('/api/payments/saved-methods')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .get('/api/payments/saved-methods')
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/payments/save-method', () => {
    beforeEach(async () => {
      // Create Stripe customer first
      residentUser.stripeCustomerId = 'cus_test_123456789';
      await residentUser.save();
    });

    it('should save payment method for resident', async () => {
      const response = await request(app)
        .post('/api/payments/save-method')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          paymentMethodId: 'pm_test_card'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('saved successfully');
    });

    it('should fail if no Stripe customer exists', async () => {
      // Remove customer ID
      residentUser.stripeCustomerId = null;
      await residentUser.save();

      const response = await request(app)
        .post('/api/payments/save-method')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          paymentMethodId: 'pm_test_card'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('customer account');
    });

    it('should fail if user is not a resident', async () => {
      const response = await request(app)
        .post('/api/payments/save-method')
        .set('Authorization', `Bearer ${collectorToken}`)
        .send({
          paymentMethodId: 'pm_test_card'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Integration: Complete Payment Flow', () => {
    it('should complete full payment flow with points', async () => {
      const initialPoints = residentUser.creditPoints;
      const pointsToApply = 100;
      const amount = 75.00;

      // Step 1: Create payment intent
      const intentResponse = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          amount,
          appliedPoints: pointsToApply,
          paymentDetails: {
            name: 'Test Resident',
            email: 'testresidentpayment@test.com'
          }
        });

      expect(intentResponse.status).toBe(200);
      const { paymentIntentId } = intentResponse.body.data;

      // Step 2: Confirm payment
      const confirmResponse = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          paymentIntentId,
          appliedPoints: pointsToApply,
          amount
        });

      expect(confirmResponse.status).toBe(200);
      expect(confirmResponse.body.data.remainingPoints).toBe(initialPoints - pointsToApply);

      // Step 3: Verify payment history
      const historyResponse = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${residentToken}`);

      expect(historyResponse.status).toBe(200);
      expect(historyResponse.body.count).toBe(1);
      expect(historyResponse.body.data[0].paymentIntentId).toBe(paymentIntentId);
      expect(historyResponse.body.data[0].status).toBe('completed');

      // Step 4: Verify user points updated in database
      const updatedUser = await User.findById(residentUser._id);
      expect(updatedUser.creditPoints).toBe(initialPoints - pointsToApply);
    });
  });
});