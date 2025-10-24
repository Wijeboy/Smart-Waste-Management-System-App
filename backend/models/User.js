const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot be more than 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    unique: true,
    trim: true,
    match: [
      /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/,
      'Please provide a valid NIC number'
    ]
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [
      /^[0-9]{10}$/,
      'Please provide a valid 10-digit phone number'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'collector', 'resident'],
    default: 'collector' // Default to collector for backward compatibility
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: null
  },
  address: {
    type: String,
    trim: true
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  },
  creditPoints: {
    type: Number,
    default: 0,
    min: [0, 'Credit points cannot be negative']
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login timestamp
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Earn credit points
// Rate: 1kg = 10 points, Recyclable waste = 15 points per kg
userSchema.methods.earnPoints = async function(weight, isRecyclable = false) {
  const pointsPerKg = isRecyclable ? 15 : 10;
  const pointsEarned = Math.floor(weight * pointsPerKg);
  this.creditPoints += pointsEarned;
  await this.save();
  return pointsEarned;
};

// Redeem credit points
// Conversion rate: 100 points = $5 discount
// Minimum redemption: 50 points
userSchema.methods.redeemPoints = async function(pointsToRedeem) {
  if (pointsToRedeem < 50) {
    throw new Error('Minimum 50 points required to redeem');
  }
  if (this.creditPoints < pointsToRedeem) {
    throw new Error('Insufficient credit points');
  }
  this.creditPoints -= pointsToRedeem;
  await this.save();
  
  // Calculate discount: 100 points = $5
  const discount = (pointsToRedeem / 100) * 5;
  return { pointsRedeemed: pointsToRedeem, discount };
};

// Get credit points balance
userSchema.methods.getCreditPoints = function() {
  return this.creditPoints;
};

module.exports = mongoose.model('User', userSchema);
