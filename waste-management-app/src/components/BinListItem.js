/**
 * BinListItem Component
 * Displays a bin item in the Reports screen with edit and delete actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * BinListItem Component
 * @param {Object} props - Component props
 * @param {Object} props.bin - Bin data object
 * @param {Function} props.onEdit - Callback when edit is pressed
 * @param {Function} props.onDelete - Callback when delete is pressed
 * @returns {JSX.Element} The BinListItem component
 */
const BinListItem = ({ bin, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#1F2937';
      case 'pending':
        return '#F59E0B';
      case 'issue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType) {
      case 'general':
        return '🗑️';
      case 'recyclable':
        return '♻️';
      case 'organic':
        return '🌱';
      default:
        return '🗑️';
    }
  };

  const getWasteTypeLabel = (wasteType) => {
    switch (wasteType) {
      case 'general':
        return 'General';
      case 'recyclable':
        return 'Recyclable';
      case 'organic':
        return 'Organic';
      default:
        return wasteType;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row - Bin ID and Status */}
      <View style={styles.headerRow}>
        <Text style={styles.binId}>{bin.binId}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(bin.status) },
          ]}
        >
          <Text style={styles.statusText}>{bin.status}</Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.location} numberOfLines={2}>
          {bin.location}
        </Text>
      </View>

      {/* Waste Type and Capacity */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>{getWasteTypeIcon(bin.wasteType)}</Text>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>
            {getWasteTypeLabel(bin.wasteType)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📦</Text>
          <Text style={styles.detailLabel}>Capacity</Text>
          <Text style={styles.detailValue}>{bin.capacity}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⚖️</Text>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{bin.weight}kg</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📊</Text>
          <Text style={styles.detailLabel}>Fill</Text>
          <Text style={styles.detailValue}>{bin.fillLevel}%</Text>
        </View>
      </View>

      {/* Notes (if exists) */}
      {bin.notes && (
        <View style={styles.notesRow}>
          <Text style={styles.notesIcon}>📝</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {bin.notes}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit && onEdit(bin)}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonIcon}>✏️</Text>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete && onDelete(bin)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonIcon}>🗑️</Text>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  binId: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#EF4444',
  },
});

export default BinListItem;
