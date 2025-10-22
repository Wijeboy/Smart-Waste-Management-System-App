/**
 * RouteCard Component
 * Displays route information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Get status badge color
 */
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'scheduled':
      return '#3B82F6'; // Blue
    case 'in-progress':
      return '#F59E0B'; // Orange
    case 'completed':
      return '#10B981'; // Green
    case 'cancelled':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * RouteCard Component
 */
const RouteCard = ({ route, onPress, showProgress = true }) => {
  const statusColor = getStatusBadgeColor(route.status);
  const progress = route.progress || 0;
  const totalBins = route.totalBins || route.bins?.length || 0;
  const collectedBins = route.collectedBins || route.bins?.filter(b => b.status === 'collected').length || 0;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.routeName}>{route.routeName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{route.status}</Text>
          </View>
        </View>
      </View>

      {/* Date and Time */}
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeIcon}>📅</Text>
          <Text style={styles.dateTimeText}>{formatDate(route.scheduledDate)}</Text>
        </View>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeIcon}>🕐</Text>
          <Text style={styles.dateTimeText}>{route.scheduledTime}</Text>
        </View>
      </View>

      {/* Assigned Collector */}
      {route.assignedTo && (
        <View style={styles.collectorContainer}>
          <Text style={styles.collectorIcon}>👤</Text>
          <Text style={styles.collectorText}>
            {route.assignedTo.firstName} {route.assignedTo.lastName}
          </Text>
        </View>
      )}
      {!route.assignedTo && (
        <View style={styles.collectorContainer}>
          <Text style={styles.collectorIcon}>⚠️</Text>
          <Text style={[styles.collectorText, styles.unassignedText]}>
            Unassigned
          </Text>
        </View>
      )}

      {/* Progress Bar */}
      {showProgress && totalBins > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {collectedBins} / {totalBins} bins
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
      )}

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {totalBins} {totalBins === 1 ? 'bin' : 'bins'}
        </Text>
        {route.startedAt && (
          <Text style={styles.footerText}>
            Started: {new Date(route.startedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        )}
        {route.completedAt && (
          <Text style={styles.footerText}>
            Completed: {new Date(route.completedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  collectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  collectorText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: FONTS.weight.semiBold,
  },
  unassignedText: {
    color: '#F59E0B',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default RouteCard;
