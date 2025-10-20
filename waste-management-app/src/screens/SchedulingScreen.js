import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, dimensions } from '../constants/colors';

const SchedulingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheduling</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.comingSoon}>Collection Scheduling Module</Text>
        <Text style={styles.description}>
          This module will be implemented by Kumarasinghe S.S (IT22221414)
        </Text>
        <Text style={styles.features}>
          Features will include:
          • Pickup scheduling for residents
          • Different bin types support
          • Service feedback collection
        </Text>
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
    backgroundColor: colors.accent,
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
    flex: 1,
    padding: dimensions.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SchedulingScreen;
