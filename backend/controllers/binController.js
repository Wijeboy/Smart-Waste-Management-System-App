const Bin = require('../models/Bin');
const { validationResult } = require('express-validator');

// @desc    Get all bins with optional filters
// @route   GET /api/bins
// @access  Private
exports.getAllBins = async (req, res) => {
  try {
    const { zone, binType, status, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (zone) filter.zone = zone;
    if (binType) filter.binType = binType;
    if (status) filter.status = status;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { binId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const bins = await Bin.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'firstName lastName')
      .populate('owner', 'firstName lastName email phoneNo')
      .populate('latestCollection.collectedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bins',
      error: error.message
    });
  }
};

// @desc    Get single bin by ID
// @route   GET /api/bins/:id
// @access  Private
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bin',
      error: error.message
    });
  }
};

// @desc    Create new bin
// @route   POST /api/bins
// @access  Private
exports.createBin = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add created by user
    req.body.createdBy = req.user.id;

    const bin = await Bin.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bin created successfully',
      data: bin
    });
  } catch (error) {
    // Handle duplicate binId
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bin ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating bin',
      error: error.message
    });
  }
};

// @desc    Update bin
// @route   PUT /api/bins/:id
// @access  Private
exports.updateBin = async (req, res) => {
  try {
    let bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    bin = await Bin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bin updated successfully',
      data: bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bin',
      error: error.message
    });
  }
};

// @desc    Delete bin
// @route   DELETE /api/bins/:id
// @access  Private (Admin/Supervisor only)
exports.deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    await bin.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bin',
      error: error.message
    });
  }
};

// @desc    Update bin status
// @route   PATCH /api/bins/:id/status
// @access  Private
exports.updateBinStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bin status updated',
      data: bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bin status',
      error: error.message
    });
  }
};

// @desc    Update bin fill level
// @route   PATCH /api/bins/:id/fillLevel
// @access  Private
exports.updateFillLevel = async (req, res) => {
  try {
    const { fillLevel, weight } = req.body;

    if (fillLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Fill level is required'
      });
    }

    const updates = { fillLevel };
    if (weight !== undefined) updates.weight = weight;

    // Auto-update status based on fill level
    if (fillLevel >= 90) {
      updates.status = 'full';
    } else if (fillLevel < 90) {
      // Only change status from 'full' to 'active' if it was 'full'
      const currentBin = await Bin.findById(req.params.id);
      if (currentBin && currentBin.status === 'full') {
        updates.status = 'active';
      }
    }

    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bin fill level updated',
      data: bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating fill level',
      error: error.message
    });
  }
};

// @desc    Get bins by zone
// @route   GET /api/bins/zone/:zone
// @access  Private
exports.getBinsByZone = async (req, res) => {
  try {
    const bins = await Bin.find({ zone: req.params.zone })
      .sort({ binId: 1 });

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bins by zone',
      error: error.message
    });
  }
};

// @desc    Get bins by type
// @route   GET /api/bins/type/:type
// @access  Private
exports.getBinsByType = async (req, res) => {
  try {
    const bins = await Bin.find({ binType: req.params.type })
      .sort({ binId: 1 });

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bins by type',
      error: error.message
    });
  }
};

// @desc    Get bins by status
// @route   GET /api/bins/status/:status
// @access  Private
exports.getBinsByStatus = async (req, res) => {
  try {
    const bins = await Bin.find({ status: req.params.status })
      .sort({ binId: 1 });

    res.status(200).json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bins by status',
      error: error.message
    });
  }
};

// @desc    Get bin statistics
// @route   GET /api/bins/stats
// @access  Private
exports.getBinStats = async (req, res) => {
  try {
    const totalBins = await Bin.countDocuments();
    const activeBins = await Bin.countDocuments({ status: 'active' });
    const fullBins = await Bin.countDocuments({ status: 'full' });
    const maintenanceBins = await Bin.countDocuments({ status: 'maintenance' });

    // Get bins by type
    const binsByType = await Bin.aggregate([
      {
        $group: {
          _id: '$binType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get bins by zone
    const binsByZone = await Bin.aggregate([
      {
        $group: {
          _id: '$zone',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get bins needing collection (fill level >= 85%)
    const binsNeedingCollection = await Bin.countDocuments({
      fillLevel: { $gte: 85 }
    });

    // Average fill level
    const avgFillLevel = await Bin.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$fillLevel' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalBins,
        active: activeBins,
        full: fullBins,
        maintenance: maintenanceBins,
        needingCollection: binsNeedingCollection,
        averageFillLevel: avgFillLevel[0]?.average || 0,
        byType: binsByType,
        byZone: binsByZone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bin statistics',
      error: error.message
    });
  }
};

// ============= RESIDENT-SPECIFIC ENDPOINTS =============

// @desc    Create bin by resident
// @route   POST /api/bins/resident
// @access  Private (Resident only)
exports.createResidentBin = async (req, res) => {
  try {
    // Check if user is a resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can create bins through this endpoint'
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add owner and createdBy
    req.body.owner = req.user.id;
    req.body.createdBy = req.user.id;
    
    // Don't pass binId - let the pre-save hook generate it
    delete req.body.binId;

    console.log('Creating resident bin with data:', req.body);
    // Use new Bin() and .save() to trigger pre-save hook
    const bin = new Bin(req.body);
    await bin.save();
    console.log('Bin created successfully:', bin.binId);

    res.status(201).json({
      success: true,
      message: 'Bin created successfully',
      data: bin
    });
  } catch (error) {
    console.error('Error creating resident bin:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bin ID already exists'
      });
    }
    // Return detailed error for validation issues
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating bin',
      error: error.message
    });
  }
};

// @desc    Get resident's bins
// @route   GET /api/bins/resident/my-bins
// @access  Private (Resident only)
exports.getResidentBins = async (req, res) => {
  try {
    // Check if user is a resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can access this endpoint'
      });
    }

    const bins = await Bin.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate('latestCollection.collectedBy', 'firstName lastName');

    // For each bin, check if it's scheduled in any active/in-progress route
    const Route = require('../models/Route');
    const binsWithSchedule = await Promise.all(
      bins.map(async (bin) => {
        const binObj = bin.toObject();
        
        // Find if this bin is in any active or in-progress route
        const activeRoute = await Route.findOne({
          'bins.bin': bin._id,
          status: { $in: ['scheduled', 'in-progress'] }
        })
        .populate('assignedTo', 'firstName lastName')
        .select('routeName scheduledDate assignedTo status bins');

        if (activeRoute) {
          // Find the specific bin in the route to get its status
          const binInRoute = activeRoute.bins.find(
            b => b.bin.toString() === bin._id.toString()
          );

          // If bin is scheduled but not yet collected, show 0% fill level
          const isScheduledNotCollected = binInRoute && binInRoute.status === 'pending';
          
          binObj.scheduleInfo = {
            isScheduled: true,
            routeName: activeRoute.routeName,
            scheduledDate: activeRoute.scheduledDate,
            routeStatus: activeRoute.status,
            collectorName: activeRoute.assignedTo 
              ? `${activeRoute.assignedTo.firstName} ${activeRoute.assignedTo.lastName}`
              : 'Not assigned',
            binStatus: binInRoute ? binInRoute.status : 'pending'
          };

          // Override fill level to 0 if scheduled for collection (not yet collected)
          if (isScheduledNotCollected) {
            binObj.fillLevel = 0;
            console.log(`📦 Bin ${binObj.binId} is scheduled - displaying 0% fill level`);
          }
        } else {
          binObj.scheduleInfo = {
            isScheduled: false
          };
        }

        // Find all skipped incidents from COMPLETED routes only
        // These should be cleared when the bin is next collected
        const skippedRoutes = await Route.find({
          'bins.bin': bin._id,
          'bins.status': 'skipped',
          status: 'completed'
        })
        .populate('assignedTo', 'firstName lastName')
        .select('routeName completedAt assignedTo bins')
        .sort({ completedAt: -1 }); // Newest first

        // Check if bin has been collected AFTER being skipped
        const lastCollectionDate = bin.latestCollection?.collectedAt 
          ? new Date(bin.latestCollection.collectedAt) 
          : null;

        // Filter out skips that occurred before the last successful collection
        const skippedIncidents = [];
        if (skippedRoutes.length > 0) {
          skippedRoutes.forEach(route => {
            const binInRoute = route.bins.find(
              b => b.bin.toString() === bin._id.toString() && b.status === 'skipped'
            );

            if (binInRoute) {
              const skipDate = route.completedAt ? new Date(route.completedAt) : new Date();
              
              // Only include skips that happened AFTER the last collection (or all skips if never collected)
              if (!lastCollectionDate || skipDate > lastCollectionDate) {
                skippedIncidents.push({
                  routeName: route.routeName,
                  skippedAt: route.completedAt,
                  reason: binInRoute.notes || 'No reason provided',
                  collectorName: route.assignedTo 
                    ? `${route.assignedTo.firstName} ${route.assignedTo.lastName}`
                    : 'Unknown',
                  routeId: route._id
                });
              }
            }
          });
        }

        binObj.skippedIncidents = skippedIncidents;

        return binObj;
      })
    );

    res.status(200).json({
      success: true,
      count: binsWithSchedule.length,
      data: binsWithSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bins',
      error: error.message
    });
  }
};

// @desc    Get collection schedule for resident's bin
// @route   GET /api/bins/resident/:id/schedule
// @access  Private (Resident only)
exports.getResidentBinSchedule = async (req, res) => {
  try {
    // Check if user is a resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can access this endpoint'
      });
    }

    const bin = await Bin.findOne({ _id: req.params.id, owner: req.user.id });

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found or you do not have access to this bin'
      });
    }

    // Import Route model here to avoid circular dependency
    const Route = require('../models/Route');

    // Find routes that include this bin and are scheduled or in-progress
    const routes = await Route.find({
      'bins.bin': bin._id,
      status: { $in: ['scheduled', 'in-progress'] }
    })
      .select('routeName scheduledDate scheduledTime status assignedTo')
      .populate('assignedTo', 'firstName lastName')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      bin: {
        binId: bin.binId,
        location: bin.location,
        zone: bin.zone
      },
      upcomingCollections: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collection schedule',
      error: error.message
    });
  }
};

// @desc    Get collection history for resident's bins
// @route   GET /api/bins/resident/collection-history
// @access  Private (Resident only)
exports.getResidentCollectionHistory = async (req, res) => {
  try {
    // Check if user is a resident
    if (req.user.role !== 'resident') {
      return res.status(403).json({
        success: false,
        message: 'Only residents can access this endpoint'
      });
    }

    // Get all bins owned by this resident
    const bins = await Bin.find({ owner: req.user.id }).select('_id binId location binType capacity');

    if (!bins || bins.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Get bin IDs
    const binIds = bins.map(b => b._id);

    // Import Route model
    const Route = require('../models/Route');

    // Find all completed routes that collected these bins
    const routes = await Route.find({
      'bins.bin': { $in: binIds },
      'bins.status': 'collected'
    })
      .populate('assignedTo', 'firstName lastName')
      .populate('bins.bin', 'binId location binType capacity')
      .sort({ completedAt: -1 }); // Newest first

    // Build collection history array
    const collectionHistory = [];

    routes.forEach(route => {
      route.bins.forEach(binItem => {
        // Check if this bin belongs to the resident and was collected
        if (binItem.status === 'collected' && 
            bins.some(b => b._id.toString() === binItem.bin._id.toString())) {
          
          collectionHistory.push({
            _id: `${route._id}_${binItem.bin._id}`, // Unique ID for each collection record
            binId: binItem.bin.binId,
            binLocation: binItem.bin.location,
            binType: binItem.bin.binType,
            binCapacity: binItem.bin.capacity,
            collectedAt: binItem.collectedAt || route.completedAt,
            collectorName: route.assignedTo 
              ? `${route.assignedTo.firstName} ${route.assignedTo.lastName}`
              : 'Unknown',
            collectorId: route.assignedTo?._id,
            weight: binItem.actualWeight || 0,
            fillLevelAtCollection: binItem.fillLevelAtCollection || 0,
            routeName: route.routeName,
            routeId: route._id
          });
        }
      });
    });

    // Sort by collection date (newest first)
    collectionHistory.sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt));

    res.status(200).json({
      success: true,
      count: collectionHistory.length,
      data: collectionHistory
    });
  } catch (error) {
    console.error('Error fetching collection history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collection history',
      error: error.message
    });
  }
};

