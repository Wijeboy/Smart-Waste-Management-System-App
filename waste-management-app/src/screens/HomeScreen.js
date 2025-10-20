import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, dimensions } from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Waste Management</Text>
        <Text style={styles.headerSubtitle}>Choose a module to access</Text>
      </View>
      
      <View style={styles.modulesContainer}>
        <TouchableOpacity 
          style={[styles.moduleCard, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AnalyticsDashboard')}
        >
          <Text style={styles.moduleIcon}>📊</Text>
          <Text style={styles.moduleTitle}>Analytics & Reporting</Text>
          <Text style={styles.moduleSubtitle}>Data insights and reports</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.moduleCard, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate('BinCollection')}
        >
          <Text style={styles.moduleIcon}>🗑️</Text>
          <Text style={styles.moduleTitle}>Bin Collection</Text>
          <Text style={styles.moduleSubtitle}>Collection management</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.moduleCard, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('Scheduling')}
        >
          <Text style={styles.moduleIcon}>📅</Text>
          <Text style={styles.moduleTitle}>Scheduling</Text>
          <Text style={styles.moduleSubtitle}>Pickup scheduling</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.moduleCard, { backgroundColor: colors.success }]}
          onPress={() => navigation.navigate('Payments')}
        >
          <Text style={styles.moduleIcon}>💳</Text>
          <Text style={styles.moduleTitle}>Payments</Text>
          <Text style={styles.moduleSubtitle}>Billing and rewards</Text>
        </TouchableOpacity>
      </View>
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
    padding: dimensions.padding,
    paddingTop: 50,
    alignItems: 'center',
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
  modulesContainer: {
    flex: 1,
    padding: dimensions.padding,
  },
  modulesContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  moduleCard: {
    padding: 20,
    borderRadius: dimensions.borderRadius,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
  },
});

export default HomeScreen;
