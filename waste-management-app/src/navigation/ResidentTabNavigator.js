/**
 * Resident Tab Navigator
 * Bottom tab navigation for resident screens
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

// Import screens
import ResidentHomeScreen from '../screens/Resident/ResidentHomeScreen';
import CollectionHistoryScreen from '../screens/Resident/CollectionHistoryScreen';
import PaymentScreen from '../screens/Resident/PaymentScreen';
import SettingsScreen from '../screens/Resident/SettingsScreen';

const Tab = createBottomTabNavigator();

const ResidentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryDarkTeal,
        tabBarInactiveTintColor: COLORS.iconGray,
        tabBarStyle: {
          backgroundColor: COLORS.lightCard,
          borderTopWidth: 1,
          borderTopColor: COLORS.progressBarBg,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONTS.size.small,
          fontWeight: FONTS.weight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ResidentHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '🏠' : '🏡'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={CollectionHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '📋' : '📄'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '💳' : '💰'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '⚙️' : '🔧'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ResidentTabNavigator;
