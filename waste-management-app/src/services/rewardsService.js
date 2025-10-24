/**
 * Rewards Service
 * Handles all credit points and rewards functionality
 * Mock implementation for development
 */

import apiService from './api';

const SIMULATE_DELAY = true;

// Helper to simulate network delay (500-2500ms)
const simulateDelay = async () => {
  if (SIMULATE_DELAY) {
    const delay = Math.floor(Math.random() * 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

class RewardsService {
  /**
   * Get available and total credit points for a resident
   * @param {string} residentId - The resident's ID
   * @returns {Promise<Object>} - Credit points information
   */
  async checkCredits(residentId) {
    try {
      await simulateDelay();
      
      // Simulated response
      return {
        availablePoints: 200,
        totalEarnedPoints: 350,
        pendingPoints: 150,
        conversionRate: 0.5, // 1 point = Rs. 0.50
        lastUpdated: new Date().toISOString()
      };
      
      // Uncomment when backend is ready
      // return await apiService.request(`/rewards/credits/${residentId}`, {
      //   method: 'GET'
      // });
    } catch (error) {
      console.error('Error checking credits:', error);
      throw error;
    }
  }

  /**
   * Claim earned points to make them available for use
   * @param {string} residentId - The resident's ID
   * @param {number} points - Number of points to claim
   * @returns {Promise<Object>} - Updated credit points information
   */
  async claimCreditPoints(residentId, points) {
    try {
      await simulateDelay();
      
      // Simulated response
      return {
        success: true,
        claimedPoints: points,
        availablePoints: 350, // 200 + 150 (previously pending)
        pendingPoints: 0,
        message: `Successfully claimed ${points} points`
      };
      
      // Uncomment when backend is ready
      // return await api.request(`/rewards/claim`, {
      //   method: 'POST',
      //   body: JSON.stringify({ residentId, points })
      // });
    } catch (error) {
      console.error('Error claiming credit points:', error);
      throw error;
    }
  }

  /**
   * Get recent activities that earned or used points
   * @param {string} residentId - The resident's ID
   * @returns {Promise<Array>} - Array of recent activities
   */
  async getRecentActivities(residentId) {
    try {
      await simulateDelay();
      
      // Simulated response
      return [
        {
          id: 'act-1',
          type: 'earned',
          points: 50,
          description: 'Recycling bonus',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'act-2',
          type: 'earned',
          points: 100,
          description: 'On-time waste disposal',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'act-3',
          type: 'used',
          points: 80,
          description: 'Applied to invoice #INV-20230301',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // Uncomment when backend is ready
      // return await api.request(`/rewards/activities/${residentId}`, {
      //   method: 'GET'
      // });
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  }
}

export default new RewardsService();