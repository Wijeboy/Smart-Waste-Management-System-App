/**
 * ScanBinScreen Component
 * Placeholder screen for scanning bin QR codes
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * ScanBinScreen
 * Screen for scanning bin QR codes and recording collection
 * @param {Object} props - Component props
 * @param {Object} props.route - Navigation route object
 * @returns {JSX.Element} The ScanBinScreen component
 */
const ScanBinScreen = ({ route }) => {
  const { stop } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Bin</Text>
      {stop && (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Bin ID:</Text>
          <Text style={styles.value}>{stop.binId}</Text>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{stop.address}</Text>
          <Text style={styles.label}>Priority:</Text>
          <Text style={styles.value}>{stop.priority}</Text>
        </View>
      )}
      <Text style={styles.placeholder}>Camera/QR Scanner will be implemented here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkTeal,
    padding: 20,
  },
  title: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginTop: 8,
  },
  value: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.regular,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  placeholder: {
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});

export default ScanBinScreen;
