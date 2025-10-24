/**
 * RouteManagementScreen Component
 * Displays the route management interface for bin collection
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import PreRouteChecklistModal from '../../components/PreRouteChecklistModal';

/**
 * RouteManagementScreen
 * Main screen for managing bin collection routes
 * @returns {JSX.Element} The RouteManagementScreen component
 */
const RouteManagementScreen = ({ navigation }) => {
  const { routes, fetchMyRoutes, loading, startRoute } = useRoute();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [filterTab, setFilterTab] = useState('all');
  const [todayRoute, setTodayRoute] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPreRouteChecklist, setShowPreRouteChecklist] = useState(false);
  const [checklistLoading, setChecklistLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load today's assigned route
  useEffect(() => {
    loadTodayRoute();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTodayRoute();
    }, [])
  );

  const loadTodayRoute = async () => {
    await fetchMyRoutes();
  };

  // Filter routes to get today's route
  useEffect(() => {
    if (routes && routes.length > 0) {
      const today = getTodayDate();
      const route = routes.find(r => {
        // Get route date in local timezone
        const routeDateObj = new Date(r.scheduledDate);
        const routeYear = routeDateObj.getFullYear();
        const routeMonth = String(routeDateObj.getMonth() + 1).padStart(2, '0');
        const routeDay = String(routeDateObj.getDate()).padStart(2, '0');
        const routeDate = `${routeYear}-${routeMonth}-${routeDay}`;
        
        return routeDate === today && (r.status === 'scheduled' || r.status === 'in-progress');
      });
      setTodayRoute(route || null);
    } else {
      setTodayRoute(null);
    }
  }, [routes]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodayRoute();
    setRefreshing(false);
  };

  const handleBinPress = (bin) => {
    // Navigate to bin details or collection screen
    console.log('Bin pressed:', bin);
  };

  const handleStartRoute = () => {
    if (todayRoute) {
      // Show the pre-route checklist modal
      setShowPreRouteChecklist(true);
    }
  };

  /**
   * Handle pre-route checklist completion
   * Start the route with the checklist data, then navigate to ActiveRoute
   */
  const handleChecklistComplete = async (checklistData) => {
    if (!todayRoute) return;

    try {
      setChecklistLoading(true);
      const result = await startRoute(todayRoute._id, checklistData);
      
      if (result.success) {
        setShowPreRouteChecklist(false);
        Alert.alert('Success', 'Route started successfully!', [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('ActiveRoute', { routeId: todayRoute._id }),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to start route');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start route');
    } finally {
      setChecklistLoading(false);
    }
  };

  const getStats = () => {
    if (!todayRoute || !todayRoute.bins) {
      return { total: 0, collected: 0, pending: 0, skipped: 0 };
    }
    return {
      total: todayRoute.bins.length,
      collected: todayRoute.bins.filter(b => b.status === 'collected').length,
      pending: todayRoute.bins.filter(b => b.status === 'pending').length,
      skipped: todayRoute.bins.filter(b => b.status === 'skipped').length,
    };
  };

  const getFilteredBins = () => {
    if (!todayRoute || !todayRoute.bins) return [];
    
    if (filterTab === 'all') return todayRoute.bins;
    return todayRoute.bins.filter(b => b.status === filterTab);
  };

  const stats = getStats();
  const filteredBins = getFilteredBins();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation?.navigate('Dashboard');
    } else if (tab === 'reports') {
      navigation?.navigate('Reports');
    } else if (tab === 'profile') {
      navigation?.navigate('Profile');
    }
  };

  const renderBinItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.binCard}
      onPress={() => handleBinPress(item)}
    >
      <View style={styles.binHeader}>
        <Text style={styles.binOrder}>#{item.order}</Text>
        <View style={[
          styles.binStatusBadge,
          item.status === 'collected' && styles.statusCollected,
          item.status === 'pending' && styles.statusPending,
          item.status === 'skipped' && styles.statusSkipped,
        ]}>
          <Text style={styles.binStatusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.binId}>{item.bin?.binId || 'N/A'}</Text>
      <Text style={styles.binLocation}>{item.bin?.location || 'Unknown location'}</Text>
      <View style={styles.binFooter}>
        <Text style={styles.binZone}>📍 {item.bin?.zone || 'N/A'}</Text>
        <Text style={styles.binType}>{item.bin?.binType || 'General'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !todayRoute) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading route...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Today's Route</Text>
          {todayRoute && (
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{todayRoute.routeName}</Text>
              <Text style={styles.routeTime}>🕐 {todayRoute.scheduledTime}</Text>
            </View>
          )}
        </View>

        {!todayRoute ? (
          <View style={styles.emptyRouteContainer}>
            <Text style={styles.emptyRouteIcon}>🚛</Text>
            <Text style={styles.emptyRouteText}>No route assigned for today</Text>
            <Text style={styles.emptyRouteSubtext}>
              Check back tomorrow or contact your admin
            </Text>
          </View>
        ) : (
          <>
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Bins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.collected}</Text>
                <Text style={styles.statLabel}>Collected</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            {/* Start Route Button */}
            {todayRoute.status === 'scheduled' && (
              <TouchableOpacity style={styles.startButton} onPress={handleStartRoute}>
                <Text style={styles.startButtonText}>Start Route →</Text>
              </TouchableOpacity>
            )}

            {todayRoute.status === 'in-progress' && (
              <TouchableOpacity style={styles.continueButton} onPress={handleStartRoute}>
                <Text style={styles.continueButtonText}>Continue Route →</Text>
              </TouchableOpacity>
            )}

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterTab, filterTab === 'all' && styles.filterTabActive]}
                onPress={() => setFilterTab('all')}
              >
                <Text style={[styles.filterTabText, filterTab === 'all' && styles.filterTabTextActive]}>
                  All ({stats.total})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filterTab === 'pending' && styles.filterTabActive]}
                onPress={() => setFilterTab('pending')}
              >
                <Text style={[styles.filterTabText, filterTab === 'pending' && styles.filterTabTextActive]}>
                  Pending ({stats.pending})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filterTab === 'collected' && styles.filterTabActive]}
                onPress={() => setFilterTab('collected')}
              >
                <Text style={[styles.filterTabText, filterTab === 'collected' && styles.filterTabTextActive]}>
                  Collected ({stats.collected})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bins List */}
            <FlatList
              data={filteredBins}
              renderItem={renderBinItem}
              keyExtractor={(item) => item._id || item.bin?._id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📦</Text>
                  <Text style={styles.emptyStateText}>No bins in this category</Text>
                </View>
              }
            />
          </>
        )}
      </ScrollView>

      {/* Pre-Route Checklist Modal */}
      <PreRouteChecklistModal
        visible={showPreRouteChecklist}
        onComplete={handleChecklistComplete}
        loading={checklistLoading}
        routeName={todayRoute?.routeName}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
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
  headerCard: {
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  routeInfo: {
    marginTop: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  routeTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  emptyRouteContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyRouteIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyRouteText: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyRouteSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  startButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: COLORS.headerTeal,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: COLORS.textPrimary,
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  binOrder: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  binStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCollected: {
    backgroundColor: '#D1FAE5',
  },
  statusSkipped: {
    backgroundColor: '#FEE2E2',
  },
  binStatusText: {
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  binId: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  binLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  binFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  binZone: {
    fontSize: 12,
    color: '#6B7280',
  },
  binType: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
  },
});

export default RouteManagementScreen;
