/**
 * Auth Context
 * Manages authentication state across the application
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        apiService.setToken(token);
        const response = await apiService.getProfile();
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // Clear invalid token and logout
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.login({ username, password });
      
      const { user: userData, token } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      apiService.setToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.register(userData);
      
      // Don't auto-login after registration
      // Just return success
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      apiService.clearToken();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateProfile(profileData);
      setUser(response.data.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data without making API call
  // Useful when the API call was already made by a component
  const refreshUserData = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return { success: false, error: err.message };
    }
  };

  const adminLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.adminLogin({ 
        username: 'admin', 
        password: 'admin123' 
      });
      
      const { user: userData, token } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      apiService.setToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Admin login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.changePassword(oldPassword, newPassword, confirmPassword);
      
      return { success: true, message: response.message };
    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateAccountSettings = async (settingsData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateAccountSettings(settingsData);
      setUser(response.data.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true, message: response.message };
    } catch (err) {
      const errorMessage = err.message || 'Account settings update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await apiService.deactivateAccount();
      
      // Logout after deactivation
      await logout();
      
      return { success: true, message: 'Account deactivated successfully' };
    } catch (err) {
      const errorMessage = err.message || 'Account deactivation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUserData,
    adminLogin,
    changePassword,
    updateAccountSettings,
    deactivateAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
