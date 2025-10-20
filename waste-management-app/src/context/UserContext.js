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
  const { user: authUser, updateUserProfile } = useAuth();
  
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
   * Calls the API to update the backend and refreshes user data
   * @param {Object} updates - Fields to update (name, role, etc.)
   */
  const updateProfile = async (updates) => {
    console.log('📝 Profile update requested:', updates);
    
    try {
      // Parse name into firstName and lastName
      const nameParts = updates.name ? updates.name.trim().split(' ') : [];
      const firstName = nameParts[0] || authUser?.firstName || '';
      const lastName = nameParts.slice(1).join(' ') || authUser?.lastName || '';
      
      // Prepare update data for backend
      const profileData = {
        firstName,
        lastName,
        role: updates.role || authUser?.role,
      };
      
      console.log('📤 Sending to API:', profileData);
      
      // Call AuthContext's updateUserProfile which handles API call and state update
      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        console.log('✅ Profile updated successfully');
        return { success: true };
      } else {
        console.error('❌ Profile update failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message };
    }
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
