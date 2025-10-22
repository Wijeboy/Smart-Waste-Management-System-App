const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  // Admin endpoints
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  assignCollector,
  getRouteStats,
  // Collector endpoints
  getMyRoutes,
  startRoute,
  collectBin,
  skipBin,
  completeRoute
} = require('../controllers/routeController');

// ========================================
// ADMIN ROUTES (require admin role)
// ========================================

// Get route stats (must be before /:id to avoid conflict)
router.get('/stats', protect, authorize('admin'), getRouteStats);

// ========================================
// COLLECTOR ROUTES (require collector role)
// ========================================
// IMPORTANT: These must be BEFORE /:id routes to avoid matching issues

// My routes - must be before /:id
router.get('/my-routes', protect, authorize('collector'), getMyRoutes);

// Route management
router.put('/:id/start', protect, authorize('collector'), startRoute);
router.put('/:id/complete', protect, authorize('collector'), completeRoute);

// Bin collection
router.put('/:id/bins/:binId/collect', protect, authorize('collector'), collectBin);
router.put('/:id/bins/:binId/skip', protect, authorize('collector'), skipBin);

// ========================================
// ADMIN ROUTES (require admin role)
// ========================================

// CRUD operations
router.post('/', protect, authorize('admin'), createRoute);
router.get('/', protect, authorize('admin'), getAllRoutes);
router.get('/:id', protect, authorize('admin'), getRouteById);
router.put('/:id', protect, authorize('admin'), updateRoute);
router.delete('/:id', protect, authorize('admin'), deleteRoute);

// Assignment
router.put('/:id/assign', protect, authorize('admin'), assignCollector);

module.exports = router;
