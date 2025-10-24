/**
 * Payment Service Utility
 * Handles payment calculations and credit points conversion
 */

// Base charges per collection
export const BASE_CHARGES = {
  wasteCollection: 45.00,
  recyclingProcessing: 25.00,
  serviceFee: 5.00,
};

// Calculate subtotal
export const calculateSubtotal = () => {
  return BASE_CHARGES.wasteCollection + 
         BASE_CHARGES.recyclingProcessing + 
         BASE_CHARGES.serviceFee;
};

/**
 * Calculate discount from credit points
 * Rate: 100 points = $5 discount
 * @param {number} points - Number of points to redeem
 * @returns {number} Discount amount in dollars
 */
export const calculateDiscount = (points) => {
  if (!points || points < 0) return 0;
  return (points / 100) * 5;
};

/**
 * Calculate total amount after applying credit points discount
 * @param {number} pointsToRedeem - Number of points to redeem
 * @returns {object} Payment summary with breakdown
 */
export const calculatePaymentSummary = (pointsToRedeem = 0) => {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(pointsToRedeem);
  const totalAmount = Math.max(0, subtotal - discount); // Never negative

  return {
    wasteCollection: BASE_CHARGES.wasteCollection,
    recyclingProcessing: BASE_CHARGES.recyclingProcessing,
    serviceFee: BASE_CHARGES.serviceFee,
    subtotal,
    pointsRedeemed: pointsToRedeem,
    discount,
    totalAmount,
  };
};

/**
 * Validate if user has sufficient points to redeem
 * @param {number} availablePoints - User's current credit points
 * @param {number} pointsToRedeem - Points user wants to redeem
 * @returns {object} Validation result
 */
export const validatePointsRedemption = (availablePoints, pointsToRedeem) => {
  // Minimum redemption check
  if (pointsToRedeem < 50) {
    return {
      valid: false,
      message: 'Minimum 50 points required to redeem',
    };
  }

  // Sufficient points check
  if (pointsToRedeem > availablePoints) {
    return {
      valid: false,
      message: 'Insufficient credit points',
    };
  }

  // Check if points would result in more discount than total
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(pointsToRedeem);
  
  if (discount > subtotal) {
    // Calculate maximum points that can be redeemed
    const maxPoints = Math.floor((subtotal / 5) * 100);
    return {
      valid: false,
      message: `Maximum ${maxPoints} points can be redeemed for this payment`,
    };
  }

  return {
    valid: true,
    message: 'Valid redemption',
  };
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Get available point presets based on user's balance
 * @param {number} availablePoints - User's current credit points
 * @returns {array} Array of preset amounts
 */
export const getPointPresets = (availablePoints) => {
  const allPresets = [50, 100, 200, 300];
  const maxRedeemable = Math.floor((calculateSubtotal() / 5) * 100);
  
  return allPresets.filter(preset => 
    preset <= availablePoints && preset <= maxRedeemable
  );
};

export default {
  BASE_CHARGES,
  calculateSubtotal,
  calculateDiscount,
  calculatePaymentSummary,
  validatePointsRedemption,
  formatCurrency,
  getPointPresets,
};
