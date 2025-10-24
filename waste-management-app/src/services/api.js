/**
 * API Service
 * Handles all API calls to the backend
 */

import { Platform } from 'react-native';

// Determine API URL based on platform
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Use the same network IP as Expo (10.38.245.146)
    // This ensures Android device/emulator can reach the backend
    return 'http://10.38.245.146:3001/api';
  } else if (Platform.OS === 'ios') {
    // iOS can use the same network IP
    return 'http://10.38.245.146:3001/api';
  } else if (Platform.OS === 'web') {
    // Web version uses localhost since it's running in browser
    return 'http://localhost:3001/api';
  }
  // Default fallback for physical devices
  return 'http://10.38.245.146:3001/api';
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
    if (options.body) {
      console.log('API Body:', options.body);
    }

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

  async adminLogin(credentials) {
    return this.request('/auth/admin-login', {
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

  // ========================================
  // Auth Account Management
  // ========================================

  async changePassword(oldPassword, newPassword, confirmPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    });
  }

  async updateAccountSettings(data) {
    return this.request('/auth/account-settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deactivateAccount() {
    return this.request('/auth/deactivate', {
      method: 'PUT',
    });
  }

  // Bin endpoints
  async getBins(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bins${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getBinById(id) {
    return this.request(`/bins/${id}`, {
      method: 'GET',
    });
  }

  async createBin(binData) {
    return this.request('/bins', {
      method: 'POST',
      body: JSON.stringify(binData),
    });
  }

  async updateBin(id, updates) {
    return this.request(`/bins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBin(id) {
    return this.request(`/bins/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBinStatus(id, status) {
    return this.request(`/bins/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateBinFillLevel(id, fillLevel, weight) {
    return this.request(`/bins/${id}/fillLevel`, {
      method: 'PATCH',
      body: JSON.stringify({ fillLevel, weight }),
    });
  }

  async getBinsByZone(zone) {
    return this.request(`/bins/zone/${zone}`, {
      method: 'GET',
    });
  }

  async getBinsByType(type) {
    return this.request(`/bins/type/${type}`, {
      method: 'GET',
    });
  }

  async getBinsByStatus(status) {
    return this.request(`/bins/status/${status}`, {
      method: 'GET',
    });
  }

  async getBinStats() {
    return this.request('/bins/stats', {
      method: 'GET',
    });
  }

  // ========================================
  // Admin User Management
  // ========================================

  async getAllUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/users${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'GET',
    });
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async suspendUser(id) {
    return this.request(`/admin/users/${id}/suspend`, {
      method: 'PUT',
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ========================================
  // Admin Route Management
  // ========================================

  async createRoute(routeData) {
    return this.request('/admin/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async getAllRoutes(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/routes${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getRouteById(id) {
    return this.request(`/admin/routes/${id}`, {
      method: 'GET',
    });
  }

  async updateRoute(id, updates) {
    return this.request(`/admin/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRoute(id) {
    return this.request(`/admin/routes/${id}`, {
      method: 'DELETE',
    });
  }

  async assignCollector(routeId, collectorId) {
    return this.request(`/admin/routes/${routeId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ collectorId }),
    });
  }

  async getRouteStats() {
    return this.request('/admin/routes/stats', {
      method: 'GET',
    });
  }

  // ========================================
  // Collector Route Management
  // ========================================

  async getMyRoutes(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/routes/my-routes${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  async getCompletedRoutes() {
    return this.request(`/routes/my-routes?status=completed`, {
      method: 'GET',
    });
  }

  async startRoute(routeId, preRouteChecklist) {
    return this.request(`/routes/${routeId}/start`, {
      method: 'PUT',
      body: JSON.stringify({ preRouteChecklist }),
    });
  }

  async collectBin(routeId, binId, actualWeight) {
    return this.request(`/routes/${routeId}/bins/${binId}/collect`, {
      method: 'PUT',
      body: JSON.stringify({ actualWeight }),
    });
  }

  async skipBin(routeId, binId, reason) {
    return this.request(`/routes/${routeId}/bins/${binId}/skip`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async completeRoute(routeId) {
    return this.request(`/routes/${routeId}/complete`, {
      method: 'PUT',
    });
  }

  // ========================================
  // Analytics & Reporting
  // ========================================

  async getAnalytics() {
    return this.request('/admin/analytics', {
      method: 'GET',
    });
  }

  async getKPIs() {
    return this.request('/admin/analytics/kpis', {
      method: 'GET',
    });
  }

  async getCollectionTrends(period = 'weekly') {
    return this.request(`/admin/analytics/trends?period=${period}`, {
      method: 'GET',
    });
  }

  async getWasteDistribution() {
    return this.request('/admin/analytics/waste-distribution', {
      method: 'GET',
    });
  }

  async getRoutePerformance() {
    return this.request('/admin/analytics/route-performance', {
      method: 'GET',
    });
  }

  async getBinAnalytics() {
    return this.request('/admin/analytics/bin-analytics', {
      method: 'GET',
    });
  }

  async getUserAnalytics() {
    return this.request('/admin/analytics/user-analytics', {
      method: 'GET',
    });
  }

  async getZoneAnalytics() {
    return this.request('/admin/analytics/zone-analytics', {
      method: 'GET',
    });
  }
}

export default new ApiService();
