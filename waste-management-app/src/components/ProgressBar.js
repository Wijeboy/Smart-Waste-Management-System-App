/**
 * ProgressBar Component
 * Displays an animated progress bar with optional percentage label
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Normalize percentage value to be between 0 and 100
 * @param {number} value - The percentage value
 * @returns {number} Normalized percentage
 */
const normalizePercentage = (value) => {
  const numValue = Number(value);
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return 0;
  }
  return Math.max(0, Math.min(100, numValue));
};

/**
 * ProgressBar Component
 * @param {Object} props - Component props
 * @param {number} props.percentage - Progress percentage (0-100)
 * @param {string} props.backgroundColor - Background color of the progress bar
 * @param {string} props.fillColor - Fill color of the progress
 * @param {number} props.height - Height of the progress bar
 * @param {boolean} props.showPercentage - Whether to show percentage label
 * @param {Object} props.style - Additional container styles
 * @returns {JSX.Element} The ProgressBar component
 */
const ProgressBar = ({
  percentage = 0,
  backgroundColor = COLORS.progressBarBg,
  fillColor = COLORS.progressBarFill,
  height = 8,
  showPercentage = false,
  style,
}) => {
  const normalizedPercentage = normalizePercentage(percentage);

  return (
    <View style={[styles.container, style]} testID="progress-bar-container">
      {showPercentage && (
        <Text style={styles.percentageText}>{normalizedPercentage}%</Text>
      )}
      <View
        style={[
          styles.background,
          { backgroundColor, height },
        ]}
        testID="progress-bar-background"
      >
        <View
          style={[
            styles.fill,
            {
              width: `${normalizedPercentage}%`,
              backgroundColor: fillColor,
            },
          ]}
          testID="progress-bar-fill"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },
  percentageText: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
});

export default ProgressBar;
