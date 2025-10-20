# Phase 1 Implementation Guide - Quick Start

## Overview
This guide provides step-by-step instructions and code examples to implement Phase 1 of the API migration.

---

## Task 1: Create Bin Model

**File**: `/backend/models/Bin.js`

```javascript
const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: [true, 'Bin ID is required'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  zone: {
    type: String,
    required: [true, 'Zone is required'],
    enum: ['Zone A', 'Zone B', 'Zone C', 'Zone D']
  },
  binType: {
    type: String,
    required: [true, 'Bin type is required'],
    enum: ['General Waste', 'Recyclable', 'Organic', 'Hazardous']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1 kg']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'full'],
    default: 'active'
  },
  fillLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastCollection: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
binSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique binId if not provided
binSchema.pre('save', async function(next) {
  if (!this.binId) {
    const count = await this.constructor.countDocuments();
    this.binId = `BIN${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Virtual for checking if bin is nearly full
binSchema.virtual('isNearlyFull').get(function() {
  return this.fillLevel >= 80;
});

// Virtual for checking if bin needs collection
binSchema.virtual('needsCollection').get(function() {
  return this.fillLevel >= 85 || this.status === 'full';
});

module.exports = mongoose.model('Bin', binSchema);
```

---

## Task 2: Create Bin Controller

**File**: `/backend/controllers/binController.js`

```javascript
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
      .populate('createdBy', 'firstName lastName');

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
// @access  Private (Admin only)
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
    } else if (fillLevel < 90 && updates.status === 'full') {
      updates.status = 'active';
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
```

---

## Task 3: Create Bin Routes

**File**: `/backend/routes/bins.js`

```javascript
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
  getBinStats
} = require('../controllers/binController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const binValidation = [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('zone').isIn(['Zone A', 'Zone B', 'Zone C', 'Zone D']).withMessage('Invalid zone'),
  body('binType')
    .isIn(['General Waste', 'Recyclable', 'Organic', 'Hazardous'])
    .withMessage('Invalid bin type'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('coordinates.lat').isNumeric().withMessage('Latitude must be a number'),
  body('coordinates.lng').isNumeric().withMessage('Longitude must be a number')
];

// All routes require authentication
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getBinStats);

// Zone route
router.get('/zone/:zone', getBinsByZone);

// Main CRUD routes
router.route('/')
  .get(getAllBins)
  .post(binValidation, createBin);

router.route('/:id')
  .get(getBinById)
  .put(updateBin)
  .delete(authorize('admin', 'supervisor'), deleteBin);

// Specific update routes
router.patch('/:id/status', updateBinStatus);
router.patch('/:id/fillLevel', updateFillLevel);

module.exports = router;
```

---

## Task 4: Update Server.js

**File**: `/backend/server.js`

Add the new bins route:

```javascript
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bins', require('./routes/bins'));  // Add this line
```

---

## Task 5: Update Frontend API Service

**File**: `/waste-management-app/src/services/api.js`

Add bin methods to the ApiService class:

```javascript
  // Bin endpoints
  async getBins(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bins${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getBinById(id) {
    return this.request(`/bins/${id}`, {
      method: 'GET',
    });
  }

  async createBin(binData) {
    return this.request('/bins', {
      method: 'POST',
      body: JSON.stringify(binData),
    });
  }

  async updateBin(id, updates) {
    return this.request(`/bins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBin(id) {
    return this.request(`/bins/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBinStatus(id, status) {
    return this.request(`/bins/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateBinFillLevel(id, fillLevel, weight) {
    return this.request(`/bins/${id}/fillLevel`, {
      method: 'PATCH',
      body: JSON.stringify({ fillLevel, weight }),
    });
  }

  async getBinsByZone(zone) {
    return this.request(`/bins/zone/${zone}`, {
      method: 'GET',
    });
  }

  async getBinStats() {
    return this.request('/bins/stats', {
      method: 'GET',
    });
  }
```

---

## Task 6: Update BinsContext

**File**: `/waste-management-app/src/context/BinsContext.js`

Replace with API-integrated version:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const BinsContext = createContext();

export const BinsProvider = ({ children }) => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch bins on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBins();
    }
  }, [isAuthenticated]);

  const fetchBins = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBins(filters);
      setBins(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bins:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBin = async (binData) => {
    try {
      setLoading(true);
      const response = await apiService.createBin(binData);
      setBins(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateBin = async (binId, updates) => {
    try {
      setLoading(true);
      const response = await apiService.updateBin(binId, updates);
      setBins(prev => prev.map(bin => 
        bin._id === binId ? response.data : bin
      ));
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBin = async (binId) => {
    try {
      setLoading(true);
      await apiService.deleteBin(binId);
      setBins(prev => prev.filter(bin => bin._id !== binId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getBinById = (binId) => {
    return bins.find(bin => bin._id === binId);
  };

  const getBinsByStatus = (status) => {
    return bins.filter(bin => bin.status === status);
  };

  const getBinsByWasteType = (wasteType) => {
    return bins.filter(bin => bin.binType === wasteType);
  };

  const getAllBinsSorted = () => {
    return [...bins].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getBinsStatistics = () => {
    return {
      total: bins.length,
      pending: bins.filter(bin => bin.status === 'pending').length,
      completed: bins.filter(bin => bin.status === 'completed').length,
      byWasteType: {
        general: bins.filter(bin => bin.binType === 'General Waste').length,
        recyclable: bins.filter(bin => bin.binType === 'Recyclable').length,
        organic: bins.filter(bin => bin.binType === 'Organic').length,
      },
    };
  };

  const value = {
    bins,
    loading,
    error,
    fetchBins,
    addBin,
    updateBin,
    deleteBin,
    getBinById,
    getBinsByStatus,
    getBinsByWasteType,
    getAllBinsSorted,
    getBinsStatistics,
  };

  return <BinsContext.Provider value={value}>{children}</BinsContext.Provider>;
};

export const useBins = () => {
  const context = useContext(BinsContext);
  if (!context) {
    throw new Error('useBins must be used within a BinsProvider');
  }
  return context;
};

export default BinsContext;
```

---

## Task 7: Seed Initial Data (Optional but Recommended)

**File**: `/backend/scripts/seedBins.js`

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bin = require('../models/Bin');

dotenv.config();

const bins = [
  {
    binId: 'BIN001',
    location: 'Colombo 01 - Fort Area',
    zone: 'Zone A',
    binType: 'General Waste',
    capacity: 100,
    status: 'active',
    fillLevel: 45,
    weight: 45,
    coordinates: { lat: 6.9271, lng: 79.8612 },
    registrationDate: new Date('2024-01-10'),
    lastCollection: new Date('2024-02-15')
  },
  {
    binId: 'BIN002',
    location: 'Colombo 02 - Slave Island',
    zone: 'Zone A',
    binType: 'Recyclable',
    capacity: 80,
    status: 'active',
    fillLevel: 78,
    weight: 62,
    coordinates: { lat: 6.9200, lng: 79.8500 },
    registrationDate: new Date('2024-01-12'),
    lastCollection: new Date('2024-02-14')
  },
  {
    binId: 'BIN003',
    location: 'Colombo 03 - Kollupitiya',
    zone: 'Zone B',
    binType: 'General Waste',
    capacity: 120,
    status: 'active',
    fillLevel: 92,
    weight: 110,
    coordinates: { lat: 6.9100, lng: 79.8400 },
    registrationDate: new Date('2024-01-15'),
    lastCollection: new Date('2024-02-13')
  }
];

const seedBins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing bins
    await Bin.deleteMany({});
    console.log('Existing bins cleared');

    // Insert new bins
    await Bin.insertMany(bins);
    console.log('Sample bins inserted');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding bins:', error);
    process.exit(1);
  }
};

seedBins();
```

Run with: `node backend/scripts/seedBins.js`

---

## Testing the Implementation

### 1. Test Backend with Postman

**GET All Bins**:
```
GET http://localhost:5000/api/bins
Headers: Authorization: Bearer YOUR_TOKEN
```

**Create Bin**:
```
POST http://localhost:5000/api/bins
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body:
{
  "location": "Test Location",
  "zone": "Zone A",
  "binType": "General Waste",
  "capacity": 100,
  "coordinates": {
    "lat": 6.9271,
    "lng": 79.8612
  }
}
```

### 2. Test Frontend

Add console logs in BinsContext to verify data is loading:

```javascript
useEffect(() => {
  if (isAuthenticated) {
    console.log('Fetching bins from API...');
    fetchBins();
  }
}, [isAuthenticated]);
```

### 3. Check Error Handling

Try accessing bins without authentication to verify protected routes work.

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
- Make sure backend is running on port 5000
- Check API_URL in frontend matches your setup

### Issue 2: "Unauthorized" error
- User must be logged in
- Token must be valid
- Check AuthContext is providing token

### Issue 3: Bins not appearing
- Check console logs for errors
- Verify bins exist in database
- Check if `isAuthenticated` is true

### Issue 4: Duplicate bin ID
- Either provide unique binId or let it auto-generate
- Check if binId already exists in database

---

## Next Steps After Phase 1

Once bins are working:
1. Test all CRUD operations
2. Verify loading and error states
3. Move to Phase 2: Routes & Collections
4. Replicate same pattern for other entities

---

## Success Checklist

✅ Bin model created and tested
✅ All bin controller functions working
✅ Routes properly configured with authentication
✅ Frontend API service methods added
✅ BinsContext updated to use API
✅ Loading and error states handled
✅ Can create, read, update, delete bins
✅ Stats endpoint returning correct data
✅ Zone filtering working
✅ Fill level updates working

---

_Happy Coding! 🚀_
