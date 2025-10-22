const Route = require('../models/Route');
const Bin = require('../models/Bin');
const User = require('../models/User');

// ========================================
// ADMIN ENDPOINTS
// ========================================

// @desc    Create new route
// @route   POST /api/admin/routes
// @access  Private/Admin
exports.createRoute = async (req, res) => {
  try {
    const { routeName, bins, scheduledDate, scheduledTime, assignedTo, notes } = req.body;
    
    // Validation
    if (!routeName || !bins || bins.length === 0 || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (routeName, bins, scheduledDate, scheduledTime)'
      });
    }
    
    // Check if route name already exists
    const existingRoute = await Route.findOne({ routeName });
    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Route name already exists'
      });
    }
    
    // Validate bins exist
    const binIds = bins.map(b => b.binId);
    const existingBins = await Bin.find({ _id: { $in: binIds } });
    
    if (existingBins.length !== binIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more bins not found'
      });
    }
    
    // Validate assignedTo if provided
    if (assignedTo) {
      const collector = await User.findById(assignedTo);
      if (!collector) {
        return res.status(400).json({
          success: false,
          message: 'Assigned collector not found'
        });
      }
      if (collector.role !== 'collector') {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must have collector role'
        });
      }
    }
    
    // Create route
    const route = await Route.create({
      routeName,
      createdBy: req.user.id,
      assignedTo: assignedTo || null,
      bins: bins.map(b => ({
        bin: b.binId,
        order: b.order,
        status: 'pending'
      })),
      scheduledDate,
      scheduledTime,
      notes: notes || ''
    });
    
    // Populate bins and users
    await route.populate([
      { path: 'bins.bin', select: 'binId location zone binType fillLevel coordinates' },
      { path: 'assignedTo', select: 'firstName lastName username email phoneNo' },
      { path: 'createdBy', select: 'firstName lastName username' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating route',
      error: error.message
    });
  }
};

// @desc    Get all routes
// @route   GET /api/admin/routes
// @access  Private/Admin
exports.getAllRoutes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, assignedTo, startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const routes = await Route.find(filter)
      .populate('assignedTo', 'firstName lastName username email')
      .populate('createdBy', 'firstName lastName username')
      .populate('bins.bin', 'binId location zone binType fillLevel')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ scheduledDate: -1, createdAt: -1 });
    
    const total = await Route.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        routes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
};

// @desc    Get route by ID
// @route   GET /api/admin/routes/:id
// @access  Private/Admin
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName username email phoneNo')
      .populate('createdBy', 'firstName lastName username')
      .populate('bins.bin');
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { route }
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route',
      error: error.message
    });
  }
};

// @desc    Update route
// @route   PUT /api/admin/routes/:id
// @access  Private/Admin
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Prevent updating if in-progress or completed
    if (['in-progress', 'completed'].includes(route.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update route that is in-progress or completed'
      });
    }
    
    const { bins, scheduledDate, scheduledTime, notes } = req.body;
    
    // Update bins if provided
    if (bins) {
      const binIds = bins.map(b => b.binId);
      const existingBins = await Bin.find({ _id: { $in: binIds } });
      
      if (existingBins.length !== binIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more bins not found'
        });
      }
      
      route.bins = bins.map(b => ({
        bin: b.binId,
        order: b.order,
        status: 'pending'
      }));
    }
    
    if (scheduledDate) route.scheduledDate = scheduledDate;
    if (scheduledTime) route.scheduledTime = scheduledTime;
    if (notes !== undefined) route.notes = notes;
    
    await route.save();
    await route.populate([
      { path: 'bins.bin', select: 'binId location zone binType fillLevel' },
      { path: 'assignedTo', select: 'firstName lastName username' }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating route',
      error: error.message
    });
  }
};

// @desc    Delete route
// @route   DELETE /api/admin/routes/:id
// @access  Private/Admin
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Only allow deletion if scheduled or cancelled
    if (!['scheduled', 'cancelled'].includes(route.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only delete scheduled or cancelled routes'
      });
    }
    
    await route.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting route',
      error: error.message
    });
  }
};

// @desc    Assign collector to route
// @route   PUT /api/admin/routes/:id/assign
// @access  Private/Admin
exports.assignCollector = async (req, res) => {
  try {
    const { collectorId } = req.body;
    
    if (!collectorId) {
      return res.status(400).json({
        success: false,
        message: 'Collector ID is required'
      });
    }
    
    // Validate collector
    const collector = await User.findById(collectorId);
    if (!collector) {
      return res.status(400).json({
        success: false,
        message: 'Collector not found'
      });
    }
    if (collector.role !== 'collector') {
      return res.status(400).json({
        success: false,
        message: 'User must have collector role'
      });
    }
    
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    route.assignedTo = collectorId;
    await route.save();
    await route.populate('assignedTo', 'firstName lastName username email phoneNo');
    
    res.status(200).json({
      success: true,
      message: 'Collector assigned successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Assign collector error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning collector',
      error: error.message
    });
  }
};

// @desc    Get route statistics
// @route   GET /api/admin/routes/stats
// @access  Private/Admin
exports.getRouteStats = async (req, res) => {
  try {
    const stats = {
      totalRoutes: await Route.countDocuments(),
      scheduledRoutes: await Route.countDocuments({ status: 'scheduled' }),
      inProgressRoutes: await Route.countDocuments({ status: 'in-progress' }),
      completedRoutes: await Route.countDocuments({ status: 'completed' }),
      cancelledRoutes: await Route.countDocuments({ status: 'cancelled' }),
      unassignedRoutes: await Route.countDocuments({ assignedTo: null, status: 'scheduled' })
    };
    
    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get route stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route statistics',
      error: error.message
    });
  }
};

// ========================================
// COLLECTOR ENDPOINTS
// ========================================

// @desc    Get my routes (collector)
// @route   GET /api/routes/my-routes
// @access  Private/Collector
exports.getMyRoutes = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { assignedTo: req.user.id };
    if (status) filter.status = status;
    
    const routes = await Route.find(filter)
      .populate('bins.bin', 'binId location zone binType fillLevel coordinates')
      .populate('createdBy', 'firstName lastName')
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    
    res.status(200).json({
      success: true,
      data: { routes }
    });
  } catch (error) {
    console.error('Get my routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
};

// @desc    Start route
// @route   PUT /api/routes/:id/start
// @access  Private/Collector
exports.startRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Verify route is assigned to current user
    if (!route.assignedTo || route.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This route is not assigned to you'
      });
    }
    
    // Verify route is scheduled
    if (route.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Route is not in scheduled status'
      });
    }
    
    route.status = 'in-progress';
    route.startedAt = Date.now();
    await route.save();
    await route.populate('bins.bin');
    
    res.status(200).json({
      success: true,
      message: 'Route started successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Start route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting route',
      error: error.message
    });
  }
};

// @desc    Collect bin
// @route   PUT /api/routes/:id/bins/:binId/collect
// @access  Private/Collector
exports.collectBin = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Verify route is assigned to current user
    if (!route.assignedTo || route.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This route is not assigned to you'
      });
    }
    
    // Verify route is in-progress
    if (route.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Route must be in-progress to collect bins'
      });
    }
    
    // Find bin in route
    const binIndex = route.bins.findIndex(b => b.bin.toString() === req.params.binId);
    
    if (binIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found in this route'
      });
    }
    
    // Update bin status
    route.bins[binIndex].status = 'collected';
    route.bins[binIndex].collectedAt = Date.now();
    
    await route.save();
    
    // Update the actual bin's fillLevel and lastCollection
    await Bin.findByIdAndUpdate(req.params.binId, {
      fillLevel: 0,
      weight: 0,
      lastCollection: Date.now(),
      status: 'active'
    });
    
    await route.populate('bins.bin');
    
    res.status(200).json({
      success: true,
      message: 'Bin collected successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Collect bin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error collecting bin',
      error: error.message
    });
  }
};

// @desc    Skip bin
// @route   PUT /api/routes/:id/bins/:binId/skip
// @access  Private/Collector
exports.skipBin = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required for skipping a bin'
      });
    }
    
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Verify route is assigned to current user
    if (!route.assignedTo || route.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This route is not assigned to you'
      });
    }
    
    // Verify route is in-progress
    if (route.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Route must be in-progress to skip bins'
      });
    }
    
    // Find bin in route
    const binIndex = route.bins.findIndex(b => b.bin.toString() === req.params.binId);
    
    if (binIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found in this route'
      });
    }
    
    // Update bin status
    route.bins[binIndex].status = 'skipped';
    route.bins[binIndex].notes = reason;
    
    await route.save();
    await route.populate('bins.bin');
    
    res.status(200).json({
      success: true,
      message: 'Bin skipped successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Skip bin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error skipping bin',
      error: error.message
    });
  }
};

// @desc    Complete route
// @route   PUT /api/routes/:id/complete
// @access  Private/Collector
exports.completeRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Verify route is assigned to current user
    if (!route.assignedTo || route.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This route is not assigned to you'
      });
    }
    
    // Verify route is in-progress
    if (route.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Route must be in-progress to complete'
      });
    }
    
    // Check if all bins are collected or skipped
    const allBinsProcessed = route.bins.every(b => 
      b.status === 'collected' || b.status === 'skipped'
    );
    
    if (!allBinsProcessed) {
      return res.status(400).json({
        success: false,
        message: 'All bins must be collected or skipped before completing the route',
        data: {
          totalBins: route.bins.length,
          collectedBins: route.bins.filter(b => b.status === 'collected').length,
          skippedBins: route.bins.filter(b => b.status === 'skipped').length,
          pendingBins: route.bins.filter(b => b.status === 'pending').length
        }
      });
    }
    
    route.status = 'completed';
    route.completedAt = Date.now();
    await route.save();
    await route.populate('bins.bin');
    
    res.status(200).json({
      success: true,
      message: 'Route completed successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Complete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing route',
      error: error.message
    });
  }
};
