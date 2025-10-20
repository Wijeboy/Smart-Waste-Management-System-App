/**
 * CollectionTypeItem Component
 * Displays a collection type with icon, count, and navigation
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Generate testID from type
 * @param {string} type - The collection type
 * @returns {string} Generated testID
 */
const generateTestID = (type) => {
  if (!type) return 'collection-type-item-';
  return `collection-type-item-${type
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Keep hyphens
    .replace(/\s+/g, '-')}`;
};

/**
 * CollectionTypeItem Component
 * @param {Object} props - Component props
 * @param {string} props.type - Collection type name
 * @param {number|string} props.count - Number of collections
 * @param {string} props.icon - Icon emoji to display
 * @param {string} props.iconColor - Color for the icon background
 * @param {string} props.backgroundColor - Background color of the item
 * @param {Function} props.onPress - Callback when pressed
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The CollectionTypeItem component
 */
const CollectionTypeItem = ({
  type = '',
  count,
  icon,
  iconColor = COLORS.iconTeal,
  backgroundColor = COLORS.lightCard,
  onPress,
  style,
}) => {
  const testID = generateTestID(type);
  const countDisplay = count != null ? String(count) : '';

  const handlePress = () => {
    if (onPress) {
      onPress(type);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, style]}
      testID={testID}
      onPress={handlePress}
      accessible={true}
      activeOpacity={0.7}
    >
      {/* Icon */}
      {icon && (
        <View 
          style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}
          testID="collection-type-icon"
        >
          <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.subtitle}>Collected today</Text>
      </View>

      {/* Count */}
      <Text style={styles.count}>{countDisplay}</Text>

      {/* Arrow */}
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    opacity: 0.6,
  },
  count: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginRight: 12,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.primaryDarkTeal,
    opacity: 0.4,
  },
});

export default CollectionTypeItem;
