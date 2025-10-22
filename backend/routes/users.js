const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  deleteUser
} = require('../controllers/userController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.put('/:id/suspend', suspendUser);
router.delete('/:id', deleteUser);

module.exports = router;
