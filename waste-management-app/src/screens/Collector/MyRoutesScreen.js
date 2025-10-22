/**
 * MyRoutesScreen
 * Collector's view of assigned routes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import { useAuth } from '../../context/AuthContext';

const MyRoutesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { routes, loading, fetchMyRoutes } = useRoute();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    await fetchMyRoutes();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  };

  const getFilteredRoutes = () => {
    if (selectedFilter === 'all') return routes;
    return routes.filter(route => route.status === selectedFilter);
  };

  const handleRoutePress = (route) => {
    if (route.status === 'in-progress') {
      navigation.navigate('ActiveRoute', { routeId: route._id });
    } else {
      navigation.navigate('RouteDetail', { routeId: route._id });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#3B82F6';
      case 'in-progress':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderFilterChip = (label, value) => {
    const isSelected = selectedFilter === value;
    const count = value === 'all' 
      ? routes.length 
      : routes.filter(r => r.status === value).length;
    
    return (
      <TouchableOpacity
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => setSelectedFilter(value)}
      >
        <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
          {label}
        </Text>
        <View style={[styles.filterBadge, isSelected && styles.filterBadgeSelected]}>
          <Text style={[styles.filterBadgeText, isSelected && styles.filterBadgeTextSelected]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRouteCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const progress = item.progress || 0;
    const totalBins = item.totalBins || item.bins?.length || 0;
    const collectedBins = item.collectedBins || 0;

    return (
      <TouchableOpacity
        style={styles.routeCard}
        onPress={() => handleRoutePress(item)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.routeName}>{item.routeName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.dateTimeText}>
              {new Date(item.scheduledDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Text style={styles.icon}>🕐</Text>
            <Text style={styles.dateTimeText}>{item.scheduledTime}</Text>
          </View>
        </View>

        {/* Progress */}
        {item.status !== 'scheduled' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {collectedBins} / {totalBins} bins collected
              </Text>
              <Text style={styles.progressPercentage}>{progress}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress}%`, backgroundColor: statusColor },
                ]}
              />
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            {totalBins} {totalBins === 1 ? 'bin' : 'bins'}
          </Text>
          {item.status === 'scheduled' && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('ActiveRoute', { routeId: item._id });
              }}
            >
              <Text style={styles.startButtonText}>Start Route →</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in-progress' && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('ActiveRoute', { routeId: item._id });
              }}
            >
              <Text style={styles.continueButtonText}>Continue →</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>My Routes</Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterChip('All', 'all')}
        {renderFilterChip('Scheduled', 'scheduled')}
        {renderFilterChip('In Progress', 'in-progress')}
        {renderFilterChip('Completed', 'completed')}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🚛</Text>
      <Text style={styles.emptyStateText}>No routes assigned</Text>
      <Text style={styles.emptyStateSubtext}>
        {selectedFilter === 'all'
          ? 'You have no routes assigned yet'
          : `No ${selectedFilter} routes`}
      </Text>
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
        renderItem={renderRouteCard}
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
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  filterChipSelected: {
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  filterChipTextSelected: {
    color: COLORS.primaryDarkTeal,
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeSelected: {
    backgroundColor: COLORS.primaryDarkTeal,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  filterBadgeTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeName: {
    flex: 1,
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  startButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
  },
  continueButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
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
  },
});

export default MyRoutesScreen;
