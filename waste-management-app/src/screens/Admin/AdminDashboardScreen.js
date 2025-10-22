/**
 * AdminDashboardScreen
 * Enhanced dashboard for admin users with user and route statistics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '../../context/RouteContext';
import { useBins } from '../../context/BinsContext';
import apiService from '../../services/api';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { fetchRouteStats } = useRoute();
  const { bins, stats: binStats } = useBins();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [routeStats, setRouteStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics
      const usersResponse = await apiService.getAllUsers();
      setUserStats(usersResponse.data.stats);
      
      // Fetch route statistics
      const routeStatsResult = await fetchRouteStats();
      if (routeStatsResult.success) {
        setRouteStats(routeStatsResult.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderQuickAction = (icon, label, onPress, color = COLORS.primaryDarkTeal) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primaryDarkTeal]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Admin</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickAction('👥', 'Manage Users', () => navigation.navigate('UserManagement'))}
            {renderQuickAction('🚛', 'Manage Routes', () => navigation.navigate('RouteManagement'))}
            {renderQuickAction('🗑️', 'View Bins', () => navigation.navigate('BinManagement'))}
            {renderQuickAction('📊', 'Analytics', () => navigation.navigate('Analytics'))}
          </View>
        </View>

        {/* User Statistics */}
        {userStats && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>User Statistics</Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserManagement')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{userStats.total}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>
                  {userStats.active}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#3B82F6' }]}>
                  {userStats.collectors}
                </Text>
                <Text style={styles.statLabel}>Collectors</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>
                  {userStats.admins}
                </Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>
            </View>
          </View>
        )}

        {/* Route Statistics */}
        {routeStats && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Route Statistics</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RouteManagement')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{routeStats.totalRoutes}</Text>
                <Text style={styles.statLabel}>Total Routes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#3B82F6' }]}>
                  {routeStats.scheduledRoutes}
                </Text>
                <Text style={styles.statLabel}>Scheduled</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {routeStats.inProgressRoutes}
                </Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>
                  {routeStats.completedRoutes}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
            
            {routeStats.unassignedRoutes > 0 && (
              <View style={styles.alertCard}>
                <Text style={styles.alertIcon}>⚠️</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Unassigned Routes</Text>
                  <Text style={styles.alertText}>
                    {routeStats.unassignedRoutes} scheduled {routeStats.unassignedRoutes === 1 ? 'route' : 'routes'} need collector assignment
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={() => navigation.navigate('RouteManagement')}
                >
                  <Text style={styles.alertButtonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Bin Statistics */}
        {binStats && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bin Statistics</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BinManagement')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{binStats.totalBins}</Text>
                <Text style={styles.statLabel}>Total Bins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>
                  {binStats.activeBins}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>
                  {binStats.fullBins}
                </Text>
                <Text style={styles.statLabel}>Full</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {binStats.maintenanceBins}
                </Text>
                <Text style={styles.statLabel}>Maintenance</Text>
              </View>
            </View>
          </View>
        )}

        {/* System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Total Users</Text>
              <Text style={styles.overviewValue}>{userStats?.total || 0}</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Total Routes</Text>
              <Text style={styles.overviewValue}>{routeStats?.totalRoutes || 0}</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Total Bins</Text>
              <Text style={styles.overviewValue}>{binStats?.totalBins || 0}</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Active Collectors</Text>
              <Text style={styles.overviewValue}>{userStats?.collectors || 0}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.bold,
    color: '#92400E',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#92400E',
  },
  alertButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  overviewDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default AdminDashboardScreen;
