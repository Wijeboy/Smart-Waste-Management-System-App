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

const DataProcessingScreen = ({ navigation, onNavigate }) => {
  const progressSteps = [
    { id: 1, title: 'Data Cleaning', completed: true, icon: '✅' },
    { id: 2, title: 'Duplicate Removal', completed: true, icon: '✅' },
    { id: 3, title: 'Unit Standardiza...', completed: true, icon: '✅' },
    { id: 4, title: 'Review & Submit', completed: false, icon: '☐' },
  ];

  const logEntries = [
    { time: '8:24 AM', message: 'cleaned for duplicates', status: 'success', icon: '✅' },
    { time: '8:32 AM', message: 'Measuring units standardized', status: 'success', icon: '✅' },
    { time: '8:45 AM', message: 'Missing values detected in', status: 'error', icon: 'A' },
    { time: '9:30 AM', message: 'Data validation completed', status: 'success', icon: '✅' },
    { time: '10:02 AM', message: 'Outliers identified in measurements', status: 'success', icon: '✅' },
  ];

  const metricsData = [
    { category: 'A', value: 1300 },
    { category: 'B', value: 800 },
    { category: 'C', value: 1000 },
    { category: 'D', value: 1000 },
    { category: 'E', value: 500 },
  ];

  const maxValue = Math.max(...metricsData.map(item => item.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Processing</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Track Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <View style={styles.stepsContainer}>
            {progressSteps.map((step) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={[
                  styles.stepIcon,
                  { backgroundColor: step.completed ? colors.success : colors.border }
                ]}>
                  <Text style={styles.stepIconText}>{step.icon}</Text>
                </View>
                <Text style={[
                  styles.stepTitle,
                  { color: step.completed ? colors.text : colors.textSecondary }
                ]}>
                  {step.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Log Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log</Text>
          <View style={styles.logContainer}>
            {logEntries.map((entry, index) => (
              <View key={index} style={styles.logEntry}>
                <View style={[
                  styles.logIcon,
                  { backgroundColor: entry.status === 'success' ? colors.success : colors.error }
                ]}>
                  <Text style={styles.logIconText}>{entry.icon}</Text>
                </View>
                <View style={styles.logContent}>
                  <Text style={styles.logTime}>{entry.time}</Text>
                  <Text style={styles.logMessage}>{entry.message}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Processing Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Processing Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Records Processed</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chart}>
                {metricsData.map((item, index) => {
                  const height = (item.value / maxValue) * 100;
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${height}%`,
                            backgroundColor: colors.primary,
                          },
                        ]}
                      />
                      <Text style={styles.barLabel}>{item.category}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>1500</Text>
                <Text style={styles.yAxisLabel}>1000</Text>
                <Text style={styles.yAxisLabel}>500</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
            </View>
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
  section: {
    margin: dimensions.padding,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIconText: {
    fontSize: 16,
    color: colors.surface,
  },
  stepTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  logContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logIconText: {
    fontSize: 12,
    color: colors.surface,
  },
  logContent: {
    flex: 1,
  },
  logTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  logMessage: {
    fontSize: 14,
    color: colors.text,
  },
  metricsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  legend: {
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  yAxis: {
    width: 30,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

export default DataProcessingScreen;
