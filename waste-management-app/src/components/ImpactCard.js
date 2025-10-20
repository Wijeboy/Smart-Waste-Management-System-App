/**
 * ImpactCard Component
 * Displays environmental impact metrics with icon, value, and label
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
  if (!label) return 'impact-card-';
  return `impact-card-${label
    .toLowerCase()
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')}`;
};

/**
 * Format value with unit
 * @param {string|number} value - The value
 * @param {string} unit - The unit
 * @returns {string} Formatted value string
 */
const formatValue = (value, unit) => {
  if (value == null) return '';
  const valueStr = String(value);
  if (unit && unit.trim()) {
    return `${valueStr} ${unit}`;
  }
  return valueStr;
};

/**
 * ImpactCard Component
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon text/emoji to display
 * @param {string} props.label - Label text
 * @param {string|number} props.value - Value to display
 * @param {string} props.unit - Unit of measurement
 * @param {string} props.iconColor - Color for the icon
 * @param {string} props.backgroundColor - Background color of the card
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The ImpactCard component
 */
const ImpactCard = ({
  icon,
  label = '',
  value,
  unit,
  iconColor = COLORS.iconGreen,
  backgroundColor = COLORS.lightCard,
  style,
}) => {
  const testID = generateTestID(label);
  const formattedValue = formatValue(value, unit);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        style,
      ]}
      testID={testID}
    >
      {icon && (
        <View style={styles.iconContainer} testID="impact-card-icon">
          <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
        </View>
      )}
      <Text style={styles.value}>{formattedValue}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  value: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  label: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default ImpactCard;
