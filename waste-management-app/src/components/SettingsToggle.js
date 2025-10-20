/**
 * SettingsToggle Component
 * Reusable toggle switch for app settings
 */

import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * SettingsToggle Component
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon emoji for the setting
 * @param {string} props.title - Setting title
 * @param {string} props.description - Setting description
 * @param {boolean} props.value - Current toggle value
 * @param {Function} props.onValueChange - Callback when toggle value changes
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The SettingsToggle component
 */
const SettingsToggle = ({
  icon,
  title,
  description,
  value = false,
  onValueChange,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onValueChange && onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: COLORS.primaryDarkTeal }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor="#D1D5DB"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default SettingsToggle;
