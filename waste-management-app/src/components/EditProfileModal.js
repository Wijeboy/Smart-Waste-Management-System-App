/**
 * EditProfileModal Component
 * Modal for editing user profile information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * EditProfileModal Component
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Object} props.userData - Current user data
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} The EditProfileModal component
 */
const EditProfileModal = ({ visible, userData, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form with user data when modal opens
  useEffect(() => {
    if (visible && userData) {
      setName(userData.name || '');
      setRole(userData.role || '');
      setErrors({});
    }
  }, [visible, userData]);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const formData = {
        name: name.trim(),
        role: role.trim(),
      };

      if (onSubmit) {
        onSubmit(formData);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerIcon}>✏️</Text>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Edit Profile</Text>
                <Text style={styles.subtitle}>Update your profile information</Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Role */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Role / Job Title</Text>
                <TextInput
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                  placeholder="e.g., Collection Supervisor"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Info Message */}
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Your name will be updated across all screens in the app.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>💾 Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
  },
});

export default EditProfileModal;
