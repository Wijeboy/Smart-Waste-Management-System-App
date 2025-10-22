/**
 * RouteManagementScreen
 * Admin screen for managing routes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import RouteCard from '../../components/RouteCard';
import { useRoute } from '../../context/RouteContext';

const RouteManagementScreen = ({ navigation }) => {
  const { routes, loading, error, fetchRoutes, deleteRoute, fetchRouteStats } = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchRoutes();
    const statsResult = await fetchRouteStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getFilteredRoutes = () => {
    if (selectedTab === 'all') return routes;
    return routes.filter(route => route.status === selectedTab);
  };

  const handleRoutePress = (route) => {
    navigation.navigate('RouteDetail', { routeId: route._id });
  };

  const handleCreateRoute = () => {
    navigation.navigate('CreateRoute');
  };

  const handleEditRoute = (route) => {
    navigation.navigate('EditRoute', { routeId: route._id });
  };

  const handleDeleteRoute = (route) => {
    Alert.alert(
      'Delete Route',
      `Are you sure you want to delete "${route.routeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRoute(route._id);
            if (result.success) {
              Alert.alert('Success', 'Route deleted successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to delete route');
            }
          },
        },
      ]
    );
  };

  const renderTab = (label, value) => {
    const isSelected = selectedTab === value;
    const count = value === 'all' ? routes.length : routes.filter(r => r.status === value).length;
    
    return (
      <TouchableOpacity
        style={[styles.tab, isSelected && styles.tabSelected]}
        onPress={() => setSelectedTab(value)}
      >
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {label}
        </Text>
        <View style={[styles.tabBadge, isSelected && styles.tabBadgeSelected]}>
          <Text style={[styles.tabBadgeText, isSelected && styles.tabBadgeTextSelected]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Route Management</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRoute}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalRoutes}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.scheduledRoutes}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.inProgressRoutes}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedRoutes}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTab('All', 'all')}
        {renderTab('Scheduled', 'scheduled')}
        {renderTab('In Progress', 'in-progress')}
        {renderTab('Completed', 'completed')}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🚛</Text>
      <Text style={styles.emptyStateText}>No routes found</Text>
      <Text style={styles.emptyStateSubtext}>
        {selectedTab === 'all'
          ? 'Create your first route to get started'
          : `No ${selectedTab} routes`}
      </Text>
      {selectedTab === 'all' && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={handleCreateRoute}
        >
          <Text style={styles.emptyStateButtonText}>Create Route</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const filteredRoutes = getFilteredRoutes();

  if (loading && !refreshing && routes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading routes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            onPress={() => handleRoutePress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primaryDarkTeal]}
          />
        }
      />
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
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  createButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabSelected: {
    backgroundColor: COLORS.primaryDarkTeal,
  },
  tabText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
  },
  tabTextSelected: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
    color: '#6B7280',
  },
  tabBadgeTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
  },
});

export default RouteManagementScreen;
