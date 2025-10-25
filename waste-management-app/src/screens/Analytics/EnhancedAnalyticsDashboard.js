/**
 * Enhanced Analytics Dashboard
 * Professional analytics dashboard with interactive charts and comprehensive reports
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
const CHART_WIDTH = width - 48;

const EnhancedAnalyticsDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  
  // Data states
  const [analyticsData, setAnalyticsData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [wasteDistribution, setWasteDistribution] = useState(null);
  const [routePerformance, setRoutePerformance] = useState(null);
  const [binAnalytics, setBinAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [zoneAnalytics, setZoneAnalytics] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  useFocusEffect(
    useCallback(() => {
      loadAnalyticsData();
    }, [selectedPeriod])
  );

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [analytics, kpisData, trendsData, wasteData, performanceData, binData, userData, zoneData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getKPIs(),
        apiService.getCollectionTrends(selectedPeriod),
        apiService.getWasteDistribution(),
        apiService.getRoutePerformance(),
        apiService.getBinAnalytics(),
        apiService.getUserAnalytics(),
        apiService.getZoneAnalytics()
      ]);

      setAnalyticsData(analytics.data);
      setKpis(kpisData.data);
      setTrends(trendsData.data);
      setWasteDistribution(wasteData.data);
      setRoutePerformance(performanceData.data);
      setBinAnalytics(binData.data);
      setUserAnalytics(userData.data);
      setZoneAnalytics(zoneData.data);
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

  // ============================================
  // RENDER COMPONENTS
  // ============================================

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time insights and performance metrics</Text>
      </View>
      <TouchableOpacity onPress={loadAnalyticsData} style={styles.refreshButton}>
        <Text style={styles.refreshIcon}>🔄</Text>
      </TouchableOpacity>
    </View>
  );

  const renderKPICards = () => {
    if (!kpis) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        
        <View style={styles.kpiGrid}>
          {renderKPICard('Total Users', kpis.totalUsers.toString(), '👥', '#3B82F6')}
          {renderKPICard('Total Routes', kpis.totalRoutes.toString(), '🚛', '#10B981')}
          {renderKPICard('Total Bins', kpis.totalBins.toString(), '🗑️', '#F59E0B')}
          {renderKPICard('Collections', kpis.totalCollections.toString(), '📊', '#8B5CF6')}
        </View>

        <View style={styles.kpiGrid}>
          {renderKPICard('Waste Collected', `${kpis.totalWasteCollected}kg`, '⚖️', '#EF4444', 'Total weight')}
          {renderKPICard('Efficiency', `${kpis.collectionEfficiency}%`, '⚡', '#06B6D4', 'Collection rate')}
          {renderKPICard('Recycling Rate', `${kpis.recyclingRate}%`, '♻️', '#10B981', 'Sustainability')}
          {renderKPICard('Satisfaction', `${kpis.customerSatisfaction}/5`, '⭐', '#F59E0B', 'User rating')}
        </View>
      </View>
    );
  };

  const renderKPICard = (title, value, icon, color, subtitle = '') => (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiTitle}>{title}</Text>
      </View>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {['daily', 'weekly', 'monthly'].map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCollectionTrends = () => {
    if (!trends || trends.length === 0) return null;

    const hasData = trends.some(item => item.collections > 0 || item.wasteCollected > 0);
    const maxCollections = hasData ? Math.max(...trends.map(d => d.collections || 0)) : 1;
    const maxWaste = hasData ? Math.max(...trends.map(d => d.wasteCollected || 0)) : 1;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Collection Trends</Text>
          {renderPeriodSelector()}
        </View>

        {hasData ? (
          <View style={styles.chartContainer}>
            {/* Bar Chart for Collections */}
            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Collections Over Time</Text>
              <View style={styles.barChart}>
                {trends.map((item, index) => {
                  const height = Math.max((item.collections / maxCollections) * 160, item.collections > 0 ? 30 : 0);
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar,
                            { 
                              height: height,
                              backgroundColor: '#3B82F6'
                            }
                          ]}
                        >
                          {item.collections > 0 && (
                            <Text style={styles.barValue}>{item.collections}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.barLabel}>{item.week || item.day || item.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Bar Chart for Waste */}
            <View style={[styles.chart, { marginTop: 24 }]}>
              <Text style={styles.chartTitle}>Waste Collected (kg)</Text>
              <View style={styles.barChart}>
                {trends.map((item, index) => {
                  const height = Math.max((item.wasteCollected / maxWaste) * 160, item.wasteCollected > 0 ? 30 : 0);
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar,
                            { 
                              height: height,
                              backgroundColor: '#10B981'
                            }
                          ]}
                        >
                          {item.wasteCollected > 0 && (
                            <Text style={styles.barValue}>{item.wasteCollected}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.barLabel}>{item.week || item.day || item.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📊</Text>
            <Text style={styles.emptyStateText}>No collection data available yet</Text>
            <Text style={styles.emptyStateSubtext}>Data will appear after routes are completed</Text>
          </View>
        )}
      </View>
    );
  };

  const renderWasteDistributionPieChart = () => {
    if (!wasteDistribution || wasteDistribution.length === 0) return null;

    const hasData = wasteDistribution.some(item => item.weight > 0);
    const totalWeight = wasteDistribution.reduce((sum, item) => sum + item.weight, 0);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Waste Distribution</Text>
        
        {hasData ? (
          <View style={styles.chartContainer}>
            {/* Pie Chart Representation */}
            <View style={styles.pieChartContainer}>
              {wasteDistribution.map((item, index) => {
                if (item.weight === 0) return null;
                
                return (
                  <View key={index} style={styles.pieSegment}>
                    <Text style={styles.pieLabelTextTop}>{item.type}</Text>
                    <View 
                      style={[
                        styles.pieColorBox,
                        { 
                          backgroundColor: item.color,
                          width: (item.percentage / 100) * CHART_WIDTH * 0.85
                        }
                      ]}
                    >
                      <View style={styles.pieBarContent}>
                        <Text style={styles.pieBarPercentage}>{item.percentage}%</Text>
                        <Text style={styles.pieBarWeight}>{item.weight}kg</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {wasteDistribution.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>
                    {item.type}: {item.weight}kg ({item.percentage}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🗑️</Text>
            <Text style={styles.emptyStateText}>No waste distribution data</Text>
          </View>
        )}
      </View>
    );
  };

  const renderRoutePerformance = () => {
    if (!routePerformance || routePerformance.length === 0) return null;

    const hasData = routePerformance.some(item => item.wasteCollected > 0);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route Performance</Text>
        
        {hasData ? (
          <View style={styles.performanceContainer}>
            {routePerformance.map((route, index) => (
              <View key={index} style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceCollector}>👤 {route.collector}</Text>
                  <Text style={styles.performanceBins}>🗑️ {route.binsCollected} bins</Text>
                </View>

                <View style={styles.performanceStats}>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatLabel}>Waste</Text>
                    <Text style={styles.performanceStatValue}>{route.wasteCollected}kg</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatLabel}>Efficiency</Text>
                    <Text style={[styles.performanceStatValue, { color: '#10B981' }]}>
                      {route.efficiency}%
                    </Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatLabel}>Time</Text>
                    <Text style={styles.performanceStatValue}>{route.completionTime}h</Text>
                  </View>
                  <View style={styles.performanceStat}>
                    <Text style={styles.performanceStatLabel}>Rating</Text>
                    <Text style={[styles.performanceStatValue, { color: '#F59E0B' }]}>
                      {route.satisfaction}/5
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill,
                        { width: `${route.efficiency}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🚛</Text>
            <Text style={styles.emptyStateText}>No route performance data</Text>
          </View>
        )}
      </View>
    );
  };

  const renderInsights = () => {
    if (!kpis) return null;

    const insights = [];
    
    if (kpis.recyclingRate > 70) {
      insights.push({
        icon: '🌟',
        title: 'Excellent Recycling!',
        description: `${kpis.recyclingRate}% recycling rate is outstanding`,
        color: '#10B981'
      });
    }

    if (kpis.collectionEfficiency === 100) {
      insights.push({
        icon: '⚡',
        title: 'Perfect Efficiency',
        description: 'All scheduled collections completed on time',
        color: '#3B82F6'
      });
    }

    if (kpis.fullBins > 0) {
      insights.push({
        icon: '⚠️',
        title: 'Attention Needed',
        description: `${kpis.fullBins} bins are at full capacity`,
        color: '#EF4444'
      });
    }

    if (insights.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Smart Insights</Text>
        <View style={styles.insightsContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={[styles.insightCard, { borderLeftColor: insight.color }]}>
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ============================================
  // BIN ANALYTICS RENDER
  // ============================================

  const renderBinAnalytics = () => {
    if (!binAnalytics) return null;

    const { statusDistribution, typeDistribution, fillLevels, summary } = binAnalytics;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Bin Analytics</Text>
        
        {/* Bin Summary Cards */}
        <View style={styles.binSummaryGrid}>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Total Bins</Text>
            <Text style={[styles.miniKpiValue, { color: '#3B82F6' }]}>{summary.totalBins}</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Avg Fill Level</Text>
            <Text style={[styles.miniKpiValue, { color: '#10B981' }]}>{summary.averageFillLevel}%</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Critical Bins</Text>
            <Text style={[styles.miniKpiValue, { color: '#EF4444' }]}>{summary.criticalBins}</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Utilization</Text>
            <Text style={[styles.miniKpiValue, { color: '#F59E0B' }]}>{summary.capacityUtilization}%</Text>
          </View>
        </View>

        {/* Bin Status Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>Bin Status Distribution</Text>
          <View style={styles.pieChartContainer}>
            {statusDistribution.map((item, index) => (
              <View key={index} style={styles.pieSegment}>
                <Text style={styles.pieLabelTextTop}>{item.status} ({item.count})</Text>
                <View 
                  style={[
                    styles.pieColorBox,
                    { 
                      backgroundColor: item.color,
                      width: (item.percentage / 100) * CHART_WIDTH * 0.85
                    }
                  ]}
                >
                  <View style={styles.pieBarContent}>
                    <Text style={styles.pieBarPercentage}>{item.percentage}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Fill Level Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>Fill Level Distribution</Text>
          <View style={styles.pieChartContainer}>
            {fillLevels.map((item, index) => {
              if (item.count === 0) return null;
              return (
                <View key={index} style={styles.pieSegment}>
                  <Text style={styles.pieLabelTextTop}>{item.level} ({item.count})</Text>
                  <View 
                    style={[
                      styles.pieColorBox,
                      { 
                        backgroundColor: item.color,
                        width: (item.percentage / 100) * CHART_WIDTH * 0.85
                      }
                    ]}
                  >
                    <View style={styles.pieBarContent}>
                      <Text style={styles.pieBarPercentage}>{item.percentage}%</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  // ============================================
  // USER ANALYTICS RENDER
  // ============================================

  const renderUserAnalytics = () => {
    if (!userAnalytics) return null;

    const { roleDistribution, activityStatus, summary } = userAnalytics;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 User Analytics</Text>
        
        {/* User Summary */}
        <View style={styles.binSummaryGrid}>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Total Users</Text>
            <Text style={[styles.miniKpiValue, { color: '#3B82F6' }]}>{summary.totalUsers}</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Active Users</Text>
            <Text style={[styles.miniKpiValue, { color: '#10B981' }]}>{summary.activeUsers}</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Collectors</Text>
            <Text style={[styles.miniKpiValue, { color: '#F59E0B' }]}>{summary.totalCollectors}</Text>
          </View>
          <View style={styles.miniKpiCard}>
            <Text style={styles.miniKpiLabel}>Admins</Text>
            <Text style={[styles.miniKpiValue, { color: '#EF4444' }]}>{summary.totalAdmins}</Text>
          </View>
        </View>

        {/* Role Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>User Role Distribution</Text>
          <View style={styles.pieChartContainer}>
            {roleDistribution.map((item, index) => (
              <View key={index} style={styles.pieSegment}>
                <Text style={styles.pieLabelTextTop}>{item.role} ({item.count})</Text>
                <View 
                  style={[
                    styles.pieColorBox,
                    { 
                      backgroundColor: item.color,
                      width: (item.percentage / 100) * CHART_WIDTH * 0.85
                    }
                  ]}
                >
                  <View style={styles.pieBarContent}>
                    <Text style={styles.pieBarPercentage}>{item.percentage}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Status */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>User Activity Status</Text>
          <View style={styles.pieChartContainer}>
            {activityStatus.map((item, index) => (
              <View key={index} style={styles.pieSegment}>
                <Text style={styles.pieLabelTextTop}>{item.status} ({item.count})</Text>
                <View 
                  style={[
                    styles.pieColorBox,
                    { 
                      backgroundColor: item.color,
                      width: (item.percentage / 100) * CHART_WIDTH * 0.85
                    }
                  ]}
                >
                  <View style={styles.pieBarContent}>
                    <Text style={styles.pieBarPercentage}>{item.percentage}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // ============================================
  // ZONE ANALYTICS RENDER
  // ============================================

  const renderZoneAnalytics = () => {
    if (!zoneAnalytics || zoneAnalytics.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗺️ Zone Analytics</Text>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>Bins by Zone</Text>
          <View style={styles.pieChartContainer}>
            {zoneAnalytics.map((zone, index) => (
              <View key={index} style={styles.pieSegment}>
                <Text style={styles.pieLabelTextTop}>
                  {zone.zone} ({zone.binCount} bins)
                </Text>
                <View 
                  style={[
                    styles.pieColorBox,
                    { 
                      backgroundColor: zone.color,
                      width: (zone.percentage / 100) * CHART_WIDTH * 0.85
                    }
                  ]}
                >
                  <View style={styles.pieBarContent}>
                    <Text style={styles.pieBarPercentage}>{zone.percentage}%</Text>
                    <Text style={styles.pieBarWeight}>Avg: {zone.averageFillLevel}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Zone Details Cards */}
        <View style={styles.zoneCardsContainer}>
          {zoneAnalytics.slice(0, 3).map((zone, index) => (
            <View key={index} style={styles.zoneCard}>
              <View style={[styles.zoneColorIndicator, { backgroundColor: zone.color }]} />
              <View style={styles.zoneCardContent}>
                <Text style={styles.zoneCardTitle}>{zone.zone}</Text>
                <View style={styles.zoneCardStats}>
                  <Text style={styles.zoneCardStat}>🗑️ {zone.binCount} bins</Text>
                  <Text style={styles.zoneCardStat}>📊 {zone.averageFillLevel}% avg fill</Text>
                  <Text style={styles.zoneCardStat}>⚠️ {zone.fullBins} full</Text>
                  <Text style={styles.zoneCardStat}>⚖️ {zone.totalWeight}kg</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  if (loading && !analyticsData) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primaryDarkTeal}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderKPICards()}
        {renderInsights()}
        {renderCollectionTrends()}
        {renderWasteDistributionPieChart()}
        {renderBinAnalytics()}
        {renderUserAnalytics()}
        {renderZoneAnalytics()}
        {renderRoutePerformance()}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 20,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
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
    marginBottom: 4,
  },
  kpiSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primaryDarkTeal,
  },
  periodButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: FONTS.weight.semiBold,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 220,
    paddingTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barWrapper: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    minHeight: 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  barValue: {
    fontSize: 13,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  barLabel: {
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginTop: 12,
    textAlign: 'center',
  },
  pieChartContainer: {
    marginBottom: 20,
  },
  pieSegment: {
    marginBottom: 20,
  },
  pieColorBox: {
    height: 60,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  pieLabelTextTop: {
    fontSize: 15,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 8,
  },
  pieBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieBarPercentage: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
    marginRight: 16,
  },
  pieBarWeight: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  pieLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pieLabelText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
  },
  pieStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  piePercentage: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginRight: 12,
  },
  pieWeight: {
    fontSize: 14,
    color: '#6B7280',
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#6B7280',
  },
  performanceContainer: {
    gap: 12,
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
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceCollector: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  performanceBins: {
    fontSize: 13,
    color: '#6B7280',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceStatLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  performanceStatValue: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 3,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
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
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // NEW STYLES
  binSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  miniKpiCard: {
    width: '48%',
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
  miniKpiLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  miniKpiValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
  },
  chartLabel: {
    fontSize: 15,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 12,
  },
  zoneCardsContainer: {
    marginTop: 16,
    gap: 12,
  },
  zoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneColorIndicator: {
    width: 6,
    height: '100%',
    borderRadius: 3,
    marginRight: 12,
  },
  zoneCardContent: {
    flex: 1,
  },
  zoneCardTitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 8,
  },
  zoneCardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  zoneCardStat: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default EnhancedAnalyticsDashboard;

