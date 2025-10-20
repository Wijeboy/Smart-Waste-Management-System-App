import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';

const { width } = Dimensions.get('window');

const ChartCard = ({ title, data, type, color }) => {
  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(item => item.collections || item.waste));
    const chartWidth = width - 80;
    const chartHeight = 120;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {data.map((item, index) => {
            const height = ((item.collections || item.waste) / maxValue) * chartHeight;
            const x = (index / (data.length - 1)) * chartWidth;
            
            return (
              <View key={index} style={styles.dataPointContainer}>
                <View
                  style={[
                    styles.dataPoint,
                    {
                      height: height,
                      backgroundColor: color,
                      left: x,
                    },
                  ]}
                />
                <Text style={styles.dataLabel}>
                  {item.date ? item.date.split('-')[2] : item.week ? item.week.split(' ')[1] : item.month}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <Text style={styles.legendText}>
            {data[0]?.collections ? 'Collections' : 'Waste (kg)'}
          </Text>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    return (
      <View style={styles.pieContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => {
            const angle = (item.percentage / 100) * 360;
            const startAngle = data.slice(0, index).reduce((sum, prev) => sum + (prev.percentage / 100) * 360, 0);
            
            return (
              <View key={index} style={styles.pieSegment}>
                <View style={[styles.pieSlice, { backgroundColor: item.color }]} />
                <Text style={styles.pieLabel}>{item.type}</Text>
                <Text style={styles.piePercentage}>{item.percentage}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.efficiency));
    
    return (
      <View style={styles.barContainer}>
        {data.map((item, index) => {
          const height = (item.efficiency / maxValue) * 100;
          
          return (
            <View key={index} style={styles.barItem}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: height,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.route}</Text>
              <Text style={styles.barValue}>{item.efficiency}%</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'bar':
        return renderBarChart();
      default:
        return <Text style={styles.noData}>No chart data available</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>
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
  chartWrapper: {
    minHeight: 150,
  },
  chartContainer: {
    height: 150,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dataPointContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dataPoint: {
    width: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pieContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  pieSegment: {
    alignItems: 'center',
    marginBottom: 8,
  },
  pieSlice: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  pieLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  piePercentage: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 10,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 50,
  },
});

export default ChartCard;
