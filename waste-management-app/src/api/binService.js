/**
 * Bin Service
 * Handles all bin-related API calls
 */

import apiClient from './apiClient';

const binService = {
  /**
   * Get all bins
   */
  getAllBins: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.zone) params.append('zone', filters.zone);
      if (filters.status) params.append('status', filters.status);
      if (filters.fillLevel) params.append('fillLevel', filters.fillLevel);
      if (filters.search) params.append('search', filters.search);

      const response = await apiClient.get(`/bins?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get bin by ID
   */
  getBinById: async (binId) => {
    try {
      const response = await apiClient.get(`/bins/${binId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new bin
   */
  createBin: async (binData) => {
    try {
      const response = await apiClient.post('/bins', binData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update bin
   */
  updateBin: async (binId, binData) => {
    try {
      const response = await apiClient.put(`/bins/${binId}`, binData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete bin
   */
  deleteBin: async (binId) => {
    try {
      const response = await apiClient.delete(`/bins/${binId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update bin fill level
   */
  updateFillLevel: async (binId, fillLevel) => {
    try {
      const response = await apiClient.put(`/bins/${binId}/fill-level`, {
        fillLevel,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get bins by zone
   */
  getBinsByZone: async (zone) => {
    try {
      const response = await apiClient.get(`/bins?zone=${zone}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get bins requiring collection (fill level > threshold)
   */
  getBinsRequiringCollection: async (threshold = 75) => {
    try {
      const response = await apiClient.get(`/bins?fillLevel=${threshold}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default binService;
