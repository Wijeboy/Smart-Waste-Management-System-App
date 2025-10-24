/**
 * Settings Screen
 * Allows residents to view and edit profile, change password, and logout
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS } from '../../constants/theme';
import ResidentEditProfileModal from '../../components/ResidentEditProfileModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const SettingsScreen = ({ navigation }) => {
  const { user } = useUser();
  const { logout, refreshUserData } = useAuth();
  
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleProfileUpdate = async (updatedUserData) => {
    // Update the user data in AuthContext to reflect changes immediately
    if (updatedUserData) {
      try {
        await refreshUserData(updatedUserData);
        console.log('Profile updated and context refreshed:', updatedUserData);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
    setEditProfileModalVisible(false);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.alertRed} />
          ) : (
            <>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.profileCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.firstName?.charAt(0).toUpperCase() || 'U'}
                  {user.lastName?.charAt(0).toUpperCase() || ''}
                </Text>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone || 'Not provided'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Resident</Text>
                </View>
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditProfileModalVisible(true)}
            >
              <Text style={styles.editIcon}>✏️</Text>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          
          <TouchableOpacity
            style={styles.securityCard}
            onPress={() => navigation.navigate('CreditPoints')}
          >
            <View style={styles.securityIconContainer}>
              <Text style={styles.securityIcon}>🎁</Text>
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Credit Points</Text>
              <Text style={styles.securityDescription}>
                View your credit points and recent collections
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity
            style={styles.securityCard}
            onPress={() => setChangePasswordModalVisible(true)}
          >
            <View style={styles.securityIconContainer}>
              <Text style={styles.securityIcon}>🔒</Text>
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Change Password</Text>
              <Text style={styles.securityDescription}>
                Update your password to keep your account secure
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>App Version</Text>
              <Text style={styles.appInfoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Account Type</Text>
              <Text style={styles.appInfoValue}>Resident</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Member Since</Text>
              <Text style={styles.appInfoValue}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>

      {/* Modals */}
      <ResidentEditProfileModal
        visible={editProfileModalVisible}
        onClose={handleProfileUpdate}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.lightCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.progressBarBg,
  },
  headerTitle: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.alertRed + '10',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  logoutText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.alertRed,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
    fontWeight: FONTS.weight.medium,
  },
  infoValue: {
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.progressBarBg,
  },
  roleBadge: {
    backgroundColor: COLORS.accentGreen + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: FONTS.size.small,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.semiBold,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 8,
    paddingVertical: 12,
  },
  editIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  securityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryDarkTeal + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityIcon: {
    fontSize: 24,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    lineHeight: 18,
  },
  arrowIcon: {
    fontSize: 32,
    color: COLORS.iconGray,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  appInfoLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
  },
  appInfoValue: {
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
  },
  footer: {
    height: 20,
  },
});

export default SettingsScreen;
