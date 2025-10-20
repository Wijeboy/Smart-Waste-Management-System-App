/**
 * ReportsScreen Component
 * Displays all bins with CRUD operations and navigation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useBins } from '../../context/BinsContext';
import { useUser } from '../../context/UserContext';
import BinListItem from '../../components/BinListItem';
import RegisterBinModal from '../../components/RegisterBinModal';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * ReportsScreen Component
 * Main screen for viewing and managing all bins
 * @returns {JSX.Element} The ReportsScreen component
 */
const ReportsScreen = ({ navigation }) => {
  const { bins, addBin, updateBin, deleteBin, getAllBinsSorted } = useBins();
  const { getUserDisplayName } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');

  const sortedBins = getAllBinsSorted();
  const userName = getUserDisplayName();

  const handleAddBin = () => {
    setSelectedBin(null);
    setModalVisible(true);
  };

  const handleEditBin = (bin) => {
    setSelectedBin(bin);
    setModalVisible(true);
  };

  const handleDeleteBin = (bin) => {
    Alert.alert(
      'Delete Bin',
      `Are you sure you want to delete ${bin.binId}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBin(bin.id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleModalSubmit = (formData) => {
    if (selectedBin) {
      // Update existing bin
      updateBin(selectedBin.id, formData);
    } else {
      // Add new bin
      addBin(formData);
    }
    setModalVisible(false);
    setSelectedBin(null);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedBin(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation?.navigate('Dashboard');
    } else if (tab === 'profile') {
      navigation?.navigate('Profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Good morning</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
      </View>

      {/* Bins List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>All Bins</Text>
          <Text style={styles.subtitle}>
            {sortedBins.length} bin{sortedBins.length !== 1 ? 's' : ''} registered
          </Text>
        </View>

        {sortedBins.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No bins registered yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to register your first bin
            </Text>
          </View>
        ) : (
          sortedBins.map((bin) => (
            <BinListItem
              key={bin.id}
              bin={bin}
              onEdit={handleEditBin}
              onDelete={handleDeleteBin}
            />
          ))
        )}

        {/* Bottom padding for FAB */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddBin}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Register/Edit Bin Modal */}
      <RegisterBinModal
        visible={modalVisible}
        binData={selectedBin}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  header: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 28,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: FONTS.weight.bold,
  },
});

export default ReportsScreen;
