/**
 * User Service
 * Handles all user-related API calls
 */

import apiClient from './apiClient';

const userService = {
  /**
   * Get all users (admin only)
   */
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/users?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user status (admin only)
   */
  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.put(`/users/${userId}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user statistics (admin only)
   */
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/users/stats');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, profileData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get collectors (for route assignment)
   */
  getCollectors: async () => {
    try {
      const response = await apiClient.get('/users?role=collector&status=active');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
