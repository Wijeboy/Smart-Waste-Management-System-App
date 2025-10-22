/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  /**
   * Login user
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Admin quick login
   */
  adminLogin: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/admin-login', {
        username,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
      }

      throw new Error(response.data.message || 'Admin login failed');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { token, user };
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      // Clear local storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get auth token from storage
   */
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
