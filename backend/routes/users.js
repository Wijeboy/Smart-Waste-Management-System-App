const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  deleteUser,
  getUserCreditPoints,
  redeemCreditPoints,
  getRecentCollections
} = require('../controllers/userController');

// Credit Points routes (require authentication, accessible by resident and admin)
router.get('/:id/credit-points', protect, getUserCreditPoints);
router.post('/:id/redeem-points', protect, redeemCreditPoints);
router.get('/:id/recent-collections', protect, getRecentCollections);

// All routes below require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.put('/:id/suspend', suspendUser);
router.delete('/:id', deleteUser);

module.exports = router;
