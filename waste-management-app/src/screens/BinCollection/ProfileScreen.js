/**
 * ProfileScreen Component
 * User profile with settings and device status
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useUser } from '../../context/UserContext';
import BottomNavigation from '../../components/BottomNavigation';
import EditProfileModal from '../../components/EditProfileModal';
import SettingsToggle from '../../components/SettingsToggle';
import DeviceStatusCard from '../../components/DeviceStatusCard';

/**
 * ProfileScreen Component
 * Main screen for user profile and settings
 * @returns {JSX.Element} The ProfileScreen component
 */
const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, updateSetting } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleProfileUpdate = (formData) => {
    updateProfile(formData);
    setModalVisible(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation?.navigate('Dashboard');
    } else if (tab === 'reports') {
      navigation?.navigate('Reports');
    }
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
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreen;
