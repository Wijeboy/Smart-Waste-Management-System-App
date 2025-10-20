import React from 'react';
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

const DataCollectionScreen = ({ navigation, onNavigate }) => {
  const binStatusData = [
    { id: 'BIN001', location: 'Zone A', status: 'Collected', time: '03:30', statusColor: '#4CAF50' },
    { id: 'BIN002', location: 'Zone B', status: 'Missed', time: '09:45', statusColor: '#F44336' },
    { id: 'BIN003', location: 'Zone C', status: 'Pending', time: '10:00', statusColor: '#FF9800' },
    { id: 'BIN004', location: 'Zone D', status: 'Collected', time: '11:10', statusColor: '#4CAF50' },
  ];

  const mapPins = [
    { id: 1, color: '#4CAF50', x: 30, y: 40 },
    { id: 2, color: '#4CAF50', x: 70, y: 60 },
    { id: 3, color: '#F44336', x: 50, y: 80 },
    { id: 4, color: '#FF9800', x: 80, y: 30 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Collection</Text>
        <TouchableOpacity>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by bin/route"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <View style={styles.map}>
            {mapPins.map((pin) => (
              <View
                key={pin.id}
                style={[
                  styles.mapPin,
                  {
                    backgroundColor: pin.color,
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bin Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bin Status</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Bin ID</Text>
              <Text style={styles.headerCell}>Location</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Time</Text>
            </View>
            {binStatusData.map((bin, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{bin.id}</Text>
                <Text style={styles.cell}>{bin.location}</Text>
                <View style={[styles.statusCell, { backgroundColor: bin.statusColor }]}>
                  <Text style={styles.statusText}>{bin.status}</Text>
                </View>
                <Text style={styles.cell}>{bin.time}</Text>
              </View>
            ))}
          </View>
          
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>Collection Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '68%' }]} />
            </View>
            <Text style={styles.progressValue}>17</Text>
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
  menuButton: {
    fontSize: 20,
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    margin: dimensions.padding,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    paddingRight: 40,
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  mapContainer: {
    marginHorizontal: dimensions.padding,
    marginBottom: 24,
  },
  map: {
    height: 180,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    position: 'relative',
  },
  mapPin: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
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
  tableContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: colors.surface,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  statusCell: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  statusText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default DataCollectionScreen;
