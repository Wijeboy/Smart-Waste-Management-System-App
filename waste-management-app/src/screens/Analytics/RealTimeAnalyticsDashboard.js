/**
 * AnalyticsDashboardScreen
 * Comprehensive analytics dashboard with real data from backend
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');

const AnalyticsDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [wasteDistribution, setWasteDistribution] = useState(null);
  const [routePerformance, setRoutePerformance] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalyticsData();
    }, [])
  );

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [analytics, kpisData, trendsData, wasteData, performanceData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getKPIs(),
        apiService.getCollectionTrends('weekly'),
        apiService.getWasteDistribution(),
        apiService.getRoutePerformance()
      ]);

      setAnalyticsData(analytics.data);
      setKpis(kpisData.data);
      setTrends(trendsData.data);
      setWasteDistribution(wasteData.data);
      setRoutePerformance(performanceData.data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalyticsData();
  };

  const renderKPICard = (title, value, icon, color = COLORS.primaryDarkTeal, subtitle = '') => (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiTitle}>{title}</Text>
      </View>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderTrendCard = (title, data, color = COLORS.primaryDarkTeal) => {
    const hasData = data && data.length > 0 && data.some(item => item.collections > 0);
    const maxCollections = hasData ? Math.max(...data.map(d => d.collections)) : 1;
    
    return (
      <View style={styles.trendCard}>
        <Text style={styles.trendTitle}>{title}</Text>
        {hasData ? (
          <View style={styles.trendChart}>
            {data.map((item, index) => (
              <View key={index} style={styles.trendBar}>
                <View 
                  style={[
                    styles.trendBarFill, 
                    { 
                      height: `${(item.collections / maxCollections) * 100}%`,
                      backgroundColor: color
                    }
                  ]} 
                />
                <Text style={styles.trendLabel}>
                  {item.date ? item.date.split('-')[2] : item.week || item.month}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📊</Text>
            <Text style={styles.emptyStateText}>No collection data available yet</Text>
            <Text style={styles.emptyStateSubtext}>Data will appear once routes are completed</Text>
          </View>
        )}
      </View>
    );
  };

  const renderWasteDistributionCard = () => {
    const hasData = wasteDistribution && wasteDistribution.length > 0;
    
    return (
      <View style={styles.distributionCard}>
        <Text style={styles.distributionTitle}>Waste Distribution</Text>
        {hasData ? (
          <View style={styles.distributionChart}>
            {wasteDistribution.map((item, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionBar}>
                  <View 
                    style={[
                      styles.distributionBarFill, 
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }
                    ]} 
                  />
                </View>
                <View style={styles.distributionInfo}>
                  <Text style={styles.distributionType}>{item.type}</Text>
                  <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
                  <Text style={styles.distributionWeight}>{item.weight}kg</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🗑️</Text>
            <Text style={styles.emptyStateText}>No waste distribution data</Text>
            <Text style={styles.emptyStateSubtext}>Register bins and start collecting to see waste distribution</Text>
          </View>
        )}
      </View>
    );
  };

  const renderRoutePerformanceCard = () => {
    const hasData = routePerformance && routePerformance.length > 0;
    
    return (
      <View style={styles.performanceCard}>
        <Text style={styles.performanceTitle}>Top Performing Routes</Text>
        {hasData ? (
          <>
            {routePerformance.slice(0, 5).map((route, index) => (
              <View key={index} style={styles.performanceItem}>
                <View style={styles.performanceInfo}>
                  <Text style={styles.performanceRoute}>{route.routeName}</Text>
                  <Text style={styles.performanceCollector}>{route.collector}</Text>
                </View>
                <View style={styles.performanceMetrics}>
                  <Text style={styles.performanceEfficiency}>{route.efficiency}%</Text>
                  <Text style={styles.performanceSatisfaction}>⭐ {route.satisfaction}/5</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🚛</Text>
            <Text style={styles.emptyStateText}>No completed routes yet</Text>
            <Text style={styles.emptyStateSubtext}>Complete routes to see performance metrics</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
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
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Analytics Dashboard</Text>
            <Text style={styles.headerSubtitle}>Real-time insights and performance metrics</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* KPIs Section */}
        {kpis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
            <View style={styles.kpiGrid}>
              {renderKPICard('Total Users', kpis.totalUsers, '👥', '#3B82F6')}
              {renderKPICard('Total Routes', kpis.totalRoutes, '🚛', '#10B981')}
              {renderKPICard('Total Bins', kpis.totalBins, '🗑️', '#F59E0B')}
              {renderKPICard('Collections', kpis.totalCollections, '📊', '#8B5CF6')}
              {renderKPICard('Waste Collected', `${kpis.totalWasteCollected}kg`, '⚖️', '#EF4444')}
              {renderKPICard('Efficiency', `${kpis.collectionEfficiency}%`, '⚡', '#06B6D4')}
              {renderKPICard('Satisfaction', `${kpis.customerSatisfaction}/5`, '⭐', '#F97316')}
              {renderKPICard('Recycling Rate', `${kpis.recyclingRate}%`, '♻️', '#22C55E')}
            </View>
          </View>
        )}

        {/* Collection Trends */}
        {trends && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collection Trends (Weekly)</Text>
            {renderTrendCard('Collections Over Time', trends, '#3B82F6')}
          </View>
        )}

        {/* Waste Distribution */}
        {wasteDistribution && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Waste Distribution</Text>
            {renderWasteDistributionCard()}
          </View>
        )}

        {/* Route Performance */}
        {routePerformance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Performance</Text>
            {renderRoutePerformanceCard()}
          </View>
        )}

        {/* System Status */}
        {analyticsData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={styles.statusGrid}>
              <View style={styles.statusCard}>
                <Text style={styles.statusValue}>{analyticsData.userStats.active}</Text>
                <Text style={styles.statusLabel}>Active Users</Text>
              </View>
              <View style={styles.statusCard}>
                <Text style={styles.statusValue}>{analyticsData.routeStats.inProgressRoutes}</Text>
                <Text style={styles.statusLabel}>Active Routes</Text>
              </View>
              <View style={styles.statusCard}>
                <Text style={styles.statusValue}>{analyticsData.binStats.fullBins}</Text>
                <Text style={styles.statusLabel}>Full Bins</Text>
              </View>
              <View style={styles.statusCard}>
                <Text style={styles.statusValue}>{analyticsData.routeStats.unassignedRoutes}</Text>
                <Text style={styles.statusLabel}>Unassigned Routes</Text>
              </View>
            </View>
          </View>
        )}

        {/* Last Updated */}
        {analyticsData && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
            </Text>
          </View>
        )}
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: FONTS.weight.semiBold,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
  },
  kpiSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 16,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  trendBar: {
    flex: 1,
    alignItems: 'center',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  trendLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  distributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 16,
  },
  distributionChart: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  distributionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distributionType: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    minWidth: 60,
  },
  distributionPercentage: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 30,
  },
  distributionWeight: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 50,
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 16,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performanceInfo: {
    flex: 1,
  },
  performanceRoute: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  performanceCollector: {
    fontSize: 10,
    color: '#6B7280',
  },
  performanceMetrics: {
    alignItems: 'flex-end',
  },
  performanceEfficiency: {
    fontSize: 12,
    fontWeight: FONTS.weight.bold,
    color: '#10B981',
  },
  performanceSatisfaction: {
    fontSize: 10,
    color: '#6B7280',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
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
  statusValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default AnalyticsDashboardScreen;
