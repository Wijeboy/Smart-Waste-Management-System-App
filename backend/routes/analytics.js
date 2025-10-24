/**
 * Analytics Routes
 * Routes for analytics and reporting endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAnalytics,
  getKPIs,
  getCollectionTrends,
  getWasteDistribution,
  getRoutePerformance
} = require('../controllers/analyticsController');

// All analytics routes are admin-only
router.use(protect);
router.use(authorize('admin'));

// Get comprehensive analytics dashboard data
router.get('/', getAnalytics);

// Get Key Performance Indicators
router.get('/kpis', getKPIs);

// Get collection trends (daily, weekly, monthly)
router.get('/trends', getCollectionTrends);

// Get waste distribution analytics
router.get('/waste-distribution', getWasteDistribution);

// Get route performance analytics
router.get('/route-performance', getRoutePerformance);

module.exports = router;
