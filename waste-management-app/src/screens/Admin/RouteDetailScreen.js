/**
 * RouteDetailScreen
 * Detailed view of a route with all information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import apiService from '../../services/api';

const RouteDetailScreen = ({ route, navigation }) => {
  const { routeId } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRouteDetails();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRouteById(routeId);
      setRouteData(response.data.route);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch route details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCollector = async () => {
    // For now, just show an alert. In a full implementation, this would open a picker
    Alert.alert('Assign Collector', 'Collector assignment feature - to be implemented with user picker');
  };

  const handleDeleteRoute = () => {
    Alert.alert(
      'Delete Route',
      `Are you sure you want to delete "${routeData.routeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteRoute(routeId);
              Alert.alert('Success', 'Route deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete route');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#3B82F6';
      case 'in-progress':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getBinStatusColor = (status) => {
    switch (status) {
      case 'collected':
        return '#10B981';
      case 'skipped':
        return '#F59E0B';
      case 'pending':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading route details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!routeData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Route not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(routeData.status);
  const progress = routeData.progress || 0;
  const totalBins = routeData.totalBins || routeData.bins?.length || 0;
  const collectedBins = routeData.collectedBins || 0;
  const pendingBins = routeData.pendingBins || 0;
  const skippedBins = routeData.skippedBins || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route Details</Text>
        </View>

        {/* Route Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.routeName}>{routeData.routeName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{routeData.status}</Text>
          </View>

          {/* Date and Time */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeIcon}>📅</Text>
              <Text style={styles.dateTimeText}>
                {new Date(routeData.scheduledDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeIcon}>🕐</Text>
              <Text style={styles.dateTimeText}>{routeData.scheduledTime}</Text>
            </View>
          </View>

          {/* Progress */}
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
        </View>

        {/* Assigned Collector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Collector</Text>
          <View style={styles.card}>
            {routeData.assignedTo ? (
              <View style={styles.collectorInfo}>
                <View style={styles.collectorAvatar}>
                  <Text style={styles.collectorAvatarText}>
                    {routeData.assignedTo.firstName?.[0]}{routeData.assignedTo.lastName?.[0]}
                  </Text>
                </View>
                <View style={styles.collectorDetails}>
                  <Text style={styles.collectorName}>
                    {routeData.assignedTo.firstName} {routeData.assignedTo.lastName}
                  </Text>
                  <Text style={styles.collectorEmail}>{routeData.assignedTo.email}</Text>
                  <Text style={styles.collectorPhone}>{routeData.assignedTo.phoneNo}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.unassignedContainer}>
                <Text style={styles.unassignedIcon}>⚠️</Text>
                <Text style={styles.unassignedText}>No collector assigned</Text>
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={handleAssignCollector}
                >
                  <Text style={styles.assignButtonText}>Assign Collector</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalBins}</Text>
              <Text style={styles.statLabel}>Total Bins</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{collectedBins}</Text>
              <Text style={styles.statLabel}>Collected</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#6B7280' }]}>{pendingBins}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{skippedBins}</Text>
              <Text style={styles.statLabel}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* Bins List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bins ({totalBins})</Text>
          {routeData.bins && routeData.bins.map((binItem, index) => (
            <View key={binItem._id || index} style={styles.binCard}>
              <View style={styles.binHeader}>
                <View style={styles.binOrderBadge}>
                  <Text style={styles.binOrderText}>{binItem.order}</Text>
                </View>
                <View style={[styles.binStatusBadge, { backgroundColor: getBinStatusColor(binItem.status) }]}>
                  <Text style={styles.binStatusText}>{binItem.status}</Text>
                </View>
              </View>
              
              <Text style={styles.binId}>
                {binItem.bin?.binId || 'Unknown Bin'}
              </Text>
              <Text style={styles.binLocation}>
                📍 {binItem.bin?.location || 'Unknown location'}
              </Text>
              
              {binItem.bin && (
                <View style={styles.binDetails}>
                  <Text style={styles.binDetailText}>
                    Zone: {binItem.bin.zone}
                  </Text>
                  <Text style={styles.binDetailText}>
                    Type: {binItem.bin.binType}
                  </Text>
                  <Text style={styles.binDetailText}>
                    Fill: {binItem.bin.fillLevel}%
                  </Text>
                </View>
              )}

              {binItem.collectedAt && (
                <Text style={styles.binTimestamp}>
                  ✅ Collected: {new Date(binItem.collectedAt).toLocaleString()}
                </Text>
              )}

              {binItem.notes && (
                <Text style={styles.binNotes}>
                  📝 {binItem.notes}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Notes */}
        {routeData.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notesText}>{routeData.notes}</Text>
            </View>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.card}>
            <InfoRow
              label="Created"
              value={new Date(routeData.createdAt).toLocaleString()}
            />
            {routeData.startedAt && (
              <>
                <Divider />
                <InfoRow
                  label="Started"
                  value={new Date(routeData.startedAt).toLocaleString()}
                />
              </>
            )}
            {routeData.completedAt && (
              <>
                <Divider />
                <InfoRow
                  label="Completed"
                  value={new Date(routeData.completedAt).toLocaleString()}
                />
              </>
            )}
          </View>
        </View>

        {/* Actions */}
        {routeData.status === 'scheduled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditRoute', { routeId: routeData._id })}
            >
              <Text style={styles.actionButtonIcon}>✏️</Text>
              <Text style={styles.actionButtonText}>Edit Route</Text>
              <Text style={styles.actionButtonArrow}>→</Text>
            </TouchableOpacity>

            {!routeData.assignedTo && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleAssignCollector}
              >
                <Text style={styles.actionButtonIcon}>👤</Text>
                <Text style={styles.actionButtonText}>Assign Collector</Text>
                <Text style={styles.actionButtonArrow}>→</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteRoute}
            >
              <Text style={styles.dangerButtonIcon}>🗑️</Text>
              <Text style={styles.dangerButtonText}>Delete Route</Text>
              <Text style={styles.dangerButtonArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primaryDarkTeal,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  routeName: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  collectorAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
  },
  collectorDetails: {
    flex: 1,
  },
  collectorName: {
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  collectorEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  collectorPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  unassignedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  unassignedIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  unassignedText: {
    fontSize: 16,
    color: '#F59E0B',
    marginBottom: 16,
  },
  assignButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
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
    fontSize: 28,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  binCard: {
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
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  binOrderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binOrderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FONTS.weight.bold,
  },
  binStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  binStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
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
  binDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  binDetailText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  binTimestamp: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 8,
  },
  binNotes: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: FONTS.weight.semiBold,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  actionButtonArrow: {
    fontSize: 20,
    color: '#6B7280',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  dangerButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dangerButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#EF4444',
  },
  dangerButtonArrow: {
    fontSize: 20,
    color: '#EF4444',
  },
});

export default RouteDetailScreen;
