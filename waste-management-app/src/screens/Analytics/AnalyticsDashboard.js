import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../../constants/colors';
import { dimensions } from '../../constants/dimensions';
import { mockAnalyticsData } from '../../utils/mockData';
import KPICard from '../../components/KPICard';
import ChartCard from '../../components/ChartCard';
import PerformanceCard from '../../components/PerformanceCard';

const { width } = Dimensions.get('window');

const AnalyticsDashboard = ({ navigation }) => {
  const { kpis, collectionTrends, wasteDistribution, routePerformance } = mockAnalyticsData;

  const kpiCards = [
    {
      title: 'Total Collections',
      value: kpis.totalCollections.toLocaleString(),
      subtitle: 'This Month',
      icon: '🗑️',
      color: colors.primary,
    },
    {
      title: 'Waste Collected',
      value: `${(kpis.totalWasteCollected / 1000).toFixed(1)}T`,
      subtitle: 'Total Weight',
      icon: '⚖️',
      color: colors.secondary,
    },
    {
      title: 'Efficiency',
      value: `${kpis.collectionEfficiency}%`,
      subtitle: 'Collection Rate',
      icon: '📊',
      color: colors.accent,
    },
    {
      title: 'Satisfaction',
      value: `${kpis.customerSatisfaction}/5`,
      subtitle: 'Customer Rating',
      icon: '⭐',
      color: colors.success,
    },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Waste Management Overview</Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </View>

      {/* Charts Section */}
      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Collection Trends</Text>
        <ChartCard
          title="Daily Collections"
          data={collectionTrends.daily}
          type="line"
          color={colors.primary}
        />
      </View>

      {/* Waste Distribution */}
      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Waste Type Distribution</Text>
        <ChartCard
          title="Waste Categories"
          data={wasteDistribution}
          type="pie"
          color={colors.accent}
        />
      </View>

      {/* Route Performance */}
      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Route Performance</Text>
        <ChartCard
          title="Collection Efficiency by Route"
          data={routePerformance}
          type="bar"
          color={colors.secondary}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.actionButtonText}>📊 Generate Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('KPIs')}
          >
            <Text style={styles.actionButtonText}>📈 View KPIs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    padding: dimensions.padding,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: dimensions.padding,
    justifyContent: 'space-between',
  },
  chartsSection: {
    padding: dimensions.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  actionsSection: {
    padding: dimensions.padding,
    paddingBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: dimensions.borderRadius,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnalyticsDashboard;
