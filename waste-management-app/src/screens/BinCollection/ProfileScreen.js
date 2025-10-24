/**
 * ProfileScreen Component
 * User profile with settings and device status
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
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import EditProfileModal from '../../components/EditProfileModal';
import SettingsToggle from '../../components/SettingsToggle';
import DeviceStatusCard from '../../components/DeviceStatusCard';
import PostRouteSummaryModal from '../../components/PostRouteSummaryModal';
import apiService from '../../services/api';
import { downloadRouteReport, loadSavedRouteReport } from '../../utils/reportGenerator';

/**
 * ProfileScreen Component
 * Main screen for user profile and settings
 * @returns {JSX.Element} The ProfileScreen component
 */
const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, updateSetting } = useUser();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [completedRoutes, setCompletedRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteSummary, setShowRouteSummary] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const result = await updateProfile(formData);
      
      if (result && result.success) {
        setModalVisible(false);
        Alert.alert(
          'Success',
          'Your profile has been updated successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          result?.error || 'Failed to update profile. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

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
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation?.navigate('Dashboard');
    } else if (tab === 'reports') {
      navigation?.navigate('Reports');
    }
  };

  // Load completed routes on mount
  useEffect(() => {
    if (user?.role === 'collector') {
      loadCompletedRoutes();
    }
  }, [user]);

  const loadCompletedRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await apiService.getCompletedRoutes();
      if (response.data && response.data.routes) {
        setCompletedRoutes(response.data.routes);
      }
    } catch (error) {
      console.error('Error loading completed routes:', error);
      // Routes will be empty, user can still access locally saved ones
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleViewRouteSummary = async (route) => {
    setSelectedRoute(route);
    setShowRouteSummary(true);
  };

  const handleDownloadReport = async () => {
    if (!selectedRoute) return;

    try {
      setDownloadLoading(true);
      const result = await downloadRouteReport(selectedRoute, 'csv');
      
      if (result.success) {
        Alert.alert('Success', 'Report downloaded successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to download report');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to download report');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleCloseSummary = () => {
    setShowRouteSummary(false);
    setSelectedRoute(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.userDetails}>
              ID: {user.employeeId} • Since {user.joinDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Completed Routes Section (for collectors) */}
        {user?.role === 'collector' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionTitle}>Completed Routes</Text>
            </View>
            {loadingRoutes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primaryDarkTeal} />
                <Text style={styles.loadingText}>Loading routes...</Text>
              </View>
            ) : completedRoutes.length > 0 ? (
              <View style={styles.card}>
                {completedRoutes.slice(0, 5).map((route, index) => (
                  <View key={route._id}>
                    <TouchableOpacity
                      style={styles.routeItem}
                      onPress={() => handleViewRouteSummary(route)}
                    >
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeName}>{route.routeName}</Text>
                        <Text style={styles.routeDate}>
                          {new Date(route.completedAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.routeStats}>
                        <Text style={styles.routeStat}>
                          {route.binsCollected || 0} bins
                        </Text>
                        <Text style={styles.routeChevron}>›</Text>
                      </View>
                    </TouchableOpacity>
                    {index < Math.min(completedRoutes.length - 1, 4) && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
                {completedRoutes.length > 5 && (
                  <Text style={styles.moreRoutesText}>
                    + {completedRoutes.length - 5} more routes
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.noDataText}>No completed routes yet</Text>
              </View>
            )}
          </View>
        )}

        {/* App Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚙️</Text>
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>
          <View style={styles.card}>
            <SettingsToggle
              icon="🔊"
              title="Audio Confirmation"
              description="Play sound on scan success"
              value={user.settings.audioConfirmation}
              onValueChange={(value) => updateSetting('audioConfirmation', value)}
            />
            <View style={styles.divider} />
            <SettingsToggle
              icon="📳"
              title="Vibration Feedback"
              description="Vibrate on interactions"
              value={user.settings.vibrationFeedback}
              onValueChange={(value) => updateSetting('vibrationFeedback', value)}
            />
            <View style={styles.divider} />
            <SettingsToggle
              icon="🔄"
              title="Auto-Sync"
              description="Work without internet"
              value={user.settings.autoSync}
              onValueChange={(value) => updateSetting('autoSync', value)}
            />
          </View>
        </View>

        {/* Device Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📱</Text>
            <Text style={styles.sectionTitle}>Device Status</Text>
          </View>
          <View style={styles.card}>
            <DeviceStatusCard
              icon="🔋"
              label="Battery"
              value="87%"
              iconColor="#10B981"
            />
            <DeviceStatusCard
              icon="📶"
              label="Network"
              value="Strong"
              iconColor="#10B981"
            />
          </View>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={modalVisible}
        userData={user}
        onSubmit={handleProfileUpdate}
        onClose={handleModalClose}
      />

      {/* Route Summary Modal */}
      <PostRouteSummaryModal
        visible={showRouteSummary}
        onClose={handleCloseSummary}
        onDownloadReport={handleDownloadReport}
        routeData={selectedRoute}
        downloadLoading={downloadLoading}
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarIcon: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: FONTS.weight.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.alertRed,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: FONTS.regular,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 15,
    fontWeight: FONTS.weight.semiBold,
    color: '#111827',
    marginBottom: 4,
  },
  routeDate: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: FONTS.regular,
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeStat: {
    fontSize: 13,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
    marginRight: 8,
  },
  routeChevron: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  moreRoutesText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 12,
    fontFamily: FONTS.regular,
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: FONTS.regular,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreen;
