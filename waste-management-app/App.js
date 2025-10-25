/**
 * App Component
 * Root component of the Waste Management Application
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { RouteProvider } from './src/context/RouteContext';
import { BinsProvider } from './src/context/BinsContext';
import { UserProvider } from './src/context/UserContext';
import { AuthProvider } from './src/context/AuthContext';

// Stripe publishable key (test mode)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SFr23ACfj16ELp7g2H9jJYn8m1cCz3XhZ7VKqQe0K5qJm8Oe6Zv7Fz3Yy1rJ4wL5nH6tG8xK9sP2wQ3vR4uS5dM00ABCdefgh';

/**
 * App
 * Main application component with navigation and context providers
 * @returns {JSX.Element} The root App component
 */
export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <UserProvider>
          <BinsProvider>
            <RouteProvider>
              <NavigationContainer>
                <RootNavigator />
                <StatusBar style="light" />
              </NavigationContainer>
            </RouteProvider>
          </BinsProvider>
        </UserProvider>
      </AuthProvider>
    </StripeProvider>
  );
}
