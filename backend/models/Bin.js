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

// Enable virtuals in JSON
binSchema.set('toJSON', { virtuals: true });
binSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Bin', binSchema);
