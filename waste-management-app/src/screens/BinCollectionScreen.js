import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, dimensions } from '../constants/colors';

const BinCollectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bin Collection</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.comingSoon}>Bin Collection Module</Text>
        <Text style={styles.description}>
          This module will be implemented by Athulathmudali A.L.M (IT21129544)
        </Text>
        <Text style={styles.features}>
          Features will include:
          • Route viewing for collection crews
          • Digital bin collection recording
          • Exception reporting
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
    backgroundColor: colors.secondary,
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

export default BinCollectionScreen;
