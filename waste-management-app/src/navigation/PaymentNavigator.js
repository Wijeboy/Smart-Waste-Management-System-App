/**
 * PaymentNavigator
 * Navigation stack for the payment and rewards module
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import payment screens
import PaymentPageScreen from '../screens/Payments/PaymentPageScreen';
import CreditPointsScreen from '../screens/Payments/CreditPointsScreen';
import ApplyCreditScreen from '../screens/Payments/ApplyCreditScreen';

// Import components
import AddPaymentMethodModal from '../components/payments/AddPaymentMethodModal';

const Stack = createNativeStackNavigator();

/**
 * PaymentNavigator
 * Defines the navigation stack for payment-related screens
 * @returns {JSX.Element} The payment navigation stack
 */
const PaymentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PaymentPage"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#005257',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPageScreen}
        options={{
          title: 'Payment',
        }}
      />
      <Stack.Screen
        name="CreditPoints"
        component={CreditPointsScreen}
        options={{
          title: 'Credit Points',
        }}
      />
      <Stack.Screen
        name="ApplyCredit"
        component={ApplyCreditScreen}
        options={{
          title: 'Apply Credit Points',
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AddPaymentMethod"
          component={AddPaymentMethodScreen}
          options={{
            title: 'Add Payment Method',
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default PaymentNavigator;