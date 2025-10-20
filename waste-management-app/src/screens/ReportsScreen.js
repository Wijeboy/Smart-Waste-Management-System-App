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
import { mockDatabase, getCollectionStats, getUncollectedBins, getPatternAnalysis } from '../data/mockDatabase';

const ReportsScreen = ({ navigation, onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState('operational');
  const [selectedExport, setSelectedExport] = useState('CSV');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const tabs = ['operational', 'Billing', 'Recycling'];
  const exportFormats = ['PDF', 'CSV', 'Excel'];
  const periods = ['daily', 'weekly', 'monthly'];

  // Get current date for daily stats
  const currentDate = '2024-02-15';
  const dailyStats = getCollectionStats(currentDate);
  const uncollectedBins = getUncollectedBins(currentDate);
  const patternAnalysis = getPatternAnalysis();

  // Generate 7-day data for line chart
  const reportData = [
    { day: 'Mon', value: 135, date: '2024-02-13' },
    { day: 'Tue', value: 325, date: '2024-02-14' },
    { day: 'Wed', value: 315, date: '2024-02-15' },
    { day: 'Thu', value: 280, date: '2024-02-16' },
    { day: 'Fri', value: 290, date: '2024-02-17' },
    { day: 'Sat', value: 250, date: '2024-02-18' },
    { day: 'Sun', value: 200, date: '2024-02-19' },
  ];

  const maxReportValue = Math.max(...reportData.map(item => item.value));

  // Calculate collection statistics
  const totalRegisteredBins = mockDatabase.bins.length;
  const totalRegisteredTrucks = mockDatabase.trucks.filter(truck => truck.status === 'active').length;
  const collectionRate = (dailyStats.totalBinsCollected / totalRegisteredBins) * 100;

  // Bin status distribution
  const binStatusData = [
    { label: 'Collected', value: dailyStats.totalBinsCollected, color: '#4CAF50' },
    { label: 'Uncollected', value: uncollectedBins.length, color: '#F44336' },
    { label: 'Pending', value: Math.max(0, totalRegisteredBins - dailyStats.totalBinsCollected - uncollectedBins.length), color: '#FF9800' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Export Options */}
        <View style={styles.exportContainer}>
          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.exportButton,
                selectedExport === format && styles.activeExportButton
              ]}
              onPress={() => setSelectedExport(format)}
            >
              <Text style={[
                styles.exportText,
                selectedExport === format && styles.activeExportText
              ]}>
                {format}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Date</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>City</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>route</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterIconButton}>
              <Text style={styles.filterIcon}>🔽</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Report View */}
        <View style={styles.reportSection}>
          <Text style={styles.reportTitle}>Waste Collection Report - {currentDate}</Text>
          
          {/* Key Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Total Bins Collected</Text>
                <Text style={styles.metricValue}>{dailyStats.totalBinsCollected}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Total Weight (kg)</Text>
                <Text style={styles.metricValue}>{dailyStats.totalWeight}</Text>
              </View>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Collection Rate</Text>
                <Text style={styles.metricValue}>{collectionRate.toFixed(1)}%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Routes Covered</Text>
                <Text style={styles.metricValue}>{dailyStats.totalRoutes}</Text>
              </View>
            </View>
          </View>

          {/* 7-Day Weight Trend Chart */}
          <Text style={styles.chartTitle}>7-Day Waste Collection Trend (kg)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {reportData.map((item, index) => {
                const height = (item.value / maxReportValue) * 100;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View
                        style={[
                          styles.chartBar,
                          { height: `${height}%`, backgroundColor: '#2E7D32' }
                        ]}
                    />
                    <Text style={styles.chartBarLabel}>{item.day}</Text>
                    <Text style={styles.chartValueLabel}>{item.value}kg</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartYAxis}>
              <Text style={styles.chartYLabel}>350</Text>
              <Text style={styles.chartYLabel}>300</Text>
              <Text style={styles.chartYLabel}>250</Text>
              <Text style={styles.chartYLabel}>200</Text>
              <Text style={styles.chartYLabel}>150</Text>
              <Text style={styles.chartYLabel}>100</Text>
            </View>
          </View>

          {/* Pattern Analysis Alert */}
          {patternAnalysis.isSignificant && (
            <View style={styles.alertContainer}>
              <Text style={styles.alertTitle}>⚠️ Pattern Change Detected</Text>
              <Text style={styles.alertText}>
                Waste collection {patternAnalysis.trend} by {Math.abs(patternAnalysis.weightChange).toFixed(1)}% this week
              </Text>
            </View>
          )}

          {/* Bin Status Distribution */}
          <Text style={styles.chartTitle}>Bin Collection Status</Text>
          <View style={styles.pieChartContainer}>
            <View style={styles.pieChart}>
              <Text style={styles.pieChartText}>Status</Text>
            </View>
            <View style={styles.dataTextContainer}>
              {binStatusData.map((item, index) => (
                <View key={index} style={styles.statusItem}>
                  <View style={[styles.statusColor, { backgroundColor: item.color }]} />
                  <Text style={styles.statusText}>{item.label}: {item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* System Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>System Summary</Text>
            <Text style={styles.summaryText}>
              • Registered Bins: {totalRegisteredBins}{'\n'}
              • Active Trucks: {totalRegisteredTrucks}{'\n'}
              • Collection Efficiency: {dailyStats.collectionEfficiency.toFixed(1)}%{'\n'}
              • Average Weight per Bin: {dailyStats.averageWeightPerBin.toFixed(1)}kg
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>⬇️</Text>
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>👁️</Text>
            <Text style={styles.actionButtonText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📤</Text>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigationBar currentScreen="Reports" onNavigate={onNavigate} navigation={navigation} />
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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: dimensions.padding,
    marginTop: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  exportContainer: {
    flexDirection: 'row',
    marginHorizontal: dimensions.padding,
    marginBottom: 20,
  },
  exportButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeExportButton: {
    backgroundColor: colors.primary,
  },
  exportText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeExportText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  filtersContainer: {
    marginHorizontal: dimensions.padding,
    marginBottom: 20,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
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
  filterIconButton: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 16,
    color: colors.text,
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
  reportSection: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 16,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 24,
    backgroundColor: '#2E7D32',
    borderRadius: 3,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  chartYAxis: {
    width: 40,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartYLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  additionalDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pieChartContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pieChart: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartText: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: 'bold',
  },
  dataTextContainer: {
    flex: 1,
  },
  dataText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 4,
  },
  viewMoreArrow: {
    fontSize: 10,
    color: colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: dimensions.padding,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  // New styles for enhanced reports
  metricsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  chartValueLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  alertContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    color: '#856404',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default ReportsScreen;
