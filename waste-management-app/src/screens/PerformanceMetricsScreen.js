import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';
import BottomNavigationBar from '../components/BottomNavigationBar';

const PerformanceMetricsScreen = ({ navigation, onNavigate }) => {
  const kpiData = [
    { label: 'Waste Collected', value: '1,240 kg' },
    { label: 'Routes Completed', value: '24' },
    { label: 'Avg Collection Time', value: '42 min' },
  ];

  const trendsData = [
    { day: 'Mon', value: 140 },
    { day: 'Tue', value: 210 },
    { day: 'Wed', value: 170 },
    { day: 'Thu', value: 260 },
    { day: 'Fri', value: 220 },
    { day: 'Sat', value: 280 },
    { day: 'Sun', value: 260 },
  ];

  const additionalKPIs = [
    { title: 'Uptime %', value: '98.7 %', icon: '📊' },
    { title: 'Avg Route Time', value: '32 min', icon: '⏱️' },
    { title: 'Recycle Rate', value: '76 %', icon: '♻️' },
  ];

  const maxTrendValue = Math.max(...trendsData.map(item => item.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Metrics</Text>
        <TouchableOpacity>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Performance Indicators */}
        <View style={styles.kpiSection}>
          <View style={styles.kpiRow}>
            {kpiData.map((kpi, index) => (
              <View key={index} style={styles.kpiItem}>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trends Over Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends Over Time</Text>
          <View style={styles.trendsChartContainer}>
            <View style={styles.trendsChart}>
              {trendsData.map((item, index) => {
                const height = (item.value / maxTrendValue) * 100;
                return (
                  <View key={index} style={styles.trendBarContainer}>
                    <View
                      style={[
                        styles.trendBar,
                        { height: `${height}%` }
                      ]}
                    />
                    <Text style={styles.trendBarLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.trendsYAxis}>
              <Text style={styles.trendsYLabel}>300</Text>
              <Text style={styles.trendsYLabel}>250</Text>
              <Text style={styles.trendsYLabel}>200</Text>
              <Text style={styles.trendsYLabel}>150</Text>
              <Text style={styles.trendsYLabel}>100</Text>
            </View>
          </View>
        </View>

        {/* Waste Density Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Waste Density Map</Text>
          <View style={styles.mapContainer}>
            <Text style={styles.mapPlaceholder}>Heatmap Visualization</Text>
          </View>
        </View>

        {/* Additional KPIs */}
        <View style={styles.section}>
          <View style={styles.additionalKPIsContainer}>
            {additionalKPIs.map((kpi, index) => (
              <View key={index} style={styles.additionalKPI}>
                <Text style={styles.additionalKPIIcon}>{kpi.icon}</Text>
                <Text style={styles.additionalKPITitle}>{kpi.title}</Text>
                <Text style={styles.additionalKPIValue}>{kpi.value}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  closeButton: {
    fontSize: 20,
    color: colors.surface,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  kpiSection: {
    margin: dimensions.padding,
    marginBottom: 24,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  kpiLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
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
  trendsChartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  trendsChart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  trendBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  trendBar: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: 8,
  },
  trendBarLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  trendsYAxis: {
    width: 30,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  trendsYLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  mapContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  additionalKPIsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  additionalKPI: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  additionalKPIIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  additionalKPITitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  additionalKPIValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});

export default PerformanceMetricsScreen;
