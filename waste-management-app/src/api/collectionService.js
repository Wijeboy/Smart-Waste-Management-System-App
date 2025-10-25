/**
 * Collection Service
 * Handles all collection-related API calls
 */

import apiClient from './apiClient';

const collectionService = {
  /**
   * Start a route
   */
  startRoute: async (routeId) => {
    try {
      const response = await apiClient.put(`/collections/routes/${routeId}/start`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete a route
   */
  completeRoute: async (routeId) => {
    try {
      const response = await apiClient.put(`/collections/routes/${routeId}/complete`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Collect a bin
   */
  collectBin: async (binId, routeId, notes = '') => {
    try {
      const response = await apiClient.put(`/collections/bins/${binId}/collect`, {
        routeId,
        notes,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Skip a bin
   */
  skipBin: async (binId, routeId, reason) => {
    try {
      const response = await apiClient.put(`/collections/bins/${binId}/skip`, {
        routeId,
        reason,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get route progress
   */
  getRouteProgress: async (routeId) => {
    try {
      const response = await apiClient.get(`/collections/routes/${routeId}/progress`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default collectionService;
