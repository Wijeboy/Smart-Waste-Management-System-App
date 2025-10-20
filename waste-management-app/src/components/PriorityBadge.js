/**
 * PriorityBadge Component
 * Displays a colored badge indicating the priority level
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Get priority badge color based on priority level
 * @param {string} priority - Priority level (high, normal, low)
 * @returns {string} Color hex code
 */
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return COLORS.badgeHigh;
    case 'normal':
      return COLORS.badgeNormal;
    case 'low':
      return COLORS.badgeNormal;
    default:
      return COLORS.badgeNormal;
  }
};

/**
 * PriorityBadge Component
 * @param {Object} props - Component props
 * @param {string} props.priority - Priority level to display
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The PriorityBadge component
 */
const PriorityBadge = ({ priority = '', style }) => {
  const backgroundColor = getPriorityColor(priority);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        style,
      ]}
      testID={`priority-badge-${priority}`}
    >
      <Text style={styles.text}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
});

export default PriorityBadge;
