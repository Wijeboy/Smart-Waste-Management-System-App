/**
 * Change Password Modal
 * Modal for changing user password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import apiService from '../services/api';

const ChangePasswordModal = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Current Password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is different from current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Password changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                handleCancel();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to change password. Please check your current password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Change Password</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Info Text */}
            <Text style={styles.infoText}>
              Please enter your current password and choose a new password
            </Text>

            {/* Form Fields */}
            <View style={styles.form}>
              {/* Current Password */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Current Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.currentPassword && styles.inputError]}
                    value={formData.currentPassword}
                    onChangeText={(text) => {
                      setFormData({ ...formData, currentPassword: text });
                      setErrors({ ...errors, currentPassword: null });
                    }}
                    placeholder="Enter current password"
                    placeholderTextColor={COLORS.iconGray}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showCurrentPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
              </View>

              {/* New Password */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>New Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.newPassword && styles.inputError]}
                    value={formData.newPassword}
                    onChangeText={(text) => {
                      setFormData({ ...formData, newPassword: text });
                      setErrors({ ...errors, newPassword: null });
                    }}
                    placeholder="Enter new password"
                    placeholderTextColor={COLORS.iconGray}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
                <Text style={styles.hintText}>Minimum 6 characters</Text>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirm New Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                    value={formData.confirmPassword}
                    onChangeText={(text) => {
                      setFormData({ ...formData, confirmPassword: text });
                      setErrors({ ...errors, confirmPassword: null });
                    }}
                    placeholder="Confirm new password"
                    placeholderTextColor={COLORS.iconGray}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
            </View>

            {/* Security Notice */}
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeIcon}>🔒</Text>
              <Text style={styles.noticeText}>
                For security, you'll be logged out after changing your password
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.textPrimary} />
                ) : (
                  <Text style={styles.saveButtonText}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.iconGray,
  },
  infoText: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
    borderRadius: 8,
    backgroundColor: COLORS.lightBackground,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
  },
  inputError: {
    borderColor: COLORS.alertRed,
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: FONTS.size.small,
    color: COLORS.alertRed,
    marginTop: 4,
  },
  hintText: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
    marginTop: 4,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDarkTeal + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryDarkTeal,
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: FONTS.size.small,
    color: COLORS.primaryDarkTeal,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.progressBarBg,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
  },
});

export default ChangePasswordModal;
