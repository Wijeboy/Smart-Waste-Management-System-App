/**
 * UserContext
 * Provides user profile data and settings globally across the app
 * Now using real authenticated user data from AuthContext
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * Create the User Context
 */
const UserContext = createContext();

/**
 * UserProvider Component
 * Wraps the app and provides user state and functions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The UserProvider component
 */
export const UserProvider = ({ children }) => {
  // Get real user from AuthContext
  const { user: authUser } = useAuth();
  
  // Local settings state
  const [settings, setSettings] = useState({
    audioConfirmation: true,
    vibrationFeedback: true,
    autoSync: false,
  });
  
  // Transform auth user to include settings
  const user = authUser ? {
    ...authUser,
    name: `${authUser.firstName} ${authUser.lastName}`,
    role: authUser.role || 'User',
    employeeId: authUser.id || 'N/A',
    joinDate: authUser.createdAt ? new Date(authUser.createdAt).getFullYear().toString() : 'N/A',
    avatar: null,
    settings,
  } : null;

  /**
   * Updates user profile information
   * Note: This should ideally call the API to update the backend
   * For now, it only updates local state
   * @param {Object} updates - Fields to update
   */
  const updateProfile = (updates) => {
    console.log('Profile update requested:', updates);
    // TODO: Call API to update user profile
    // For now, this is a no-op since user comes from AuthContext
  };

  /**
   * Updates a specific setting
   * @param {string} setting - Setting key (audioConfirmation, vibrationFeedback, autoSync)
   * @param {boolean} value - New value for the setting
   */
  const updateSetting = (setting, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: value,
    }));
  };

  /**
   * Gets the user's full display name
   * @returns {string} User's full name
   */
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  };

  /**
   * Gets user's first name only
   * @returns {string} User's first name
   */
  const getUserFirstName = () => {
    if (!user) return 'Guest';
    return user.firstName || user.name?.split(' ')[0] || 'User';
  };

  /**
   * Resets user settings to default (user data comes from AuthContext)
   */
  const resetProfile = () => {
    setSettings({
      audioConfirmation: true,
      vibrationFeedback: true,
      autoSync: false,
    });
  };

  const value = {
    user,
    updateProfile,
    updateSetting,
    getUserDisplayName,
    getUserFirstName,
    resetProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to use the User Context
 * @returns {Object} Context value with user data and functions
 * @throws {Error} If used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
