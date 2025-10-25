/**
 * Route Service
 * Handles all route-related API calls
 */

import apiClient from './apiClient';

const routeService = {
  /**
   * Create new route
   */
  createRoute: async (routeData) => {
    try {
      const response = await apiClient.post('/routes', routeData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all routes
   */
  getAllRoutes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/routes?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get route by ID
   */
  getRouteById: async (routeId) => {
    try {
      const response = await apiClient.get(`/routes/${routeId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update route
   */
  updateRoute: async (routeId, routeData) => {
    try {
      const response = await apiClient.put(`/routes/${routeId}`, routeData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete route
   */
  deleteRoute: async (routeId) => {
    try {
      const response = await apiClient.delete(`/routes/${routeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Assign collector to route
   */
  assignCollector: async (routeId, collectorId) => {
    try {
      const response = await apiClient.put(`/routes/${routeId}/assign`, {
        collectorId,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get route statistics
   */
  getRouteStats: async () => {
    try {
      const response = await apiClient.get('/routes/stats');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get collector's routes
   */
  getCollectorRoutes: async (collectorId, status = null) => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/routes/collector/${collectorId}${params}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default routeService;
