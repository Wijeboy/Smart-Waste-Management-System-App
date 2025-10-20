/**
 * RouteListItem Component
 * Displays a single stop item in the route management list
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/theme';
import BinDetailsModal from './BinDetailsModal';

/**
 * RouteListItem
 * Renders a card displaying stop information including bin ID, address, and priority
 * @param {Object} props - Component props
 * @param {Object} props.stop - Stop object containing id, binId, address, status, and priority
 * @param {Function} props.onStatusUpdate - Callback to update stop status
 * @returns {JSX.Element} The RouteListItem component
 */
const RouteListItem = ({ stop, onStatusUpdate }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Get priority tag color based on priority level
   * @param {string} priority - Priority level (high, medium, low)
   * @returns {string} Color hex code
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return COLORS.highPriorityRed;
      case 'medium':
        return COLORS.accentGreen;
      case 'low':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  /**
   * Handle press event to open modal or navigate
   */
  const handlePress = () => {
    if (stop.status === 'completed') {
      // If already completed, navigate to scan screen
      navigation.navigate('ScanBin', { stop });
    } else {
      // Otherwise, show modal for collection confirmation
      setModalVisible(true);
    }
  };

  /**
   * Handle confirm collection action
   */
  const handleConfirmCollection = () => {
    if (onStatusUpdate) {
      onStatusUpdate(stop.id, 'completed');
    }
    setModalVisible(false);
  };

  /**
   * Handle report issue action
   */
  const handleReportIssue = () => {
    setModalVisible(false);
    navigation.navigate('ScanBin', { stop });
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const isCompleted = stop.status === 'completed';

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container,
          isCompleted && styles.completedContainer
        ]} 
        onPress={handlePress}
        activeOpacity={0.7}
        testID={`route-item-${stop.id}`}
      >
        <View style={styles.contentContainer}>
          <View style={styles.mainInfo}>
            <View style={styles.binIdRow}>
              <Text style={styles.binId}>{stop.binId}</Text>
              {isCompleted && (
                <Text style={styles.completedBadge} testID={`status-${stop.id}`}>
                  ✓ Completed
                </Text>
              )}
            </View>
            <Text style={styles.address}>{stop.address}</Text>
          </View>
          <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(stop.priority) }]}>
            <Text style={styles.priorityText}>{stop.priority}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <BinDetailsModal
        visible={modalVisible}
        binId={stop.binId}
        location={stop.address}
        onConfirm={handleConfirmCollection}
        onReportIssue={handleReportIssue}
        onClose={handleCloseModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  binId: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  address: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
  },
  priorityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
  completedContainer: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: COLORS.accentGreen,
  },
  binIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  completedBadge: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.accentGreen,
    marginLeft: 8,
  },
});

export default RouteListItem;
