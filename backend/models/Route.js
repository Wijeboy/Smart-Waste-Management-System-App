const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bins: [{
    bin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bin',
      required: true
    },
    order: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['pending', 'collected', 'skipped'],
      default: 'pending'
    },
    collectedAt: {
      type: Date
    },
    fillLevelAtCollection: {
      type: Number,
      min: 0,
      max: 100
    },
    actualWeight: {
      type: Number,
      min: 0,
      comment: 'Actual weight in kg entered by collector'
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }],
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  },
  // Analytics fields
  binsCollected: {
    type: Number,
    default: 0,
    min: 0
  },
  wasteCollected: {
    type: Number,
    default: 0,
    min: 0
  },
  recyclableWaste: {
    type: Number,
    default: 0,
    min: 0
  },
  efficiency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  satisfaction: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
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
routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total bins count
routeSchema.virtual('totalBins').get(function() {
  return this.bins.length;
});

// Virtual for collected bins count
routeSchema.virtual('collectedBins').get(function() {
  return this.bins.filter(b => b.status === 'collected').length;
});

// Virtual for pending bins count
routeSchema.virtual('pendingBins').get(function() {
  return this.bins.filter(b => b.status === 'pending').length;
});

// Virtual for skipped bins count
routeSchema.virtual('skippedBins').get(function() {
  return this.bins.filter(b => b.status === 'skipped').length;
});

// Virtual for progress percentage
routeSchema.virtual('progress').get(function() {
  if (this.bins.length === 0) return 0;
  return Math.round((this.collectedBins / this.totalBins) * 100);
});

// Virtual for checking if route is complete
routeSchema.virtual('isComplete').get(function() {
  if (this.bins.length === 0) return false;
  return this.bins.every(b => b.status === 'collected' || b.status === 'skipped');
});

// Enable virtuals in JSON
routeSchema.set('toJSON', { virtuals: true });
routeSchema.set('toObject', { virtuals: true });

// Index for faster queries
routeSchema.index({ status: 1, scheduledDate: 1 });
routeSchema.index({ assignedTo: 1, status: 1 });
routeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Route', routeSchema);
