/**
 * Resident Tab Navigator
 * Bottom tab navigation for resident screens
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

// Import screens
import ResidentHomeScreen from '../screens/Resident/ResidentHomeScreen';
import CollectionHistoryScreen from '../screens/Resident/CollectionHistoryScreen';
import PaymentScreen from '../screens/Resident/PaymentScreen';
import SettingsScreen from '../screens/Resident/SettingsScreen';

const Tab = createBottomTabNavigator();

// Custom Tab Icon Component
const TabIcon = ({ focused, icon, focusedIcon }) => (
  <View style={[
    styles.iconContainer,
    focused && styles.iconContainerFocused
  ]}>
    <Text style={[
      styles.icon,
      focused && styles.iconFocused
    ]}>
      {focused ? focusedIcon : icon}
    </Text>
  </View>
);

const ResidentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryDarkTeal,
        tabBarInactiveTintColor: COLORS.iconGray,
        tabBarStyle: {
          backgroundColor: COLORS.lightCard,
          borderTopWidth: 2,
          borderTopColor: COLORS.primaryDarkTeal + '20',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: FONTS.size.small,
          fontWeight: FONTS.weight.semiBold,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ResidentHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏡" focusedIcon="🏠" />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={CollectionHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📄" focusedIcon="📋" />
          ),
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="💰" focusedIcon="💳" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔧" focusedIcon="⚙️" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 12,
    marginTop: 4,
  },
  iconContainerFocused: {
    backgroundColor: COLORS.primaryDarkTeal + '15',
  },
  icon: {
    fontSize: 26,
  },
  iconFocused: {
    fontSize: 28,
  },
});

export default ResidentTabNavigator;
