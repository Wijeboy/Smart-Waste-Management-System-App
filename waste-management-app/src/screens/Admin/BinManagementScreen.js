/**
 * BinManagementScreen
 * Admin screen for managing all bins in the system
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useBins } from '../../context/BinsContext';
import RegisterBinModal from '../../components/RegisterBinModal';

const BinManagementScreen = ({ navigation }) => {
  const { bins, loading, addBin, updateBin, deleteBin, fetchBins } = useBins();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);

  useEffect(() => {
    loadBins();
  }, []);

  const loadBins = async () => {
    await fetchBins();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBins();
    setRefreshing(false);
  };

  const getFilteredBins = () => {
    let filtered = bins;

    // Apply filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'active') {
        filtered = filtered.filter(bin => bin.status === 'active');
      } else if (selectedFilter === 'full') {
        filtered = filtered.filter(bin => bin.status === 'full');
      } else if (selectedFilter === 'maintenance') {
        filtered = filtered.filter(bin => bin.status === 'maintenance');
      } else {
        // Filter by bin type
        filtered = filtered.filter(bin => bin.binType === selectedFilter);
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(bin =>
        bin.binId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.zone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredBins = getFilteredBins();

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
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteBin(bin._id);
            if (result.success) {
              Alert.alert('Success', 'Bin deleted successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to delete bin');
            }
          },
        },
      ]
    );
  };

  const handleModalSubmit = async (formData) => {
    if (selectedBin) {
      // Update existing bin
      const result = await updateBin(selectedBin._id, formData);
      if (result.success) {
        Alert.alert('Success', 'Bin updated successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to update bin');
      }
    } else {
      // Add new bin
      const result = await addBin(formData);
      if (result.success) {
        Alert.alert('Success', 'Bin created successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to create bin');
      }
    }
    setModalVisible(false);
    setSelectedBin(null);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedBin(null);
  };

  const renderFilterChip = (label, value) => {
    const isSelected = selectedFilter === value;
    return (
      <TouchableOpacity
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => setSelectedFilter(value)}
      >
        <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'full':
        return '#EF4444';
      case 'maintenance':
        return '#F59E0B';
      case 'inactive':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'General Waste':
        return '#6B7280';
      case 'Recyclable':
        return '#3B82F6';
      case 'Organic':
        return '#10B981';
      case 'Hazardous':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderBinCard = ({ item: bin }) => (
    <View style={styles.binCard}>
      <View style={styles.binHeader}>
        <View>
          <Text style={styles.binId}>{bin.binId}</Text>
          <Text style={styles.binLocation}>{bin.location}</Text>
        </View>
        <View style={styles.binBadges}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bin.status) }]}>
            <Text style={styles.badgeText}>{bin.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.binDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Zone:</Text>
          <Text style={styles.detailValue}>{bin.zone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(bin.binType) }]}>
            <Text style={styles.typeBadgeText}>{bin.binType}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fill Level:</Text>
          <View style={styles.fillLevelContainer}>
            <View style={styles.fillLevelBar}>
              <View 
                style={[
                  styles.fillLevelProgress, 
                  { 
                    width: `${bin.fillLevel}%`,
                    backgroundColor: bin.fillLevel >= 85 ? '#EF4444' : bin.fillLevel >= 70 ? '#F59E0B' : '#10B981'
                  }
                ]} 
              />
            </View>
            <Text style={styles.fillLevelText}>{bin.fillLevel}%</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Capacity:</Text>
          <Text style={styles.detailValue}>{bin.capacity} kg</Text>
        </View>
      </View>

      <View style={styles.binActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditBin(bin)}
        >
          <Text style={styles.actionButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBin(bin)}
        >
          <Text style={styles.actionButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bin Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBin}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bins..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        {renderFilterChip('All', 'all')}
        {renderFilterChip('Active', 'active')}
        {renderFilterChip('Full', 'full')}
        {renderFilterChip('Maintenance', 'maintenance')}
      </View>
      <View style={styles.filtersContainer}>
        {renderFilterChip('General', 'General Waste')}
        {renderFilterChip('Recyclable', 'Recyclable')}
        {renderFilterChip('Organic', 'Organic')}
        {renderFilterChip('Hazardous', 'Hazardous')}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredBins.length} bin{filteredBins.length !== 1 ? 's' : ''} found
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🗑️</Text>
      <Text style={styles.emptyStateText}>No bins found</Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery.trim() || selectedFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Create your first bin to get started'}
      </Text>
    </View>
  );

  if (loading && !refreshing && bins.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading bins...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredBins}
        renderItem={renderBinCard}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primaryDarkTeal]}
          />
        }
      />

      {/* Register/Edit Bin Modal */}
      <RegisterBinModal
        visible={modalVisible}
        binData={selectedBin}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.primaryDarkTeal,
  },
  title: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  filterChipSelected: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderColor: COLORS.primaryDarkTeal,
  },
  filterChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: FONTS.weight.semiBold,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  resultsCount: {
    paddingHorizontal: 16,
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  binId: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  binLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  binBadges: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  binDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FONTS.weight.semiBold,
  },
  fillLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  fillLevelBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fillLevelProgress: {
    height: '100%',
    borderRadius: 4,
  },
  fillLevelText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
  binActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
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
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BinManagementScreen;
