/**
 * BottomNavigation Component
 * Navigation bar with Home, Reports, and Profile tabs
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * BottomNavigation Component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab ('home', 'reports', 'profile')
 * @param {Function} props.onTabChange - Callback when tab is changed
 * @returns {JSX.Element} The BottomNavigation component
 */
const BottomNavigation = ({ activeTab = 'home', onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const handleTabPress = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
            testID={`tab-${tab.id}`}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDarkTeal,
    paddingBottom: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: FONTS.weight.medium,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  labelActive: {
    fontWeight: FONTS.weight.semiBold,
    opacity: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 40,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default BottomNavigation;
