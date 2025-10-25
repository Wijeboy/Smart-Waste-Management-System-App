/**
 * UserDetailScreen
 * Detailed view of a user with edit capabilities
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import apiService from '../../services/api';

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserById(userId);
      setUser(response.data.user);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch user details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      `Select new role for ${user.firstName} ${user.lastName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'User',
          onPress: () => updateUserRole('user'),
        },
        {
          text: 'Collector',
          onPress: () => updateUserRole('collector'),
        },
        {
          text: 'Admin',
          onPress: () => updateUserRole('admin'),
        },
      ]
    );
  };

  const updateUserRole = async (newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      Alert.alert('Success', 'User role updated successfully');
      fetchUserDetails();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update user role');
    }
  };

  const handleToggleSuspend = async () => {
    const action = user.accountStatus === 'suspended' ? 'activate' : 'suspend';
    Alert.alert(
      `${action === 'suspend' ? 'Suspend' : 'Activate'} User`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'suspend' ? 'Suspend' : 'Activate',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await apiService.suspendUser(userId);
              Alert.alert('Success', `User ${action}d successfully`);
              fetchUserDetails();
            } catch (error) {
              Alert.alert('Error', error.message || `Failed to ${action} user`);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = () => {
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
              await apiService.deleteUser(userId);
              Alert.alert('Success', 'User deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return '#EF4444';
      case 'collector':
        return '#3B82F6';
      case 'user':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'suspended':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
          <Text style={styles.loadingText}>Loading user details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Details</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, { backgroundColor: getRoleBadgeColor(user.role) }]}>
              <Text style={styles.badgeText}>{user.role}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusBadgeColor(user.accountStatus || 'active') }]}>
              <Text style={styles.badgeText}>{user.accountStatus || 'active'}</Text>
            </View>
          </View>
        </View>

        {/* User Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.card}>
            <InfoRow label="Username" value={`@${user.username}`} />
            <Divider />
            <InfoRow label="Email" value={user.email} />
            <Divider />
            <InfoRow label="Phone" value={user.phoneNo || 'N/A'} />
            <Divider />
            <InfoRow label="NIC" value={user.nic || 'N/A'} />
            <Divider />
            <InfoRow
              label="Date of Birth"
              value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
            />
            <Divider />
            <InfoRow label="Address" value={user.address || 'N/A'} />
          </View>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.card}>
            <InfoRow label="Role" value={user.role} />
            <Divider />
            <InfoRow label="Status" value={user.accountStatus || 'active'} />
            <Divider />
            <InfoRow label="Active" value={user.isActive ? 'Yes' : 'No'} />
            <Divider />
            <InfoRow
              label="Created"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <Divider />
            <InfoRow
              label="Last Login"
              value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangeRole}
          >
            <Text style={styles.actionButtonIcon}>👤</Text>
            <Text style={styles.actionButtonText}>Change Role</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              user.accountStatus === 'suspended' && styles.actionButtonSuccess,
            ]}
            onPress={handleToggleSuspend}
          >
            <Text style={styles.actionButtonIcon}>
              {user.accountStatus === 'suspended' ? '✅' : '🚫'}
            </Text>
            <Text style={styles.actionButtonText}>
              {user.accountStatus === 'suspended' ? 'Activate User' : 'Suspend User'}
            </Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteUser}
          >
            <Text style={styles.dangerButtonIcon}>🗑️</Text>
            <Text style={styles.dangerButtonText}>Delete User</Text>
            <Text style={styles.dangerButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primaryDarkTeal,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
  },
  userName: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    textTransform: 'capitalize',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: FONTS.weight.semiBold,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: FONTS.weight.regular,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonSuccess: {
    backgroundColor: '#D1FAE5',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  actionButtonArrow: {
    fontSize: 20,
    color: '#6B7280',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#EF4444',
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  dangerButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dangerButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#EF4444',
  },
  dangerButtonArrow: {
    fontSize: 20,
    color: '#EF4444',
  },
});

export default UserDetailScreen;
