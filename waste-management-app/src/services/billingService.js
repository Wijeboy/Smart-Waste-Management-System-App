/**
 * Billing Service
 * Handles all billing and invoice related functionality
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

class BillingService {
  /**
   * Get itemized invoice for a resident
   * @param {string} residentId - The resident's ID
   * @returns {Promise<Object>} - The invoice data
   */
  async requestInvoice(residentId) {
    try {
      await simulateDelay();
      
      // Simulated response until backend is connected
      return {
        invoiceId: `INV-${Date.now()}`,
        residentId,
        items: [
          { id: 1, description: 'Waste Collection - Standard', amount: 500 },
          { id: 2, description: 'Recycling Service', amount: 200 },
          { id: 3, description: 'Environmental Fee', amount: 100 }
        ],
        subtotal: 800,
        tax: 80,
        total: 880,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unpaid'
      };
      
      // Uncomment when backend is ready
      // return await apiService.request(`/billing/invoices/${userId}`, {
      //   method: 'GET'
      // });
    } catch (error) {
      console.error('Error requesting invoice:', error);
      throw error;
    }
  }

  /**
   * Apply credit points to an invoice
   * @param {string} invoiceId - The invoice ID
   * @param {number} creditAmount - Amount of credit to apply
   * @returns {Promise<Object>} - Updated invoice data
   */
  async applyCreditToInvoice(invoiceId, creditAmount) {
    try {
      await simulateDelay();
      
      // Get the invoice first (simulated)
      const invoice = {
        invoiceId,
        residentId: 'user-123',
        items: [
          { id: 1, description: 'Waste Collection - Standard', amount: 500 },
          { id: 2, description: 'Recycling Service', amount: 200 },
          { id: 3, description: 'Environmental Fee', amount: 100 }
        ],
        subtotal: 800,
        tax: 80,
        total: 880,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unpaid'
      };
      
      // Validate credit amount (max 50% of total)
      const maxAllowedCredit = Math.floor(invoice.total * 0.5);
      const appliedCredit = Math.min(creditAmount, maxAllowedCredit);
      
      // Calculate new total
      const newTotal = invoice.total - appliedCredit;
      
      return {
        ...invoice,
        appliedCredit,
        amountDue: newTotal,
        status: newTotal === 0 ? 'paid' : 'partial'
      };
      
      // Uncomment when backend is ready
      // return await api.request(`/billing/invoice/${invoiceId}/apply-credit`, {
      //   method: 'POST',
      //   body: JSON.stringify({ creditAmount })
      // });
    } catch (error) {
      console.error('Error applying credit to invoice:', error);
      throw error;
    }
  }

  /**
   * Get billing history for a resident
   * @param {string} residentId - The resident's ID
   * @returns {Promise<Array>} - Array of past invoices
   */
  async getBillingHistory(residentId) {
    try {
      await simulateDelay();
      
      // Simulated response
      return [
        {
          invoiceId: 'INV-20230501',
          date: '2023-05-01',
          total: 880,
          status: 'paid',
          paymentMethod: 'Credit Card'
        },
        {
          invoiceId: 'INV-20230401',
          date: '2023-04-01',
          total: 880,
          status: 'paid',
          paymentMethod: 'Credit Card'
        },
        {
          invoiceId: 'INV-20230301',
          date: '2023-03-01',
          total: 880,
          status: 'paid',
          paymentMethod: 'Credit Points'
        }
      ];
      
      // Uncomment when backend is ready
      // return await api.request(`/billing/history/${residentId}`, {
      //   method: 'GET'
      // });
    } catch (error) {
      console.error('Error getting billing history:', error);
      throw error;
    }
  }
}

export default new BillingService();