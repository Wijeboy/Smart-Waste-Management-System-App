import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';
import { dimensions } from '../../constants/dimensions';
import { mockAnalyticsData } from '../../utils/mockData';
import KPICard from '../../components/KPICard';
import PerformanceCard from '../../components/PerformanceCard';

const KPIsScreen = ({ navigation }) => {
  const { kpis, routePerformance, crewPerformance } = mockAnalyticsData;

  const allKPIs = [
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
      title: 'Collection Efficiency',
      value: `${kpis.collectionEfficiency}%`,
      subtitle: 'Success Rate',
      icon: '📊',
      color: colors.accent,
    },
    {
      title: 'Customer Satisfaction',
      value: `${kpis.customerSatisfaction}/5`,
      subtitle: 'Average Rating',
      icon: '⭐',
      color: colors.success,
    },
    {
      title: 'Recycling Rate',
      value: `${kpis.recyclingRate}%`,
      subtitle: 'Waste Recycled',
      icon: '♻️',
      color: colors.info,
    },
    {
      title: 'Missed Collections',
      value: kpis.missedCollections.toString(),
      subtitle: 'This Month',
      icon: '❌',
      color: colors.error,
    },
    {
      title: 'Contamination Rate',
      value: `${kpis.contaminationRate}%`,
      subtitle: 'Contaminated Waste',
      icon: '⚠️',
      color: colors.warning,
    },
    {
      title: 'Avg Collection Time',
      value: `${kpis.averageCollectionTime}min`,
      subtitle: 'Per Collection',
      icon: '⏱️',
      color: colors.textSecondary,
    },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Key Performance Indicators</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Overview Metrics</Text>
        <View style={styles.kpiGrid}>
          {allKPIs.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </View>

        <PerformanceCard
          title="Route Performance"
          data={routePerformance}
          type="route"
        />

        <PerformanceCard
          title="Crew Performance"
          data={crewPerformance}
          type="crew"
        />

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📈 Performance Trend</Text>
            <Text style={styles.insightText}>
              Collection efficiency has improved by 5% compared to last month, 
              with Route A showing the best performance at 92% efficiency.
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🎯 Focus Areas</Text>
            <Text style={styles.insightText}>
              Contamination rate needs attention at 12.3%. Consider implementing 
              better waste sorting education programs.
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>⭐ Customer Satisfaction</Text>
            <Text style={styles.insightText}>
              Customer satisfaction remains high at 4.2/5. Crew Alpha leads 
              with the highest rating of 4.5 stars.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: colors.surface,
    fontSize: 16,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  content: {
    padding: dimensions.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  insightsSection: {
    marginTop: 20,
  },
  insightCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: dimensions.borderRadius,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default KPIsScreen;
