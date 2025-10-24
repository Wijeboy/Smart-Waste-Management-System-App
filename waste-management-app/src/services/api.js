/**
 * API Service
 * Handles all API communication with the backend
 */

import { Platform } from 'react-native';

// Determine API URL based on platform
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Using 10.0.2.2 for Android emulator
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:5000/api';
  } else if (Platform.OS === 'web') {
    // For web, always use the local server
    return 'http://localhost:5000/api';
  }
  // For physical devices - use the network IP
  return 'http://192.168.1.8:5000/api';
};

const API_URL = getApiUrl();

// Log the API URL being used
console.log('===========================================');
console.log('API Service Initialized');
console.log('Platform:', Platform.OS);
console.log('API URL:', API_URL);
console.log('===========================================');

/**
 * API Service for handling all backend communication
 */
class ApiService {
  constructor() {
    this.apiUrl = API_URL;
    this.authToken = null;
  }

  /**
   * Set the authentication token for API requests
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Clear the authentication token
   */
  clearAuthToken() {
    this.authToken = null;
  }

  /**
   * Get the current authentication token
   * @returns {string|null} - Current JWT token
   */
  getAuthToken() {
    return this.authToken;
  }

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Prepare request options
    const requestOptions = {
      ...options,
      headers
    };

    // Convert body to JSON string if it's an object
    if (requestOptions.body && typeof requestOptions.body === 'object') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Check if response is successful
        if (!response.ok) {
          const error = new Error(data.message || 'API request failed');
          error.status = response.status;
          error.data = data;
          throw error;
        }
        
        return data;
      } else {
        // For non-JSON responses
        const text = await response.text();
        
        if (!response.ok) {
          const error = new Error(text || 'API request failed');
          error.status = response.status;
          throw error;
        }
        
        return text;
      }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async logout() {
    this.clearAuthToken();
    return true;
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me', {
      method: 'GET'
    });
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: profileData
    });
  }

  // Bin endpoints
  async getBins(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bins?${queryParams}`, {
      method: 'GET'
    });
  }

  async getBinById(binId) {
    return this.request(`/bins/${binId}`, {
      method: 'GET'
    });
  }

  async createBin(binData) {
    return this.request('/bins', {
      method: 'POST',
      body: binData
    });
  }

  async updateBin(binId, binData) {
    return this.request(`/bins/${binId}`, {
      method: 'PUT',
      body: binData
    });
  }

  async deleteBin(binId) {
    return this.request(`/bins/${binId}`, {
      method: 'DELETE'
    });
  }

  // Route endpoints
  async getRoutes(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/routes?${queryParams}`, {
      method: 'GET'
    });
  }

  async getRouteById(routeId) {
    return this.request(`/routes/${routeId}`, {
      method: 'GET'
    });
  }

  async createRoute(routeData) {
    return this.request('/routes', {
      method: 'POST',
      body: routeData
    });
  }

  async updateRoute(routeId, routeData) {
    return this.request(`/routes/${routeId}`, {
      method: 'PUT',
      body: routeData
    });
  }

  async deleteRoute(routeId) {
    return this.request(`/routes/${routeId}`, {
      method: 'DELETE'
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
