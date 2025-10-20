/**
 * RouteManagementScreen Component
 * Displays the route management interface for bin collection
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import StatCard from '../../components/StatCard';
import ProgressBar from '../../components/ProgressBar';
import NextStopCard from '../../components/NextStopCard';
import BinDetailsModal from '../../components/BinDetailsModal';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * RouteManagementScreen
 * Main screen for managing bin collection routes
 * @returns {JSX.Element} The RouteManagementScreen component
 */
const RouteManagementScreen = ({ navigation }) => {
  // Get route data and functions from context
  const { 
    getStatistics, 
    getPendingStops, 
    getCompletedStops,
    getIssueStops,
    getStopByBinId, 
    updateStopDetails,
    resetAllBins, 
    routeInfo 
  } = useRoute();
  const stats = getStatistics();
  const pendingStops = getPendingStops();
  const completedStops = getCompletedStops();
  const issueStops = getIssueStops();

  // State for modal and filters
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [filterTab, setFilterTab] = useState('pending'); // pending, completed, issues

  const handleStopPress = (stop) => {
    // Open modal with bin details
    setSelectedBin(stop);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBin(null);
  };

  const handleUpdateBinDetails = async (updates) => {
    if (selectedBin) {
      console.log('🔄 Updating bin:', selectedBin.binId, 'with:', updates);
      try {
        await updateStopDetails(selectedBin.binId, updates);
        console.log('✅ Bin updated successfully');
        // Close modal after successful update
        setModalVisible(false);
        setSelectedBin(null);
      } catch (error) {
        console.error('❌ Error updating bin:', error);
      }
    }
  };

  const handleMapViewPress = () => {
    // Navigate to map view (placeholder for future implementation)
    console.log('Navigate to map view');
  };
  
  const handleResetAllBins = () => {
    Alert.alert(
      'Reset All Bins',
      'This will mark all bins as pending (needing collection). Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Resetting all bins to pending...');
              await resetAllBins();
              console.log('✅ All bins reset successfully');
              Alert.alert('Success', 'All bins have been reset to pending status');
            } catch (error) {
              console.error('❌ Error resetting bins:', error);
              Alert.alert('Error', 'Failed to reset bins');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  // Get stops based on filter
  const getFilteredStops = () => {
    switch (filterTab) {
      case 'completed':
        return completedStops;
      case 'issues':
        return issueStops;
      case 'pending':
      default:
        return pendingStops;
    }
  };
  
  const filteredStops = getFilteredStops();

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Bin Details Modal */}
      {selectedBin && (
        <BinDetailsModal
          visible={modalVisible}
          binId={selectedBin.binId}
          location={selectedBin.address}
          status={selectedBin.status}
          weight={selectedBin.weight}
          fillLevel={selectedBin.fillLevel}
          onUpdate={handleUpdateBinDetails}
          onClose={handleCloseModal}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER CARD (Teal/Green) */}
        <View style={styles.headerCard}>
          {/* Title and Map View Button */}
          <View style={styles.headerTop}>
            <Text style={styles.title}>Route Management</Text>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={handleMapViewPress}
            >
              <Text style={styles.mapButtonIcon}>🗺️</Text>
              <Text style={styles.mapButtonText}>Map View</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards with Icons */}
          <View style={styles.statsRow}>
            {/* Completed Card */}
            <View style={styles.statCardWhite} testID="stat-card-completed">
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconGreen}>✓</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            {/* Remaining Card */}
            <View style={styles.statCardWhite} testID="stat-card-remaining">
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconBlue}>⊙</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.remaining}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>

            {/* Issues Card */}
            <View style={styles.statCardWhite} testID="stat-card-issues">
              <View style={styles.statIconContainer}>
                <Text style={styles.statIconRed}>⚠</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.issues}</Text>
                <Text style={styles.statLabel}>Issues</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ROUTE PROGRESS SECTION (White Card) */}
        <View style={styles.progressCard}>
          <View style={styles.progressTitleRow}>
            <Text style={styles.progressIcon}>🚩</Text>
            <Text style={styles.progressTitle}>Route Progress</Text>
          </View>
          
          <ProgressBar 
            percentage={stats.percentage} 
            showPercentage={false}
            fillColor="#1F2937"
            backgroundColor="#E5E7EB"
            height={10}
          />
          
          <View style={styles.progressFooter}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressArrow}>⬆</Text>
              <Text style={styles.progressText}>{stats.percentage}% Complete</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.etaIcon}>🕐</Text>
              <Text style={styles.etaText}>ETA: {stats.eta}</Text>
            </View>
          </View>
        </View>

        {/* BINS SECTION */}
        <View style={styles.section}>
          {/* Section Header with Reset Button */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🚩</Text>
              <Text style={styles.sectionTitle}>Bin Management</Text>
            </View>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetAllBins}
            >
              <Text style={styles.resetButtonText}>🔄 Reset All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity 
              style={[styles.filterTab, filterTab === 'pending' && styles.filterTabActive]}
              onPress={() => setFilterTab('pending')}
            >
              <Text style={[styles.filterTabText, filterTab === 'pending' && styles.filterTabTextActive]}>
                ⏳ Pending ({pendingStops.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, filterTab === 'completed' && styles.filterTabActive]}
              onPress={() => setFilterTab('completed')}
            >
              <Text style={[styles.filterTabText, filterTab === 'completed' && styles.filterTabTextActive]}>
                ✅ Completed ({completedStops.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, filterTab === 'issues' && styles.filterTabActive]}
              onPress={() => setFilterTab('issues')}
            >
              <Text style={[styles.filterTabText, filterTab === 'issues' && styles.filterTabTextActive]}>
                ⚠️ Issues ({issueStops.length})
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Bin List */}
          {filteredStops.length > 0 ? (
            filteredStops.map((stop, index) => (
              <NextStopCard
                key={stop.id}
                stop={stop}
                sequence={filterTab === 'pending' ? index + 1 : null}
                onPress={handleStopPress}
                backgroundColor={COLORS.lightCard}
                isCompleted={filterTab === 'completed'}
                isIssue={filterTab === 'issues'}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>
                {filterTab === 'pending' ? '✅' : filterTab === 'completed' ? '📋' : '✓'}
              </Text>
              <Text style={styles.emptyStateText}>
                {filterTab === 'pending' ? 'All bins collected!' : 
                 filterTab === 'completed' ? 'No completed bins' :
                 'No issues reported'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {filterTab === 'pending' ? 'Great work today!' :
                 filterTab === 'completed' ? 'Complete some collections first' :
                 'Everything running smoothly'}
              </Text>
            </View>
          )}
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
    backgroundColor: COLORS.appBackground, // Light gray/white background
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },

  // HEADER CARD (Teal/Green)
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  mapButtonIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },

  // Stats Cards (White cards with icons)
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardWhite: {
    flex: 1,
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIconGreen: {
    fontSize: 24,
    color: '#10B981',
  },
  statIconBlue: {
    fontSize: 24,
    color: '#3B82F6',
  },
  statIconRed: {
    fontSize: 24,
    color: '#EF4444',
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
  },

  // PROGRESS CARD (White)
  progressCard: {
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
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressArrow: {
    fontSize: 12,
    marginRight: 4,
    color: COLORS.primaryDarkTeal,
  },
  progressText: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
  },
  etaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  etaText: {
    fontSize: 13,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
  },

  // BINS SECTION
  section: {
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  resetButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    marginTop: 16,
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
