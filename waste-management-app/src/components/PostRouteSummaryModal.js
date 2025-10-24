/**
 * PostRouteSummaryModal Component
 * Displays comprehensive route completion summary with all bin details and statistics
 * Allows downloading the report
 * 
 * @component
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Format duration from minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * PostRouteSummaryModal
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onClose - Called when modal should close
 * @param {Function} props.onDownloadReport - Called when download report button is pressed
 * @param {Object} props.routeData - Complete route data object
 * @param {boolean} props.downloadLoading - Shows loading state for download button
 * @returns {JSX.Element} The PostRouteSummaryModal component
 */
const PostRouteSummaryModal = ({
  visible,
  onClose,
  onDownloadReport,
  routeData,
  downloadLoading = false,
}) => {
  if (!routeData) return null;

  const {
    routeName,
    bins = [],
    wasteCollected = 0,
    recyclableWaste = 0,
    routeDuration = 0,
    completedAt,
    startedAt,
  } = routeData;

  // Calculate statistics
  const totalBins = bins.length;
  const collectedBins = bins.filter((b) => b.status === 'collected').length;
  const skippedBins = bins.filter((b) => b.status === 'skipped').length;

  /**
   * Render individual bin card
   */
  const renderBinCard = (binItem, index) => {
    const { bin, status, actualWeight, fillLevelAtCollection, collectedAt: binCollectedAt } = binItem;

    return (
      <View key={bin?._id || index} style={styles.binCard}>
        <View style={styles.binHeader}>
          <Text style={styles.binId}>{bin?.binId || 'Unknown Bin'}</Text>
          <View
            style={[
              styles.statusBadge,
              status === 'collected' && styles.statusCollected,
              status === 'skipped' && styles.statusSkipped,
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.binLocation}>📍 {bin?.location || 'Unknown location'}</Text>

        {status === 'collected' && (
          <View style={styles.binDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fill Level:</Text>
              <Text style={styles.detailValue}>
                {fillLevelAtCollection !== undefined ? `${fillLevelAtCollection}%` : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight Collected:</Text>
              <Text style={styles.detailValue}>
                {actualWeight !== undefined ? `${actualWeight} kg` : 'N/A'}
              </Text>
            </View>
            {binCollectedAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>
                  {new Date(binCollectedAt).toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {status === 'skipped' && binItem.notes && (
          <Text style={styles.skipReason}>Reason: {binItem.notes}</Text>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>✓</Text>
            <Text style={styles.headerTitle}>Route Completed!</Text>
            <Text style={styles.routeName}>{routeName}</Text>
          </View>

          {/* Summary Statistics */}
          <View style={styles.summarySection}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalBins}</Text>
                <Text style={styles.statLabel}>Total Bins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: COLORS.accentGreen }]}>
                  {collectedBins}
                </Text>
                <Text style={styles.statLabel}>Collected</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {skippedBins}
                </Text>
                <Text style={styles.statLabel}>Skipped</Text>
              </View>
            </View>

            <View style={styles.additionalStats}>
              <View style={styles.additionalStatRow}>
                <Text style={styles.additionalStatLabel}>⏱️ Total Time:</Text>
                <Text style={styles.additionalStatValue}>{formatDuration(routeDuration)}</Text>
              </View>
              <View style={styles.additionalStatRow}>
                <Text style={styles.additionalStatLabel}>♻️ Total Waste Collected:</Text>
                <Text style={styles.additionalStatValue}>{wasteCollected} kg</Text>
              </View>
              <View style={styles.additionalStatRow}>
                <Text style={styles.additionalStatLabel}>🌱 Recyclable Waste:</Text>
                <Text style={styles.additionalStatValue}>{recyclableWaste} kg</Text>
              </View>
              {completedAt && (
                <View style={styles.additionalStatRow}>
                  <Text style={styles.additionalStatLabel}>✅ Completed At:</Text>
                  <Text style={styles.additionalStatValue}>
                    {new Date(completedAt).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Bins List */}
          <View style={styles.binsSection}>
            <Text style={styles.sectionTitle}>Bin Details ({totalBins})</Text>
            <ScrollView
              style={styles.binsScrollView}
              showsVerticalScrollIndicator={false}
            >
              {bins.map((binItem, index) => renderBinCard(binItem, index))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={onDownloadReport}
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <ActivityIndicator color={COLORS.textWhite} size="small" />
              ) : (
                <>
                  <Text style={styles.downloadIcon}>📥</Text>
                  <Text style={styles.downloadButtonText}>Download Report</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: COLORS.modalBackground,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: COLORS.accentGreen,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  routeName: {
    fontSize: 16,
    color: COLORS.textWhite,
    marginTop: 4,
    fontFamily: FONTS.regular,
    opacity: 0.9,
  },
  summarySection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryDarkTeal,
    fontFamily: FONTS.bold,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  additionalStats: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  additionalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  additionalStatLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: FONTS.regular,
  },
  additionalStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONTS.semiBold,
  },
  binsSection: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    fontFamily: FONTS.bold,
  },
  binsScrollView: {
    flex: 1,
  },
  binCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  binId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: FONTS.bold,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
  },
  statusCollected: {
    backgroundColor: COLORS.accentGreen,
  },
  statusSkipped: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textWhite,
    fontFamily: FONTS.semiBold,
    textTransform: 'capitalize',
  },
  binLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: FONTS.regular,
  },
  binDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: FONTS.regular,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    fontFamily: FONTS.semiBold,
  },
  skipReason: {
    fontSize: 13,
    color: '#F59E0B',
    fontStyle: 'italic',
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  downloadButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  downloadIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  downloadButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.semiBold,
  },
});

export default PostRouteSummaryModal;
