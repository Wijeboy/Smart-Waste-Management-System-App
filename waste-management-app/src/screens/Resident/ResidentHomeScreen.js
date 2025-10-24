/**
 * Resident Home Screen
 * Main home screen for residents to manage their bins
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import { COLORS, FONTS } from '../../constants/theme';
import AddBinModal from '../../components/AddBinModal';
import ResidentBinCard from '../../components/ResidentBinCard';

const ResidentHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      setLoading(true);
      const response = await apiService.getResidentBins();
      setBins(response.data || []);
    } catch (error) {
      console.error('Error fetching bins:', error);
      Alert.alert('Error', 'Failed to load your bins');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBins();
    setRefreshing(false);
  }, []);

  const handleAddBin = async (binData) => {
    try {
      await apiService.createResidentBin(binData);
      Alert.alert('Success', 'Bin added successfully!');
      setModalVisible(false);
      fetchBins();
    } catch (error) {
      console.error('Error adding bin:', error);
      Alert.alert('Error', error.message || 'Failed to add bin');
    }
  };

  const handleBinPress = (bin) => {
    // Show bin details with close button only
    Alert.alert(
      bin.binId,
      `Location: ${bin.location}\nZone: ${bin.zone}\nType: ${bin.binType}\nCapacity: ${bin.capacity}kg\nFill Level: ${bin.fillLevel || 0}%\nStatus: ${bin.status}`,
      [
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const calculateStats = () => {
    const total = bins.length;
    const active = bins.filter((b) => b.status === 'active').length;
    
    // Count bins that need collection:
    // 1. Fill level >= 70% OR
    // 2. Scheduled for collection (has scheduleInfo and is pending)
    const needsCollection = bins.filter((b) => {
      const hasHighFillLevel = (b.fillLevel || 0) >= 70;
      const isScheduled = b.scheduleInfo && b.scheduleInfo.isScheduled && b.scheduleInfo.binStatus === 'pending';
      return hasHighFillLevel || isScheduled;
    }).length;
    
    const avgFillLevel = total > 0 
      ? Math.round(bins.reduce((sum, b) => sum + (b.fillLevel || 0), 0) / total)
      : 0;

    return { total, active, needsCollection, avgFillLevel };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
        <Text style={styles.loadingText}>Loading your bins...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Bins Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Bins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, stats.needsCollection > 0 && styles.warningText]}>
                {stats.needsCollection}
              </Text>
              <Text style={styles.statLabel}>Needs Collection</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.avgFillLevel}%</Text>
              <Text style={styles.statLabel}>Avg Fill Level</Text>
            </View>
          </View>
        </View>

        {/* Bins List */}
        <View style={styles.binsSection}>
          <Text style={styles.sectionTitle}>My Bins</Text>
          {bins.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>You don't have any bins yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button below to add your first bin
              </Text>
            </View>
          ) : (
            bins.map((bin) => (
              <ResidentBinCard
                key={bin._id}
                bin={bin}
                onPress={() => handleBinPress(bin)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Bin Modal */}
      <AddBinModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddBin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
  loadingText: {
    marginTop: 10,
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
  },
  header: {
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: FONTS.size.body,
    color: COLORS.textPrimary,
    opacity: 0.9,
  },
  userName: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  statsCard: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONTS.size.caption,
    color: COLORS.iconGray,
    textAlign: 'center',
  },
  warningText: {
    color: COLORS.alertRed,
  },
  binsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weight.bold,
  },
});

export default ResidentHomeScreen;
