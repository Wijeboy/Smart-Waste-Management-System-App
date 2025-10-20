/**
 * AppNavigator
 * Main navigation stack for the application
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/BinCollection/DashboardScreen';
import RouteManagementScreen from '../screens/BinCollection/RouteManagementScreen';
import ScanBinScreen from '../screens/BinCollection/ScanBinScreen';
import ReportsScreen from '../screens/BinCollection/ReportsScreen';
import ProfileScreen from '../screens/BinCollection/ProfileScreen';
import { COLORS, FONTS } from '../constants/theme';

// Import Analytics screens
import AnalyticsDashboard from '../screens/Analytics/AnalyticsDashboard';
import AnalyticsReportsScreen from '../screens/Analytics/ReportsScreen';
import KPIsScreen from '../screens/Analytics/KPIsScreen';

// Import other analytics-related screens
import DataCollectionScreen from '../screens/DataCollectionScreen';
import DataProcessingScreen from '../screens/DataProcessingScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import PerformanceMetricsScreen from '../screens/PerformanceMetricsScreen';
import AnalyticsReportScreen from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator
 * Defines the navigation stack with all app screens
 * @returns {JSX.Element} The navigation stack
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primaryDarkTeal,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: FONTS.weight.bold,
          fontSize: FONTS.size.subheading,
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RouteManagement"
        component={RouteManagementScreen}
        options={{
          title: 'Route Management',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ScanBin"
        component={ScanBinScreen}
        options={{
          title: 'Scan Bin',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AnalyticsDashboard"
        component={AnalyticsDashboard}
        options={{
          title: 'Analytics Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AnalyticsReports"
        component={AnalyticsReportsScreen}
        options={{
          title: 'Analytics Reports',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="KPIs"
        component={KPIsScreen}
        options={{
          title: 'Key Performance Indicators',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DataCollection"
        component={DataCollectionScreen}
        options={{
          title: 'Data Collection',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DataProcessing"
        component={DataProcessingScreen}
        options={{
          title: 'Data Processing',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          title: 'Analysis',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PerformanceMetrics"
        component={PerformanceMetricsScreen}
        options={{
          title: 'Performance Metrics',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AnalyticsReport"
        component={AnalyticsReportScreen}
        options={{
          title: 'Reports',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
