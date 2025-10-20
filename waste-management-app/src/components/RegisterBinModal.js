/**
 * RegisterBinModal Component
 * Modal for registering a new bin or editing an existing one
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
 * RegisterBinModal Component
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Object} props.binData - Existing bin data for editing (optional)
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} The RegisterBinModal component
 */
const RegisterBinModal = ({ visible, binData, onSubmit, onClose }) => {
  const isEditMode = !!binData;

  // Form state
  const [binId, setBinId] = useState('');
  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Waste type options
  const wasteTypes = [
    { label: 'General', value: 'general' },
    { label: 'Recyclable', value: 'recyclable' },
    { label: 'Organic', value: 'organic' },
  ];

  // Capacity options
  const capacityOptions = [
    { label: '50 Liters', value: '50L' },
    { label: '100 Liters', value: '100L' },
    { label: '240 Liters', value: '240L' },
    { label: '500 Liters', value: '500L' },
    { label: '1000 Liters', value: '1000L' },
  ];

  // Reset form when modal opens/closes or binData changes
  useEffect(() => {
    if (visible) {
      if (binData) {
        setBinId(binData.binId || '');
        setLocation(binData.location || '');
        setWasteType(binData.wasteType || '');
        setCapacity(binData.capacity || '');
        setNotes(binData.notes || '');
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [visible, binData]);

  const resetForm = () => {
    setBinId('');
    setLocation('');
    setWasteType('');
    setCapacity('');
    setNotes('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!binId.trim()) {
      newErrors.binId = 'Bin ID is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!wasteType) {
      newErrors.wasteType = 'Waste type is required';
    }

    if (!capacity) {
      newErrors.capacity = 'Capacity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const formData = {
        binId: binId.trim(),
        location: location.trim(),
        wasteType,
        capacity,
        notes: notes.trim(),
      };

      if (onSubmit) {
        onSubmit(formData);
      }
      resetForm();
    }
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
              <Text style={styles.headerIcon}>➕</Text>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>
                  {isEditMode ? 'Edit Bin' : 'Register New Bin'}
                </Text>
                <Text style={styles.subtitle}>
                  {isEditMode
                    ? 'Update waste bin information'
                    : 'Add a new waste bin to collection system'}
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Bin ID */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Bin ID <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.binId && styles.inputError]}
                  value={binId}
                  onChangeText={setBinId}
                  placeholder="Enter unique bin identifier"
                  placeholderTextColor="#9CA3AF"
                  editable={!isEditMode} // Don't allow editing bin ID
                />
                {errors.binId && (
                  <Text style={styles.errorText}>{errors.binId}</Text>
                )}
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Full street address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
                {errors.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}
              </View>

              {/* Waste Type and Capacity Row */}
              <View style={styles.row}>
                {/* Waste Type */}
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    Waste Type <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.selectContainer}>
                    {wasteTypes.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.selectOption,
                          wasteType === type.value && styles.selectOptionActive,
                        ]}
                        onPress={() => setWasteType(type.value)}
                      >
                        <Text
                          style={[
                            styles.selectOptionText,
                            wasteType === type.value &&
                              styles.selectOptionTextActive,
                          ]}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.wasteType && (
                    <Text style={styles.errorText}>{errors.wasteType}</Text>
                  )}
                </View>

                {/* Capacity */}
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>
                    Capacity <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.selectContainer}>
                    {capacityOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.selectOption,
                          capacity === option.value && styles.selectOptionActive,
                        ]}
                        onPress={() => setCapacity(option.value)}
                      >
                        <Text
                          style={[
                            styles.selectOptionText,
                            capacity === option.value &&
                              styles.selectOptionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.capacity && (
                    <Text style={styles.errorText}>{errors.capacity}</Text>
                  )}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Special instructions, access notes, etc."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  ➕ {isEditMode ? 'Update Bin' : 'Register Bin'}
                </Text>
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
    maxHeight: '85%',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    gap: 8,
  },
  selectOption: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  selectOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  selectOptionText: {
    fontSize: 13,
    fontWeight: FONTS.weight.medium,
    color: '#6B7280',
    textAlign: 'center',
  },
  selectOptionTextActive: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#10B981',
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

export default RegisterBinModal;
