/**
 * DashboardScreen Component
 * Main dashboard displaying collection statistics and overview
 * Redesigned to match screenshot with teal header card
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Modal, Animated } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import { useUser } from '../../context/UserContext';
import ProgressBar from '../../components/ProgressBar';
import ImpactCard from '../../components/ImpactCard';
import CollectionTypeItem from '../../components/CollectionTypeItem';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * Get time-based greeting
 * @returns {string} Greeting message
 */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

/**
 * Format current time
 * @returns {string} Formatted time string
 */
const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * DashboardScreen
 * Main dashboard screen for bin collection overview
 * @returns {JSX.Element} The DashboardScreen component
 */
const DashboardScreen = ({ navigation }) => {
  const { 
    getStatistics, 
    routeInfo, 
    impactMetrics, 
    collectionsByType,
    routes,
    fetchMyRoutes 
  } = useRoute();
  const { getUserFirstName } = useUser();
  const [todayRoute, setTodayRoute] = useState(null);
  
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [statusBarTime, setStatusBarTime] = useState(getCurrentTime());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }));
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  
  const globalStats = getStatistics(); // Keep for impact section
  const greeting = getGreeting();
  const userName = getUserFirstName();
  
  // Calculate stats from today's route (not all bins)
  const stats = todayRoute && todayRoute.bins ? {
    completed: todayRoute.bins.filter(b => b.status === 'collected').length,
    total: todayRoute.bins.length,
    pending: todayRoute.bins.filter(b => b.status === 'pending').length,
    efficiency: todayRoute.bins.length > 0 
      ? Math.round((todayRoute.bins.filter(b => b.status === 'collected').length / todayRoute.bins.length) * 100)
      : 0
  } : { completed: 0, total: 0, pending: 0, efficiency: 0 };
  
  // Check if all bins are collected
  const allCollected = stats.total > 0 && stats.completed === stats.total;

  // Load today's route
  useEffect(() => {
    fetchMyRoutes();
  }, []);

  // Check for today's route
  useEffect(() => {
    if (routes && routes.length > 0) {
      // Get today's date in local timezone (YYYY-MM-DD format)
      const todayLocal = new Date();
      const todayYear = todayLocal.getFullYear();
      const todayMonth = String(todayLocal.getMonth() + 1).padStart(2, '0');
      const todayDay = String(todayLocal.getDate()).padStart(2, '0');
      const today = `${todayYear}-${todayMonth}-${todayDay}`;
      
      console.log('🔍 Looking for today\'s route:', today);
      console.log('📋 Available routes:', routes.length);
      
      const route = routes.find(r => {
        // Get route date in local timezone
        const routeDateObj = new Date(r.scheduledDate);
        const routeYear = routeDateObj.getFullYear();
        const routeMonth = String(routeDateObj.getMonth() + 1).padStart(2, '0');
        const routeDay = String(routeDateObj.getDate()).padStart(2, '0');
        const routeDate = `${routeYear}-${routeMonth}-${routeDay}`;
        
        const isToday = routeDate === today;
        const statusMatch = r.status === 'scheduled' || r.status === 'in-progress';
        
        console.log(`   - ${r.routeName}: date=${routeDate}, isToday=${isToday}, status=${r.status}, match=${isToday && statusMatch}`);
        
        return isToday && statusMatch;
      });
      
      console.log('✅ Today\'s route:', route ? route.routeName : 'None found');
      setTodayRoute(route || null);
    } else {
      console.log('⚠️ No routes available');
      setTodayRoute(null);
    }
  }, [routes]);

  // Update clock and date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getCurrentTime();
      setCurrentTime(newTime);
      setStatusBarTime(newTime);
      setCurrentDate(new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Show completion animation when all bins are collected
  useEffect(() => {
    if (allCollected && stats.total > 0) {
      setShowCompletionModal(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    } else {
      setShowCompletionModal(false);
      scaleAnim.setValue(0);
    }
  }, [allCollected, stats.total]);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle notification bell press
  const handleNotificationPress = () => {
    console.log('Notification bell pressed');
    // TODO: Navigate to notifications screen
  };

  // Calculate accurate route progress
  const calculateRouteProgress = (route) => {
    if (!route || !route.bins || route.bins.length === 0) return 0;
    const collected = route.bins.filter(b => b.status === 'collected').length;
    return Math.round((collected / route.bins.length) * 100);
  };

  const getCollectedCount = (route) => {
    if (!route || !route.bins) return 0;
    return route.bins.filter(b => b.status === 'collected').length;
  };

  const getTotalBinsCount = (route) => {
    if (!route || !route.bins) return 0;
    return route.bins.length;
  };

  // Handle progress section press
  const handleProgressPress = () => {
    if (todayRoute) {
      navigation.navigate('RouteManagement');
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'reports') {
      navigation?.navigate('Reports');
    } else if (tab === 'profile') {
      navigation?.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="dashboard-container">
      {/* Completion Animation Modal */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.completionOverlay}>
          <Animated.View 
            style={[
              styles.completionCard,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.completionIcon}>🎉</Text>
            <Text style={styles.completionTitle}>Amazing Work!</Text>
            <Text style={styles.completionMessage}>All bins collected for today</Text>
            <TouchableOpacity 
              style={styles.completionButton}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={styles.completionButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        testID="dashboard-scroll-view"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER CARD (Teal) */}
        <View style={styles.headerCard} testID="header-card">
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusBarTime} testID="status-bar-time">
              {statusBarTime}
            </Text>
            <TouchableOpacity 
              onPress={handleNotificationPress}
              testID="notification-bell"
              activeOpacity={0.7}
            >
              <Text style={styles.bellIcon}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              {greeting}, {userName}! 🧡
            </Text>
            <Text style={styles.routeInfo}>
              {routeInfo.routeNumber} - {routeInfo.district}
            </Text>
            <Text style={styles.currentDate} testID="current-date">
              📅 {currentDate}
            </Text>
            <Text style={styles.currentTime} testID="current-time">
              🕐 {currentTime}
            </Text>
          </View>

          {/* Progress Section (Touchable only if route exists) */}
          <TouchableOpacity 
            style={styles.progressSection}
            onPress={todayRoute ? handleProgressPress : null}
            activeOpacity={todayRoute ? 0.9 : 1}
            disabled={!todayRoute}
            testID="progress-section-touchable"
          >
            {todayRoute ? (
              <>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>🚛 {todayRoute.routeName}</Text>
                  <Text style={styles.progressMeta}>🕐 {todayRoute.scheduledTime}</Text>
                </View>
                <ProgressBar 
                  percentage={calculateRouteProgress(todayRoute)} 
                  showPercentage={false}
                  height={8}
                  fillColor="#FFFFFF"
                  backgroundColor="rgba(255, 255, 255, 0.3)"
                />
                <Text style={styles.progressStatus}>
                  {todayRoute.status === 'scheduled' 
                    ? `⚠️ Route not started - ${getTotalBinsCount(todayRoute)} bins pending`
                    : `${getCollectedCount(todayRoute)}/${getTotalBinsCount(todayRoute)} bins collected`
                  }
                </Text>
              </>
            ) : (
              <View style={styles.noRouteContainer}>
                <Text style={styles.noRouteIcon}>📭</Text>
                <Text style={styles.noRouteText}>No assigned route for today</Text>
                <Text style={styles.noRouteSubtext}>Contact your admin</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Stat Cards (Inside Header) */}
          <View style={styles.headerStatsRow} testID="header-stats-row">
            {/* Completed Card (Blue) */}
            <View 
              style={[styles.headerStatCard, styles.completedCard]}
              testID="header-stat-completed"
            >
              <Text style={styles.headerStatIcon} testID="completed-icon">✓</Text>
              <Text style={styles.headerStatLabel}>Completed</Text>
              <Text style={styles.headerStatValue}>{stats.completed}/{stats.total}</Text>
            </View>

            {/* Efficiency Card (Green) */}
            <View 
              style={[styles.headerStatCard, styles.efficiencyCard]}
              testID="header-stat-efficiency"
            >
              <Text style={styles.headerStatIcon} testID="efficiency-icon">↻</Text>
              <Text style={styles.headerStatLabel}>Efficiency</Text>
              <Text style={styles.headerStatValue}>{stats.efficiency}%</Text>
            </View>
          </View>
        </View>

        {/* TODAY'S IMPACT SECTION (White Card) */}
        <View style={styles.impactSection} testID="impact-section">
          <View style={styles.impactHeader}>
            <Text style={styles.sectionTitle}>Today's Impact</Text>
            <View style={styles.impactHeaderIcons} testID="impact-header-icons">
              <Text style={styles.impactHeaderIcon}>🌱</Text>
              <Text style={styles.impactHeaderIcon}>♻️</Text>
            </View>
          </View>
          <View style={styles.impactRow}>
            <ImpactCard
              icon="♻️"
              label="Recycled"
              value={impactMetrics.recycled.value}
              unit={impactMetrics.recycled.unit}
              iconColor={COLORS.iconGreen}
              style={styles.impactCard}
            />
            <ImpactCard
              icon="💨"
              label="CO² Saved"
              value={impactMetrics.co2Saved.value}
              unit={impactMetrics.co2Saved.unit}
              iconColor={COLORS.iconGray}
              style={styles.impactCard}
            />
            <ImpactCard
              icon="🌳"
              label="Trees Saved"
              value={impactMetrics.treesSaved.value}
              unit={impactMetrics.treesSaved.unit}
              iconColor={COLORS.iconGreen}
              style={styles.impactCard}
            />
          </View>
        </View>

        {/* COLLECTIONS BY TYPE SECTION */}
        <View style={styles.collectionsSection}>
          <Text style={styles.sectionTitle}>Today's Collections by Type</Text>
          {collectionsByType.map((collection) => (
            <CollectionTypeItem
              key={collection.type}
              type={collection.type}
              count={collection.count}
              weight={collection.weight}
              icon={collection.icon}
              onPress={() => {
                console.log('Navigate to:', collection.type);
              }}
            />
          ))}
        </View>

        {/* ANALYTICS SECTION */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>
          <TouchableOpacity 
            style={styles.analyticsButton}
            onPress={() => navigation?.navigate('AnalyticsDashboard')}
          >
            <Text style={styles.analyticsIcon}>📊</Text>
            <View style={styles.analyticsTextContainer}>
              <Text style={styles.analyticsTitle}>View Analytics Dashboard</Text>
              <Text style={styles.analyticsSubtitle}>Reports, KPIs, and insights</Text>
            </View>
            <Text style={styles.analyticsArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground, // Light gray background
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },

  // HEADER CARD (Teal)
  headerCard: {
    backgroundColor: COLORS.headerTeal,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  // Status Bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBarTime: {
    fontSize: 14,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
  },
  bellIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },

  // Greeting Section
  greetingSection: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  routeInfo: {
    fontSize: 14,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
    opacity: 0.9,
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    opacity: 0.9,
    marginBottom: 4,
  },
  currentTime: {
    fontSize: 13,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
    opacity: 0.85,
  },

  // Progress Section
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
  },
  progressMeta: {
    fontSize: 13,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
  },
  progressStatus: {
    fontSize: 12,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  noRouteContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  noRouteIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  noRouteText: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  noRouteSubtext: {
    fontSize: 11,
    color: COLORS.textPrimary,
    opacity: 0.7,
  },

  // Header Stat Cards Row
  headerStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  headerStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  completedCard: {
    backgroundColor: COLORS.headerCompletedBlue,
  },
  efficiencyCard: {
    backgroundColor: COLORS.headerEfficiencyGreen,
  },
  headerStatIcon: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 13,
    fontWeight: FONTS.weight.regular,
    color: COLORS.textPrimary,
    opacity: 0.9,
    marginBottom: 4,
  },
  headerStatValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },

  // IMPACT SECTION (White Card)
  impactSection: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactHeaderIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  impactHeaderIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  impactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  impactCard: {
    flex: 1,
  },

  // COLLECTIONS SECTION
  collectionsSection: {
    paddingHorizontal: 16,
  },

  // ANALYTICS SECTION
  analyticsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  analyticsIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  analyticsTextContainer: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 2,
  },
  analyticsSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  analyticsArrow: {
    fontSize: 20,
    color: COLORS.primaryDarkTeal,
    fontWeight: 'bold',
  },

  // Completion Modal
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  completionIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 12,
  },
  completionMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  completionButton: {
    backgroundColor: COLORS.headerTeal,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },
});

export default DashboardScreen;
