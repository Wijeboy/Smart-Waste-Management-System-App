/**
 * API Service
 * Handles all API calls to the backend
 */

import { Platform } from 'react-native';

// Determine API URL based on platform
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Using actual IP address instead of 10.0.2.2 (more reliable)
    return 'http://192.168.1.8:5000/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:5000/api';
  } else if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  // For physical devices
  return 'http://192.168.1.8:5000/api';
};

const API_URL = getApiUrl();

// Log the API URL being used
console.log('===========================================');
console.log('API Service Initialized');
console.log('Platform:', Platform.OS);
console.log('API URL:', API_URL);
console.log('===========================================');

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = `${API_URL}${endpoint}`;
    console.log('API Request:', url);
    console.log('API Method:', options.method || 'GET');
    console.log('API Headers:', headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      console.error('Error message:', error.message);
      
      // Handle network errors specifically
      if (error.message === 'Network request failed' || error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Make sure the backend is running and accessible.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile', {
      method: 'GET',
    });
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async checkHealth() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export default new ApiService();
