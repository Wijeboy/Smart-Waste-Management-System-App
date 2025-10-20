import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';

const PerformanceCard = ({ title, data, type }) => {
  const renderCrewPerformance = () => (
    <View style={styles.dataContainer}>
      {data.map((crew, index) => (
        <View key={index} style={styles.crewItem}>
          <View style={styles.crewHeader}>
            <Text style={styles.crewName}>{crew.crew}</Text>
            <Text style={styles.crewRating}>⭐ {crew.rating}</Text>
          </View>
          <View style={styles.crewMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Collections</Text>
              <Text style={styles.metricValue}>{crew.collections}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Efficiency</Text>
              <Text style={styles.metricValue}>{crew.efficiency}%</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRoutePerformance = () => (
    <View style={styles.dataContainer}>
      {data.map((route, index) => (
        <View key={index} style={styles.routeItem}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeName}>{route.route}</Text>
            <Text style={styles.routeEfficiency}>{route.efficiency}%</Text>
          </View>
          <View style={styles.routeMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Collections</Text>
              <Text style={styles.metricValue}>{route.collections}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Avg Time</Text>
              <Text style={styles.metricValue}>{route.avgTime}min</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderData = () => {
    switch (type) {
      case 'crew':
        return renderCrewPerformance();
      case 'route':
        return renderRoutePerformance();
      default:
        return <Text style={styles.noData}>No performance data available</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {renderData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: dimensions.padding,
    borderRadius: dimensions.borderRadius,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  dataContainer: {
    gap: 12,
  },
  crewItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  crewName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  crewRating: {
    fontSize: 12,
    color: colors.secondary,
  },
  crewMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  routeEfficiency: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  routeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 20,
  },
});

export default PerformanceCard;
