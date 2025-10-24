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
    if (level >= 50) return COLORS.warningYellow;
    return COLORS.successGreen;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return COLORS.successGreen;
      case 'full':
        return COLORS.alertRed;
      case 'maintenance':
        return COLORS.warningYellow;
      default:
        return COLORS.iconGray;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not collected yet';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          <Text style={[styles.fillLevelValue, { color: getFillLevelColor(bin.fillLevel) }]}>
            {bin.fillLevel}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${bin.fillLevel}%`,
                backgroundColor: getFillLevelColor(bin.fillLevel),
              },
            ]}
          />
        </View>
      </View>

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
  progressBar: {
    height: 8,
    backgroundColor: COLORS.progressBarBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
