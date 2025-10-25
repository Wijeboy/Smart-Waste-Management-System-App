/**
 * Payment Routes
 * Routes for Stripe payment processing
 */

const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getSavedPaymentMethods,
  createStripeCustomer,
  savePaymentMethod,
  getStripeConfig
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Payment routes
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.get('/saved-methods', getSavedPaymentMethods);
router.post('/customer', createStripeCustomer);
router.post('/save-method', savePaymentMethod);
router.get('/config', getStripeConfig);

module.exports = router;
