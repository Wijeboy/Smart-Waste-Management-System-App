/**
 * CollectionHistoryCard Component
 * Displays individual collection record in history
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const CollectionHistoryCard = ({ collection }) => {
  const getBinTypeColor = (type) => {
    switch (type) {
      case 'Recyclable':
        return COLORS.iconGreen;
      case 'Organic':
        return COLORS.accentGreen;
      case 'Hazardous':
        return COLORS.alertRed;
      case 'General Waste':
      default:
        return COLORS.iconGray;
    }
  };

  const getBinTypeIcon = (type) => {
    switch (type) {
      case 'Recyclable':
        return '♻️';
      case 'Organic':
        return '🌱';
      case 'Hazardous':
        return '☢️';
      case 'General Waste':
      default:
        return '🗑️';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typeColor = getBinTypeColor(collection.binType);
  const typeIcon = getBinTypeIcon(collection.binType);

  return (
    <View style={styles.card}>
      {/* Header with Bin ID and Type */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{typeIcon}</Text>
          <View>
            <Text style={styles.binId}>{collection.binId}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>
                {collection.binType}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.weight}>⚖️ {collection.weight} kg</Text>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Text style={styles.label}>📍 Location:</Text>
        <Text style={styles.value}>{collection.binLocation}</Text>
      </View>

      {/* Date and Time */}
      <View style={styles.row}>
        <Text style={styles.label}>🗓️ Collected:</Text>
        <Text style={styles.value}>
          {formatDate(collection.collectedAt)} at {formatTime(collection.collectedAt)}
        </Text>
      </View>

      {/* Collector */}
      <View style={styles.row}>
        <Text style={styles.label}>👤 Collector:</Text>
        <Text style={styles.value}>{collection.collectorName}</Text>
      </View>

      {/* Route */}
      <View style={styles.row}>
        <Text style={styles.label}>🚛 Route:</Text>
        <Text style={styles.value}>{collection.routeName}</Text>
      </View>

      {/* Fill Level at Collection */}
      {collection.fillLevelAtCollection > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>📊 Fill Level:</Text>
          <Text style={styles.value}>{collection.fillLevelAtCollection}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.progressBarBg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  binId: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.semiBold,
  },
  weight: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    flex: 1,
  },
  value: {
    fontSize: FONTS.size.small,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
    flex: 2,
    textAlign: 'right',
  },
});

export default CollectionHistoryCard;
