import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';

const BottomNavigationBar = ({ currentScreen, onNavigate, navigation }) => {
  const navItems = [
    { id: 'Home', icon: '🏠', label: 'Home', screen: 'Dashboard' },
    { id: 'Data', icon: '📊', label: 'Data', screen: 'DataCollection' },
    { id: 'Reports', icon: '📋', label: 'Reports', screen: 'AnalyticsReport' },
    { id: 'Profile', icon: '👤', label: 'Profile', screen: 'Profile' },
  ];

  const handleNavigate = (item) => {
    // Support both navigation patterns: React Navigation and state-based
    if (navigation && navigation.navigate) {
      navigation.navigate(item.screen);
    } else if (onNavigate) {
      onNavigate(item.id);
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => handleNavigate(item)}
        >
          <Text style={[
            styles.navIcon,
            currentScreen === item.id && styles.activeIcon
          ]}>
            {item.icon}
          </Text>
          <Text style={[
            styles.navLabel,
            currentScreen === item.id && styles.activeLabel
          ]}>
            {item.label}
          </Text>
          {currentScreen === item.id && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1B5E20',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: colors.surface,
    opacity: 0.7,
  },
  navLabel: {
    fontSize: 12,
    color: colors.surface,
    opacity: 0.7,
    fontWeight: '500',
  },
  activeIcon: {
    opacity: 1,
  },
  activeLabel: {
    opacity: 1,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default BottomNavigationBar;
