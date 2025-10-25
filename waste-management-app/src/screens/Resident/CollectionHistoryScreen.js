/**
 * Collection History Screen
 * Displays all bin collections for the resident with search and filter
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiService from '../../services/api';
import { COLORS, FONTS } from '../../constants/theme';
import CollectionHistoryCard from '../../components/CollectionHistoryCard';

const CollectionHistoryScreen = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBin, setSelectedBin] = useState('all');
  const [bins, setBins] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCollectionHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [collections, searchTerm, selectedBin]);

  const fetchCollectionHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getResidentCollectionHistory();
      setCollections(response.data || []);
      
      // Extract unique bins for filter dropdown
      const uniqueBins = [...new Set(response.data.map(c => c.binId))];
      setBins(uniqueBins);
    } catch (error) {
      console.error('Error fetching collection history:', error);
      Alert.alert('Error', 'Failed to load collection history');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCollectionHistory();
    setRefreshing(false);
  }, []);

  const applyFilters = () => {
    let filtered = [...collections];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.binId.toLowerCase().includes(term) ||
        c.collectorName.toLowerCase().includes(term) ||
        c.binLocation.toLowerCase().includes(term) ||
        c.routeName.toLowerCase().includes(term)
      );
    }

    // Apply bin filter
    if (selectedBin !== 'all') {
      filtered = filtered.filter(c => c.binId === selectedBin);
    }

    setFilteredCollections(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBin('all');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by bin, collector, location, or route..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={COLORS.iconGray}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterButtonText}>
          🔽 Filters {selectedBin !== 'all' ? '(1)' : ''}
        </Text>
      </TouchableOpacity>

      {/* Filter Section */}
      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Bin:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBin}
              onValueChange={(value) => setSelectedBin(value)}
              style={styles.picker}
            >
              <Picker.Item label="All Bins" value="all" />
              {bins.map(binId => (
                <Picker.Item key={binId} label={binId} value={binId} />
              ))}
            </Picker>
          </View>

          {(selectedBin !== 'all' || searchTerm) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Collections Found</Text>
      <Text style={styles.emptyText}>
        {searchTerm || selectedBin !== 'all'
          ? 'Try adjusting your search or filters'
          : 'Your collection history will appear here'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
        <Text style={styles.loadingText}>Loading collection history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCollections}
        renderItem={({ item }) => <CollectionHistoryCard collection={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primaryDarkTeal]}
            tintColor={COLORS.primaryDarkTeal}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
  loadingText: {
    marginTop: 12,
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },
  header: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
    paddingVertical: 8,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.iconGray,
    paddingLeft: 8,
  },
  filterButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    textAlign: 'center',
  },
  filterSection: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.iconOrange,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  clearFiltersText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    textAlign: 'center',
  },
  resultsContainer: {
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default CollectionHistoryScreen;
