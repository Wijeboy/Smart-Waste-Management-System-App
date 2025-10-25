/**
 * Stripe Configuration
 * Stripe setup for payment processing
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
