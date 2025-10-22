/**
 * UserManagementScreen
 * Admin screen for managing users
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import UserCard from '../../components/UserCard';
import apiService from '../../services/api';

const UserManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      setUsers(response.data.users);
      setStats(response.data.stats);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role/status
    if (selectedFilter !== 'all') {
      if (['admin', 'collector', 'user'].includes(selectedFilter)) {
        filtered = filtered.filter(user => user.role === selectedFilter);
      } else if (['active', 'suspended'].includes(selectedFilter)) {
        filtered = filtered.filter(user => user.accountStatus === selectedFilter);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleUserPress = (user) => {
    navigation.navigate('UserDetail', { userId: user._id });
  };

  const handleEditRole = async (user) => {
    Alert.alert(
      'Change Role',
      `Select new role for ${user.firstName} ${user.lastName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'User',
          onPress: () => updateUserRole(user._id, 'user'),
        },
        {
          text: 'Collector',
          onPress: () => updateUserRole(user._id, 'collector'),
        },
        {
          text: 'Admin',
          onPress: () => updateUserRole(user._id, 'admin'),
        },
      ]
    );
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      Alert.alert('Success', 'User role updated successfully');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update user role');
    }
  };

  const handleSuspendUser = async (user) => {
    const action = user.accountStatus === 'suspended' ? 'activate' : 'suspend';
    Alert.alert(
      `${action === 'suspend' ? 'Suspend' : 'Activate'} User`,
      `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'suspend' ? 'Suspend' : 'Activate',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await apiService.suspendUser(user._id);
              Alert.alert('Success', `User ${action}d successfully`);
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', error.message || `Failed to ${action} user`);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteUser(user._id);
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>User Management</Text>
      
      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.collectors}</Text>
            <Text style={styles.statLabel}>Collectors</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        {renderFilterChip('All', 'all')}
        {renderFilterChip('Admins', 'admin')}
        {renderFilterChip('Collectors', 'collector')}
        {renderFilterChip('Users', 'user')}
        {renderFilterChip('Active', 'active')}
        {renderFilterChip('Suspended', 'suspended')}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>👥</Text>
      <Text style={styles.emptyStateText}>No users found</Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? 'Try a different search term' : 'No users match the selected filter'}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => handleUserPress(item)}
            onEdit={handleEditRole}
            onSuspend={handleSuspendUser}
            onDelete={handleDeleteUser}
          />
        )}
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    padding: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipSelected: {
    backgroundColor: COLORS.primaryDarkTeal,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default UserManagementScreen;
