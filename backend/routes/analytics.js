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
  getRoutePerformance,
  getBinAnalytics,
  getUserAnalyticsData,
  getZoneAnalytics
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

// Get bin analytics (NEW)
router.get('/bin-analytics', getBinAnalytics);

// Get user analytics (NEW)
router.get('/user-analytics', getUserAnalyticsData);

// Get zone analytics (NEW)
router.get('/zone-analytics', getZoneAnalytics);

module.exports = router;
