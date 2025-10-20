/**
 * UserContext
 * Provides user profile data and settings globally across the app
 */

import React, { createContext, useState, useContext } from 'react';

/**
 * Initial user profile data
 */
const INITIAL_USER = {
  name: 'Alex Johnson',
  role: 'Collection Supervisor',
  employeeId: 'EMP-001',
  joinDate: '2020',
  avatar: null, // Can be updated to a photo URI
  settings: {
    audioConfirmation: true,
    vibrationFeedback: true,
    autoSync: false,
  },
};

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
  const [user, setUser] = useState(INITIAL_USER);

  /**
   * Updates user profile information
   * @param {Object} updates - Fields to update (name, role, avatar, etc.)
   */
  const updateProfile = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  /**
   * Updates a specific setting
   * @param {string} setting - Setting key (audioConfirmation, vibrationFeedback, autoSync)
   * @param {boolean} value - New value for the setting
   */
  const updateSetting = (setting, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        [setting]: value,
      },
    }));
  };

  /**
   * Gets the user's full display name
   * @returns {string} User's full name
   */
  const getUserDisplayName = () => {
    return user.name;
  };

  /**
   * Gets user's first name only
   * @returns {string} User's first name
   */
  const getUserFirstName = () => {
    return user.name.split(' ')[0];
  };

  /**
   * Resets user profile to initial state (for testing or logout)
   */
  const resetProfile = () => {
    setUser(INITIAL_USER);
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
