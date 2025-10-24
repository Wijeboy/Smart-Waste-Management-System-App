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
import { useAuth } from '../context/AuthContext';

// Import Analytics screens
import AnalyticsDashboard from '../screens/Analytics/AnalyticsDashboard';
import AnalyticsReportsScreen from '../screens/Analytics/ReportsScreen';
import KPIsScreen from '../screens/Analytics/KPIsScreen';
import RealTimeAnalyticsDashboard from '../screens/Analytics/RealTimeAnalyticsDashboard';
import EnhancedAnalyticsDashboard from '../screens/Analytics/EnhancedAnalyticsDashboard';

// Import other analytics-related screens
import DataCollectionScreen from '../screens/DataCollectionScreen';
import DataProcessingScreen from '../screens/DataProcessingScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import PerformanceMetricsScreen from '../screens/PerformanceMetricsScreen';
import AnalyticsReportScreen from '../screens/ReportsScreen';

// Import Admin screens
import UserManagementScreen from '../screens/Admin/UserManagementScreen';
import UserDetailScreen from '../screens/Admin/UserDetailScreen';
import AdminRouteManagementScreen from '../screens/Admin/RouteManagementScreen';
import RouteDetailScreen from '../screens/Admin/RouteDetailScreen';
import CreateRouteScreen from '../screens/Admin/CreateRouteScreen';
import EditRouteScreen from '../screens/Admin/EditRouteScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import BinManagementScreen from '../screens/Admin/BinManagementScreen';

// Import Collector screens
import MyRoutesScreen from '../screens/Collector/MyRoutesScreen';
import ActiveRouteScreen from '../screens/Collector/ActiveRouteScreen';

// Import Resident screens
import ResidentTabNavigator from './ResidentTabNavigator';
import CreditPointsScreen from '../screens/Resident/CreditPointsScreen';
import ApplyPointsScreen from '../screens/Resident/ApplyPointsScreen';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator
 * Defines the navigation stack with all app screens
 * @returns {JSX.Element} The navigation stack
 */
const AppNavigator = () => {
  const { user } = useAuth();
  
  // Determine initial route based on user role
  const getInitialRoute = () => {
    if (user?.role === 'admin') {
      return 'AdminDashboard';
    } else if (user?.role === 'collector') {
      return 'Dashboard'; // Collectors go to Dashboard with bottom nav
    } else if (user?.role === 'resident') {
      return 'ResidentDashboard'; // Residents go to Resident Dashboard
    }
    return 'Dashboard';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
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
        name="RealTimeAnalytics"
        component={RealTimeAnalyticsDashboard}
        options={{
          title: 'Real-Time Analytics',
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

      {/* Admin Screens */}
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Admin Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'User Management',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{
          title: 'User Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminRouteManagement"
        component={AdminRouteManagementScreen}
        options={{
          title: 'Route Management',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{
          title: 'Route Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateRoute"
        component={CreateRouteScreen}
        options={{
          title: 'Create Route',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditRoute"
        component={EditRouteScreen}
        options={{
          title: 'Edit Route',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BinManagement"
        component={BinManagementScreen}
        options={{
          title: 'Bin Management',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EnhancedAnalytics"
        component={EnhancedAnalyticsDashboard}
        options={{
          title: 'Enhanced Analytics',
          headerShown: false,
        }}
      />

      {/* Collector Screens */}
      <Stack.Screen
        name="MyRoutes"
        component={MyRoutesScreen}
        options={{
          title: 'My Routes',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ActiveRoute"
        component={ActiveRouteScreen}
        options={{
          title: 'Active Route',
          headerShown: false,
        }}
      />

      {/* Resident Screens */}
      <Stack.Screen
        name="ResidentDashboard"
        component={ResidentTabNavigator}
        options={{
          title: 'My Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreditPoints"
        component={CreditPointsScreen}
        options={{
          title: 'Credit Points',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplyPoints"
        component={ApplyPointsScreen}
        options={{
          title: 'Apply Points',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
