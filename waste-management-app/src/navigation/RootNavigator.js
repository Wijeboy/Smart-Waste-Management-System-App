/**
 * RootNavigator
 * Handles authentication flow and main app navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Main App Navigator
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator
 * Routes between auth and main app based on authentication status
 * @returns {JSX.Element} The root navigation stack
 */
const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Main App Stack
        <Stack.Screen name="MainApp" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
});

export default RootNavigator;
