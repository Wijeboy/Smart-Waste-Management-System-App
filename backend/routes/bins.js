const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  updateBinStatus,
  updateFillLevel,
  getBinsByZone,
  getBinsByType,
  getBinsByStatus,
  getBinStats,
  createResidentBin,
  getResidentBins,
  getResidentBinSchedule,
  getResidentCollectionHistory
} = require('../controllers/binController');
const { protect } = require('../middleware/auth');

// Validation rules for creating/updating bins
const binValidation = [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('zone').isIn(['Zone A', 'Zone B', 'Zone C', 'Zone D']).withMessage('Invalid zone'),
  body('binType')
    .isIn(['General Waste', 'Recyclable', 'Organic', 'Hazardous'])
    .withMessage('Invalid bin type'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('coordinates.lat').optional().isNumeric().withMessage('Latitude must be a number'),
  body('coordinates.lng').optional().isNumeric().withMessage('Longitude must be a number')
];

// All routes require authentication
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getBinStats);

// Get bins by zone, type, or status
router.get('/zone/:zone', getBinsByZone);
router.get('/type/:type', getBinsByType);
router.get('/status/:status', getBinsByStatus);

// Resident-specific routes (before main CRUD to avoid conflicts)
router.post('/resident', binValidation, createResidentBin);
router.get('/resident/my-bins', getResidentBins);
router.get('/resident/collection-history', getResidentCollectionHistory);
router.get('/resident/:id/schedule', getResidentBinSchedule);

// Main CRUD routes
router.route('/')
  .get(getAllBins)
  .post(binValidation, createBin);

router.route('/:id')
  .get(getBinById)
  .put(updateBin)
  .delete(deleteBin);

// Specific update routes
router.patch('/:id/status', updateBinStatus);
router.patch('/:id/fillLevel', updateFillLevel);

module.exports = router;
