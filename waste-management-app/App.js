/**
 * App Component
 * Root component of the Waste Management Application
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { RouteProvider } from './src/context/RouteContext';
import { BinsProvider } from './src/context/BinsContext';
import { UserProvider } from './src/context/UserContext';

/**
 * App
 * Main application component with navigation and context providers
 * @returns {JSX.Element} The root App component
 */
export default function App() {
  return (
    <UserProvider>
      <BinsProvider>
        <RouteProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </RouteProvider>
      </BinsProvider>
    </UserProvider>
  );
}
