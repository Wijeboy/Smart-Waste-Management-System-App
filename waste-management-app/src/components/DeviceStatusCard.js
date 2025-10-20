/**
 * DeviceStatusCard Component
 * Displays device status information like battery and network
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * DeviceStatusCard Component
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon emoji
 * @param {string} props.label - Status label (Battery, Network)
 * @param {string} props.value - Status value (87%, Strong)
 * @param {string} props.iconColor - Color for the icon indicator
 * @param {Object} props.style - Additional styles
 * @returns {JSX.Element} The DeviceStatusCard component
 */
const DeviceStatusCard = ({ icon, label, value, iconColor, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {iconColor && <View style={[styles.indicator, { backgroundColor: iconColor }]} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  label: {
    fontSize: 16,
    fontWeight: FONTS.weight.medium,
    color: '#1F2937',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
    marginRight: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default DeviceStatusCard;
