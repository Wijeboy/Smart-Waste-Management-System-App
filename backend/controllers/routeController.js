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
    
    // Allow deletion of routes in any status
    // Admin has full control to delete any route
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
    const { preRouteChecklist } = req.body;
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
    
    // Validate pre-route checklist is provided
    if (!preRouteChecklist || !preRouteChecklist.items || !Array.isArray(preRouteChecklist.items)) {
      return res.status(400).json({
        success: false,
        message: 'Pre-route checklist is required before starting the route'
      });
    }
    
    // Verify all checklist items are checked
    const allItemsChecked = preRouteChecklist.items.every(item => item.checked === true);
    if (!allItemsChecked) {
      return res.status(400).json({
        success: false,
        message: 'All pre-route checklist items must be checked before starting'
      });
    }
    
    // Update route with checklist and start
    route.status = 'in-progress';
    route.startedAt = Date.now();
    route.preRouteChecklist = {
      completed: true,
      completedAt: preRouteChecklist.completedAt || Date.now(),
      items: preRouteChecklist.items
    };
    
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
    const { actualWeight } = req.body; // Collector enters actual weight in kg
    console.log('🎯 collectBin called - Route:', req.params.id, 'Bin:', req.params.binId);
    console.log('📦 Request body:', req.body);
    console.log('⚖️ Actual weight received:', actualWeight, typeof actualWeight);
    
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
    
    // Validate actual weight if provided
    if (actualWeight !== undefined) {
      if (typeof actualWeight !== 'number' || actualWeight < 0) {
        return res.status(400).json({
          success: false,
          message: 'Actual weight must be a positive number'
        });
      }
    }
    
    // Find bin in route
    const binIndex = route.bins.findIndex(b => b.bin.toString() === req.params.binId);
    
    if (binIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found in this route'
      });
    }
    
    // Get bin details BEFORE updating
    const binDetails = await Bin.findById(req.params.binId);
    
    // Update bin collection status in route
    route.bins[binIndex].status = 'collected';
    route.bins[binIndex].collectedAt = Date.now();
    route.bins[binIndex].fillLevelAtCollection = binDetails.fillLevel; // Store for reference
    
    // Only set actualWeight if it was provided (don't default to 0!)
    if (actualWeight !== undefined && actualWeight !== null) {
      route.bins[binIndex].actualWeight = actualWeight;
      console.log(`📊 Storing actual weight: ${actualWeight}kg for bin ${binDetails.binId}`);
    } else {
      console.log(`⚠️ No weight provided for bin ${binDetails.binId}, will use estimated weight`);
    }
    
    await route.save();
    
    // Calculate fill level based on actual weight collected
    // Formula: (weight / capacity) * 100
    let calculatedFillLevel = 0;
    if (actualWeight !== undefined && actualWeight !== null) {
      calculatedFillLevel = Math.round((actualWeight / binDetails.capacity) * 100);
      // Ensure fill level is between 0 and 100
      calculatedFillLevel = Math.max(0, Math.min(100, calculatedFillLevel));
      console.log(`📊 Calculated fill level: ${actualWeight}kg / ${binDetails.capacity}kg = ${calculatedFillLevel}%`);
    } else {
      console.log(`⚠️ No weight provided, fill level will be set to 0%`);
    }
    
    console.log(`✅ Bin collected - updating fill level to ${calculatedFillLevel}% (was ${binDetails.fillLevel}%)`);
    
    // Prepare collection data for updating bin
    const collectionUpdate = {
      fillLevel: calculatedFillLevel, // Calculate based on actual weight collected
      weight: actualWeight || 0, // Store the weight that was collected
      lastCollection: Date.now(),
      status: 'active'
    };

    // If bin has an owner (resident bin), update latestCollection
    if (binDetails.owner) {
      collectionUpdate.latestCollection = {
        collectedAt: Date.now(),
        collectedBy: req.user.id,
        collectorName: `${req.user.firstName} ${req.user.lastName}`,
        weight: actualWeight || 0,
        fillLevelAtCollection: binDetails.fillLevel
      };
      console.log(`✅ Updating resident bin ${binDetails.binId} with collection details`);
    }
    
    // Update the actual bin's fillLevel and lastCollection
    await Bin.findByIdAndUpdate(req.params.binId, collectionUpdate);
    
    await route.populate('bins.bin');
    
    res.status(200).json({
      success: true,
      message: 'Bin collected successfully',
      data: { 
        route,
        collectedWeight: actualWeight || 0
      }
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
    
    // Populate bin details to calculate analytics
    await route.populate('bins.bin');
    
    // Calculate analytics data
    const collectedBins = route.bins.filter(b => b.status === 'collected');
    const binsCollected = collectedBins.length;
    
    // Calculate waste collected from bins
    let wasteCollected = 0;
    let recyclableWaste = 0;
    
    collectedBins.forEach(binItem => {
      if (binItem.bin) {
        // Use ACTUAL weight entered by collector (most accurate)
        // If not entered, fall back to estimated weight based on fill level
        let binWaste = 0;
        
        // Check if actualWeight exists and is a valid number (including 0 is valid!)
        if (binItem.actualWeight !== undefined && binItem.actualWeight !== null) {
          // Use actual weight entered by collector (PREFERRED METHOD)
          binWaste = binItem.actualWeight;
          console.log(`✅ Using ACTUAL weight for bin ${binItem.bin.binId}: ${binWaste}kg`);
        } else {
          // Fallback: estimate based on fill level at collection
          const fillLevel = binItem.fillLevelAtCollection !== undefined 
            ? binItem.fillLevelAtCollection 
            : binItem.bin.fillLevel;
          binWaste = (fillLevel / 100) * binItem.bin.capacity;
          console.log(`⚠️ Using ESTIMATED weight for bin ${binItem.bin.binId}: ${fillLevel}% × ${binItem.bin.capacity}kg = ${binWaste}kg`);
        }
        
        wasteCollected += binWaste;
        
        // If bin type is recyclable, add to recyclable waste
        if (binItem.bin.binType === 'Recyclable') {
          recyclableWaste += binWaste;
        }
      }
    });
    
    // Calculate efficiency (percentage of scheduled bins that were collected)
    const efficiency = route.bins.length > 0 
      ? Math.round((binsCollected / route.bins.length) * 100) 
      : 0;
    
    // Calculate completion time if startedAt exists
    const startTime = route.startedAt || route.scheduledDate;
    const endTime = new Date();
    
    // Calculate route duration in minutes
    const durationMs = endTime - startTime;
    const routeDuration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
    
    // Update route with completion data and analytics
    route.status = 'completed';
    route.completedAt = endTime;
    route.endTime = endTime;
    route.startTime = startTime;
    route.routeDuration = routeDuration;
    route.binsCollected = binsCollected;
    route.wasteCollected = Math.round(wasteCollected);
    route.recyclableWaste = Math.round(recyclableWaste);
    route.efficiency = efficiency;
    route.satisfaction = 0; // Will be set later by feedback system
    
    await route.save();
    
    res.status(200).json({
      success: true,
      message: 'Route completed successfully',
      data: { 
        route,
        analytics: {
          binsCollected,
          wasteCollected: Math.round(wasteCollected),
          recyclableWaste: Math.round(recyclableWaste),
          efficiency
        }
      }
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
