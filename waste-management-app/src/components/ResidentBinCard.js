/**
 * Resident Bin Card Component
 * Displays bin information for residents
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const ResidentBinCard = ({ bin, onPress }) => {
  const getFillLevelColor = (level) => {
    if (level >= 80) return COLORS.alertRed;
    if (level >= 50) return COLORS.iconOrange;
    return COLORS.accentGreen;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return COLORS.accentGreen;
      case 'full':
        return COLORS.alertRed;
      case 'maintenance':
        return COLORS.iconOrange;
      default:
        return COLORS.iconGray;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not collected yet';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Ensure fill level is a valid number
  const fillLevel = bin.fillLevel !== undefined && bin.fillLevel !== null ? Number(bin.fillLevel) : 0;
  console.log(`Bin ${bin.binId} fill level:`, fillLevel, typeof fillLevel);
  console.log(`Bin ${bin.binId} raw data:`, JSON.stringify({
    fillLevel: bin.fillLevel,
    capacity: bin.capacity,
    weight: bin.weight,
    latestCollection: bin.latestCollection
  }));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.binId}>{bin.binId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bin.status) }]}>
            <Text style={styles.statusText}>{bin.status?.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.binType}>{bin.binType}</Text>
        </View>
      </View>

      {/* Location */}
      <Text style={styles.location}>📍 {bin.location}</Text>
      <Text style={styles.zone}>Zone: {bin.zone}</Text>

      {/* Fill Level */}
      <View style={styles.fillLevelSection}>
        <View style={styles.fillLevelHeader}>
          <Text style={styles.fillLevelLabel}>Fill Level</Text>
          <Text style={[styles.fillLevelValue, { color: getFillLevelColor(fillLevel) }]}>
            {fillLevel}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(fillLevel, 0)}%`,
                  backgroundColor: getFillLevelColor(fillLevel),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Scheduled Collection Info */}
      {bin.scheduleInfo && bin.scheduleInfo.isScheduled && bin.scheduleInfo.binStatus === 'pending' && (
        <View style={styles.scheduledSection}>
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledBadgeText}>📅 SCHEDULED FOR COLLECTION</Text>
          </View>
          <View style={styles.scheduledDetails}>
            <Text style={styles.scheduledText}>
              🚛 Collector: {bin.scheduleInfo.collectorName}
            </Text>
            <Text style={styles.scheduledText}>
              📅 Date: {formatDate(bin.scheduleInfo.scheduledDate)}
            </Text>
            <Text style={styles.scheduledText}>
              📍 Route: {bin.scheduleInfo.routeName}
            </Text>
            <Text style={styles.scheduledText}>
              🔔 Status: {bin.scheduleInfo.routeStatus === 'in-progress' ? 'Collection in Progress' : 'Scheduled'}
            </Text>
          </View>
        </View>
      )}

      {/* Latest Collection */}
      {bin.latestCollection && bin.latestCollection.collectedAt && (
        <View style={styles.collectionSection}>
          <Text style={styles.collectionTitle}>Latest Collection</Text>
          <View style={styles.collectionDetails}>
            <Text style={styles.collectionText}>
              🗓️ {formatDate(bin.latestCollection.collectedAt)}
            </Text>
            {bin.latestCollection.weight > 0 && (
              <Text style={styles.collectionText}>
                ⚖️ Weight: {bin.latestCollection.weight} kg
              </Text>
            )}
            {bin.latestCollection.collectorName && (
              <Text style={styles.collectionText}>
                👤 Collected by: {bin.latestCollection.collectorName}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* No Collection Yet */}
      {(!bin.latestCollection || !bin.latestCollection.collectedAt) && (
        <View style={styles.noCollectionSection}>
          <Text style={styles.noCollectionText}>No collection history yet</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  binId: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: FONTS.size.caption,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weight.bold,
  },
  typeContainer: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  binType: {
    fontSize: FONTS.size.caption,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
  },
  location: {
    fontSize: FONTS.size.small,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  zone: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    marginBottom: 12,
  },
  fillLevelSection: {
    marginBottom: 12,
  },
  fillLevelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fillLevelLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
  },
  fillLevelValue: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    minWidth: 0,
  },
  scheduledSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  scheduledBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  scheduledBadgeText: {
    color: '#FFFFFF',
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.bold,
  },
  scheduledDetails: {
    gap: 4,
  },
  scheduledText: {
    fontSize: FONTS.size.small,
    color: '#1565C0',
    marginBottom: 2,
  },
  collectionSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.progressBarBg,
    paddingTop: 12,
  },
  collectionTitle: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 6,
  },
  collectionDetails: {
    gap: 4,
  },
  collectionText: {
    fontSize: FONTS.size.caption,
    color: COLORS.iconGray,
    marginBottom: 2,
  },
  noCollectionSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.progressBarBg,
    paddingTop: 12,
  },
  noCollectionText: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ResidentBinCard;
