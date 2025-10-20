/**
 * StatCard Component
 * Displays a statistics card with icon, label, and value
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Generate testID from label
 * @param {string} label - The label text
 * @returns {string} Generated testID
 */
const generateTestID = (label) => {
  if (!label) return 'stat-card-';
  return `stat-card-${label
    .toLowerCase()
    .replace(/²/g, '2') // Replace superscript 2
    .replace(/³/g, '3') // Replace superscript 3
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')}`;
};

/**
 * StatCard Component
 * @param {Object} props - Component props
 * @param {string} props.label - Label text to display
 * @param {string|number} props.value - Value to display
 * @param {string} props.icon - Icon text/emoji to display
 * @param {string} props.iconColor - Color for the icon
 * @param {string} props.backgroundColor - Background color of the card
 * @param {string} props.layout - Layout direction ('horizontal' or 'vertical')
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The StatCard component
 */
const StatCard = ({
  label = '',
  value,
  icon,
  iconColor = COLORS.iconTeal,
  backgroundColor = COLORS.lightCard,
  layout = 'horizontal',
  style,
}) => {
  const testID = generateTestID(label);
  const isVertical = layout === 'vertical';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        isVertical ? styles.verticalLayout : styles.horizontalLayout,
        style,
      ]}
      testID={testID}
    >
      {icon && (
        <View style={styles.iconContainer} testID="stat-card-icon">
          <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.value}>{value != null ? String(value) : ''}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
  },
  value: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
  },
});

export default StatCard;
