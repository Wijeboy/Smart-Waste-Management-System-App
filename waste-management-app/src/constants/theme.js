/**
 * Theme Constants
 * Defines the color palette and typography styles for the application.
 * Ensures brand consistency across all components.
 */

/**
 * Application Color Palette
 * @constant {Object} COLORS
 */
export const COLORS = {
  // Primary Colors
  primaryDarkTeal: '#005257',
  accentGreen: '#34D399',

  // Alert & Priority Colors
  alertRed: '#EF4444',
  highPriorityRed: '#F87171',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',

  // Background Colors
  cardBackground: '#F9FAFB',
  modalBackground: '#FFFFFF',
  lightBackground: '#F0F9FF', // Light blue-gray for screen background
  lightCard: '#FFFFFF', // White for cards on light background
  progressBarBg: '#E5E7EB', // Light gray for progress bar background
  progressBarFill: '#1F2937', // Dark gray/black for filled progress

  // Progress Bar Colors
  progressStart: '#34D399',
  progressEnd: '#6EE7B7', // Lighter green for gradient

  // Icon Colors
  iconTeal: '#14B8A6', // Teal for icons
  iconBlue: '#3B82F6', // Blue for icons
  iconOrange: '#F97316', // Orange for accent/emoji replacement
  iconGreen: '#10B981', // Green for recycling icon
  iconGray: '#6B7280', // Gray for CO2 icon

  // Badge Colors
  badgeHigh: '#DC2626', // Red for high priority badge
  badgeNormal: '#6B7280', // Gray for normal priority

  // Header card colors (for redesigned homepage)
  headerTeal: '#2BA5A0', // Main teal for header card
  headerCompletedBlue: '#4A90E2', // Blue for completed stat card
  headerEfficiencyGreen: '#52C9A8', // Green for efficiency stat card
  appBackground: '#F5F7FA', // Light gray app background
};

/**
 * Typography Configuration
 * @constant {Object} FONTS
 */
export const FONTS = {
  // Font Families
  family: {
    primary: 'Inter',
    fallback: 'Poppins',
  },

  // Font Sizes
  size: {
    heading: 24,      // For main headings (e.g., "Good Morning, Alex!")
    subheading: 18,   // For subheadings (e.g., "Route Management")
    body: 16,         // For body text and list items
    small: 14,        // For secondary text
    caption: 12,      // For captions and smallest text
  },

  // Font Weights
  weight: {
    regular: '400',
    semiBold: '600',
    bold: '700',
  },
};
