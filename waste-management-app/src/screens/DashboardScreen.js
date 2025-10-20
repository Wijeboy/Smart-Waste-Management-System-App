import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';
import BottomNavigationBar from '../components/BottomNavigationBar';

const DashboardScreen = ({ navigation, onNavigate }) => {
  const todaySummary = [
    { icon: '✅', title: 'Bins Collected', value: '9', color: '#4CAF50' },
    { icon: '❌', title: 'Missed Pickups', value: '9', color: '#F44336' },
    { icon: '🛣️', title: 'Routes Covered', value: '8', color: '#2196F3' },
  ];

  const quickActions = [
    { icon: '⊞', label: 'Reports' },
    { icon: '↻', label: 'Analysis' },
    { icon: '🔔', label: 'Alerts' },
    { icon: '〰️', label: 'Performance' },
  ];

  const wasteTrendsData = [
    { category: 'A', value: 80 },
    { category: 'B', value: 120 },
    { category: 'C', value: 140 },
    { category: 'D', value: 160 },
    { category: 'E', value: 180 },
    { category: 'F', value: 200 },
    { category: 'G', value: 220 },
  ];

  const maxValue = Math.max(...wasteTrendsData.map(item => item.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>JS</Text>
          </View>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>John Smith</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Today Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today Summary</Text>
          <View style={styles.summaryCards}>
            {todaySummary.map((item, index) => (
              <View key={index} style={[styles.summaryCard, { borderLeftColor: item.color }]}>
                <Text style={styles.summaryIcon}>{item.icon}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionItem}>
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Waste Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Waste Trends</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {wasteTrendsData.map((item, index) => {
                const height = (item.value / maxValue) * 100;
                return (
                  <View key={index} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${height}%`,
                          backgroundColor: index % 2 === 0 ? '#2196F3' : '#2E7D32',
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{item.category}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.yAxis}>
              <Text style={styles.yAxisLabel}>720</Text>
              <Text style={styles.yAxisLabel}>200</Text>
              <Text style={styles.yAxisLabel}>180</Text>
              <Text style={styles.yAxisLabel}>160</Text>
              <Text style={styles.yAxisLabel}>140</Text>
              <Text style={styles.yAxisLabel}>120</Text>
              <Text style={styles.yAxisLabel}>80</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNavigationBar currentScreen="Home" onNavigate={onNavigate} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.surface,
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    margin: dimensions.padding,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    paddingRight: 40,
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
    color: colors.text,
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 3,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  yAxis: {
    width: 40,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default DashboardScreen;
