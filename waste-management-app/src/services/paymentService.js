/**
 * Payment Service
 * Handles all payment processing functionality
 */

import apiService from './api';

// Using the singleton instance directly
const SIMULATE_DELAY = true;

// Helper to simulate network delay (500-2500ms)
const simulateDelay = async () => {
  if (SIMULATE_DELAY) {
    const delay = Math.floor(Math.random() * 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Helper to generate a unique transaction ID
const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Luhn algorithm for card validation is already implemented elsewhere

class PaymentService {
  /**
   * Process a payment
   * @param {Object} paymentData - Payment data including invoiceId, amount, paymentMethodId, appliedCredit
   * @returns {Promise<Object>} - Payment confirmation
   */
  async processPayment(paymentData) {
    try {
      await simulateDelay();
      
      const { invoiceId, amount, paymentMethodId, appliedCredit = 0 } = paymentData;
      
      // Simulate 90% success rate
      const isSuccessful = Math.random() < 0.9;
      
      if (!isSuccessful) {
        throw new Error('Payment processing failed. Please try again.');
      }
      
      // If amount is 0 (fully covered by credits), skip payment gateway
      if (amount === 0) {
        return {
          success: true,
          transactionId: generateTransactionId(),
          invoiceId,
          amountPaid: 0,
          appliedCredit,
          paymentMethod: 'Credit Points',
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
      }
      
      // Simulate payment gateway processing
      return {
        success: true,
        transactionId: generateTransactionId(),
        invoiceId,
        amountPaid: amount,
        appliedCredit,
        paymentMethod: paymentMethodId ? 'Saved Card' : 'New Card',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      // Uncomment when backend is ready
      // return await api.request('/payments/process', {
      //   method: 'POST',
      //   body: JSON.stringify(paymentData)
      // });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Get saved payment methods for a resident
   * @param {string} residentId - The resident's ID
   * @returns {Promise<Array>} - Array of payment methods
   */
  async getPaymentMethods(residentId) {
    try {
      await simulateDelay();
      
      // Simulated response
      return [
        {
          id: 'pm-1',
          type: 'card',
          cardType: 'visa',
          last4: '4242',
          expiryMonth: '12',
          expiryYear: '2025',
          isDefault: true
        },
        {
          id: 'pm-2',
          type: 'card',
          cardType: 'mastercard',
          last4: '5555',
          expiryMonth: '10',
          expiryYear: '2024',
          isDefault: false
        }
      ];
      
      // Uncomment when backend is ready
      // return await apiService.request(`/payments/methods/${userId}`, {
      //   method: 'GET'
      // });
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Add a new payment method
   * @param {string} residentId - The resident's ID
   * @param {Object} cardData - Card details (number, expiry, cvv, name)
   * @returns {Promise<Object>} - The saved payment method
   */
  async addPaymentMethod(residentId, cardData) {
    try {
      await simulateDelay();
      
      // Simulate card tokenization
      const cardType = this.detectCardType(cardData.number);
      const last4 = cardData.number.slice(-4);
      
      // Simulated response
      return {
        id: `pm-${Date.now()}`,
        type: 'card',
        cardType,
        last4,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        isDefault: false
      };
      
      // Uncomment when backend is ready
      // return await api.request(`/payments/methods/${residentId}`, {
      //   method: 'POST',
      //   body: JSON.stringify(cardData)
      // });
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  /**
   * Set a payment method as default
   * @param {string} methodId - The payment method ID
   * @returns {Promise<Object>} - Success response
   */
  async setDefaultPaymentMethod(methodId) {
    try {
      await simulateDelay();
      
      // Simulated response
      return {
        success: true,
        message: 'Default payment method updated'
      };
      
      // Uncomment when backend is ready
      // return await api.request(`/payments/methods/${methodId}/default`, {
      //   method: 'PUT'
      // });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  /**
   * Detect card type based on card number
   * @param {string} cardNumber - The card number
   * @returns {string} - Card type (visa, mastercard, amex, etc.)
   */
  detectCardType(cardNumber) {
    // Basic card type detection
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    
    if (cardNumber.startsWith('4')) {
      return 'visa';
    } else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
      return 'mastercard';
    } else if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) {
      return 'amex';
    } else if (cardNumber.startsWith('6')) {
      return 'discover';
    }
    
    return 'unknown';
  }
}

export default new PaymentService();