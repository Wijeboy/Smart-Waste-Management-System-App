import React, { useState } from 'react';
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

const AnalysisScreen = ({ navigation, onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('All types');
  const [selectedLocation, setSelectedLocation] = useState('All location');
  const [selectedUsers, setSelectedUsers] = useState('All users');

  const pieChartData = [
    { label: 'direct', value: 45, color: '#4CAF50' },
    { label: 'Referral', value: 30, color: '#2E7D32' },
    { label: 'Social media', value: 15, color: '#66BB6A' },
    { label: 'Email', value: 10, color: '#E8F5E8' },
  ];

  const revenueData = [
    { month: 'Jan', value: 14000 },
    { month: 'Feb', value: 18000 },
    { month: 'Mar', value: 20000 },
    { month: 'Apr', value: 15000 },
    { month: 'Jun', value: 17000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(item => item.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis & Categorization</Text>
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

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <View style={styles.filtersRow}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setSelectedFilter('All types')}
            >
              <Text style={styles.filterText}>{selectedFilter}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setSelectedLocation('All location')}
            >
              <Text style={styles.filterText}>{selectedLocation}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setSelectedUsers('All users')}
            >
              <Text style={styles.filterText}>{selectedUsers}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>

        {/* Pie Chart */}
        <View style={styles.chartSection}>
          <View style={styles.pieChartContainer}>
            <View style={styles.pieChart}>
              {/* Simplified pie chart representation */}
              <View style={styles.pieChartInner}>
                <Text style={styles.pieChartText}>Pie Chart</Text>
                <Text style={styles.pieChartSubtext}>Data Distribution</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Revenue ($)</Text>
          <View style={styles.revenueChartContainer}>
            <View style={styles.revenueChart}>
              {revenueData.map((item, index) => {
                const height = (item.value / maxRevenue) * 100;
                return (
                  <View key={index} style={styles.revenueBarContainer}>
                    <View
                        style={[
                          styles.revenueBar,
                          { height: `${height}%`, backgroundColor: '#4CAF50' }
                        ]}
                    />
                    <Text style={styles.revenueBarLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.revenueYAxis}>
              <Text style={styles.revenueYLabel}>24000</Text>
              <Text style={styles.revenueYLabel}>22000</Text>
              <Text style={styles.revenueYLabel}>16000</Text>
              <Text style={styles.revenueYLabel}>12000</Text>
              <Text style={styles.revenueYLabel}>6000</Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendSection}>
          <View style={styles.legendContainer}>
            {pieChartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigationBar currentScreen="Data" onNavigate={onNavigate} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: dimensions.padding,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: 'bold',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  filtersSection: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  clearFiltersButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartSection: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  pieChartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  pieChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartInner: {
    alignItems: 'center',
  },
  pieChartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  pieChartSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  revenueChartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  revenueChart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  revenueBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  revenueBar: {
    width: 30,
    backgroundColor: colors.success,
    borderRadius: 2,
    marginBottom: 8,
  },
  revenueBarLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  revenueYAxis: {
    width: 40,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  revenueYLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  legendSection: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
});

export default AnalysisScreen;
