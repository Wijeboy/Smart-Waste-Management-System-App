/**
 * Payment Controller
 * Handles Stripe payment processing, payment intents, and payment history
 */

const stripe = require('../config/stripe');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private (Resident only)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, appliedPoints, paymentDetails } = req.body;

    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can make payments'
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    // Validate points if applied
    if (appliedPoints && appliedPoints > 0) {
      const user = await User.findById(req.user.id);
      if (user.creditPoints < appliedPoints) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient credit points'
        });
      }
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.user.id.toString(),
        appliedPoints: appliedPoints || 0,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email
      },
      description: 'Waste Collection Service Payment'
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
};

// @desc    Confirm payment and process
// @route   POST /api/payments/confirm
// @access  Private (Resident only)
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, appliedPoints, amount } = req.body;

    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can make payments'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Deduct points if applied
    if (appliedPoints && appliedPoints > 0) {
      const user = await User.findById(req.user.id);
      await user.redeemPoints(appliedPoints);
    }

    // Save payment record
    const payment = await Payment.create({
      user: req.user.id,
      paymentIntentId,
      amount,
      appliedPoints: appliedPoints || 0,
      finalAmount: amount,
      status: 'completed',
      paymentMethod: 'card',
      stripePaymentMethod: paymentIntent.payment_method
    });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        payment,
        remainingPoints: (await User.findById(req.user.id)).creditPoints
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private (Resident only)
exports.getPaymentHistory = async (req, res) => {
  try {
    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can access payment history'
      });
    }

    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Get saved payment methods
// @route   GET /api/payments/saved-methods
// @access  Private (Resident only)
exports.getSavedPaymentMethods = async (req, res) => {
  try {
    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can access saved payment methods'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user.stripeCustomerId) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Retrieve payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    res.status(200).json({
      success: true,
      count: paymentMethods.data.length,
      data: paymentMethods.data
    });
  } catch (error) {
    console.error('Error fetching saved payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved payment methods',
      error: error.message
    });
  }
};

// @desc    Create or get Stripe customer
// @route   POST /api/payments/customer
// @access  Private (Resident only)
exports.createStripeCustomer = async (req, res) => {
  try {
    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can create Stripe customer'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if customer already exists
    if (user.stripeCustomerId) {
      return res.status(200).json({
        success: true,
        data: {
          customerId: user.stripeCustomerId
        }
      });
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user._id.toString()
      }
    });

    // Save customer ID to user
    user.stripeCustomerId = customer.id;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        customerId: customer.id
      }
    });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Stripe customer',
      error: error.message
    });
  }
};

// @desc    Save payment method
// @route   POST /api/payments/save-method
// @access  Private (Resident only)
exports.savePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // Validate user is resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can save payment methods'
      });
    }

    const user = await User.findById(req.user.id);

    // Ensure user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'Please create a customer account first'
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    res.status(200).json({
      success: true,
      message: 'Payment method saved successfully'
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving payment method',
      error: error.message
    });
  }
};

// @desc    Get payment publishable key
// @route   GET /api/payments/config
// @access  Private
exports.getStripeConfig = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    }
  });
};
