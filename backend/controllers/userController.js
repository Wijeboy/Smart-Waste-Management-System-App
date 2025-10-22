const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    
    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.accountStatus = status;
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filter);
    
    // Calculate stats
    const stats = {
      total: await User.countDocuments(),
      active: await User.countDocuments({ accountStatus: 'active' }),
      suspended: await User.countDocuments({ accountStatus: 'suspended' }),
      pending: await User.countDocuments({ accountStatus: 'pending' }),
      admins: await User.countDocuments({ role: 'admin' }),
      collectors: await User.countDocuments({ role: 'collector' }),
      users: await User.countDocuments({ role: 'user' })
    };
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // TODO: Add activity stats (routes assigned, bins collected)
    // This will be implemented after Route model is created
    const activityStats = {
      routesAssigned: 0,
      routesCompleted: 0,
      binsCollected: 0
    };
    
    res.status(200).json({
      success: true,
      data: {
        user,
        activityStats
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'collector'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, admin, or collector'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

// @desc    Suspend/Activate user (admin only)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from suspending themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot suspend your own account'
      });
    }
    
    // Toggle suspension
    if (user.accountStatus === 'suspended') {
      user.accountStatus = 'active';
      user.isActive = true;
    } else {
      user.accountStatus = 'suspended';
      user.isActive = false;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User ${user.accountStatus === 'suspended' ? 'suspended' : 'activated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};
