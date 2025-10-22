/**
 * ActiveRouteScreen
 * Collector's active route tracking and bin collection
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
  Modal,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import apiService from '../../services/api';

const ActiveRouteScreen = ({ route, navigation }) => {
  const { routeId } = route.params;
  const { startRoute, collectBin, skipBin, completeRoute } = useRoute();
  
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  useEffect(() => {
    loadRouteData();
  }, [routeId]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      // Collectors use /routes/my-routes, not admin endpoint
      const response = await apiService.getMyRoutes();
      const myRoutes = response.data.routes; // ← routes is nested in data
      
      // Find the route with matching ID
      const data = myRoutes.find(r => r._id === routeId);
      
      if (!data) {
        Alert.alert('Error', 'Route not found or not assigned to you');
        navigation.goBack();
        return;
      }
      
      // Auto-start if scheduled
      if (data.status === 'scheduled') {
        const result = await startRoute(routeId);
        if (result.success) {
          setRouteData(result.data.route);
        } else {
          setRouteData(data);
        }
      } else {
        setRouteData(data);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load route');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBinPress = (bin) => {
    if (bin.status === 'pending') {
      setSelectedBin(bin);
      setShowCollectionModal(true);
    }
  };

  const handleCollectBin = async () => {
    if (!selectedBin) return;
    
    try {
      const result = await collectBin(routeData._id, selectedBin.bin._id);
      if (result.success) {
        setRouteData(result.data.route);
        setShowCollectionModal(false);
        setSelectedBin(null);
        Alert.alert('Success', 'Bin collected successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to collect bin');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to collect bin');
    }
  };

  const handleSkipBin = async (reason) => {
    if (!selectedBin || !reason) return;
    
    try {
      const result = await skipBin(routeData._id, selectedBin.bin._id, reason);
      if (result.success) {
        setRouteData(result.data.route);
        setShowCollectionModal(false);
        setSelectedBin(null);
        Alert.alert('Success', 'Bin skipped');
      } else {
        Alert.alert('Error', result.error || 'Failed to skip bin');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to skip bin');
    }
  };

  const handleCompleteRoute = () => {
    const pendingBins = routeData.bins.filter(b => b.status === 'pending').length;
    
    if (pendingBins > 0) {
      Alert.alert(
        'Incomplete Route',
        `You have ${pendingBins} pending bins. Complete or skip all bins before finishing the route.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Complete Route',
      'Are you sure you want to complete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            const result = await completeRoute(routeData._id);
            if (result.success) {
              Alert.alert('Success', 'Route completed successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Failed to complete route');
            }
          },
        },
      ]
    );
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
          <Text style={styles.loadingText}>Loading route...</Text>
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

  const progress = routeData.progress || 0;
  const totalBins = routeData.totalBins || routeData.bins?.length || 0;
  const collectedBins = routeData.collectedBins || 0;
  const pendingBins = routeData.pendingBins || 0;
  const skippedBins = routeData.skippedBins || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routeData.routeName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Route Progress</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStatItem}>
              <Text style={[styles.progressStatValue, { color: '#10B981' }]}>
                {collectedBins}
              </Text>
              <Text style={styles.progressStatLabel}>Collected</Text>
            </View>
            <View style={styles.progressStatItem}>
              <Text style={[styles.progressStatValue, { color: '#6B7280' }]}>
                {pendingBins}
              </Text>
              <Text style={styles.progressStatLabel}>Pending</Text>
            </View>
            <View style={styles.progressStatItem}>
              <Text style={[styles.progressStatValue, { color: '#F59E0B' }]}>
                {skippedBins}
              </Text>
              <Text style={styles.progressStatLabel}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* Bins List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bins ({totalBins})</Text>
          {routeData.bins && routeData.bins.map((binItem, index) => {
            const statusColor = getBinStatusColor(binItem.status);
            const isPending = binItem.status === 'pending';
            
            return (
              <TouchableOpacity
                key={binItem._id || index}
                style={[
                  styles.binCard,
                  !isPending && styles.binCardDisabled,
                ]}
                onPress={() => handleBinPress(binItem)}
                disabled={!isPending}
                activeOpacity={isPending ? 0.7 : 1}
              >
                <View style={styles.binHeader}>
                  <View style={styles.binOrderBadge}>
                    <Text style={styles.binOrderText}>{binItem.order}</Text>
                  </View>
                  <View style={[styles.binStatusBadge, { backgroundColor: statusColor }]}>
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

                {binItem.status === 'collected' && binItem.collectedAt && (
                  <Text style={styles.binTimestamp}>
                    ✅ Collected: {new Date(binItem.collectedAt).toLocaleTimeString()}
                  </Text>
                )}

                {binItem.status === 'skipped' && binItem.notes && (
                  <Text style={styles.binNotes}>
                    📝 {binItem.notes}
                  </Text>
                )}

                {isPending && (
                  <View style={styles.binAction}>
                    <Text style={styles.binActionText}>Tap to collect →</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Complete Button */}
        {pendingBins === 0 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteRoute}
          >
            <Text style={styles.completeButtonText}>✓ Complete Route</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Collection Modal */}
      <Modal
        visible={showCollectionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCollectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bin Collection</Text>
            
            {selectedBin && (
              <View style={styles.modalBinInfo}>
                <Text style={styles.modalBinId}>{selectedBin.bin?.binId}</Text>
                <Text style={styles.modalBinLocation}>{selectedBin.bin?.location}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.modalCollectButton}
              onPress={handleCollectBin}
            >
              <Text style={styles.modalCollectButtonText}>✓ Collect Bin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSkipButton}
              onPress={() => {
                Alert.prompt(
                  'Skip Bin',
                  'Please provide a reason for skipping:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Skip',
                      onPress: (reason) => {
                        if (reason && reason.trim()) {
                          handleSkipBin(reason.trim());
                        } else {
                          Alert.alert('Error', 'Please provide a reason');
                        }
                      },
                    },
                  ],
                  'plain-text'
                );
              }}
            >
              <Text style={styles.modalSkipButtonText}>Skip Bin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowCollectionModal(false);
                setSelectedBin(null);
              }}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
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
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 48,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 12,
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
  binCardDisabled: {
    opacity: 0.6,
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
  binAction: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  binActionText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBinInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalBinId: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  modalBinLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalCollectButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCollectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  modalSkipButton: {
    backgroundColor: '#F59E0B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSkipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
  },
});

export default ActiveRouteScreen;
