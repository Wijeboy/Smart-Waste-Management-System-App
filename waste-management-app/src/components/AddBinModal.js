/**
 * Add Bin Modal Component
 * Modal form for residents to add their bins
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONTS } from '../constants/theme';

const AddBinModal = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    location: '',
    zone: 'Zone A',
    binType: 'General Waste',
    capacity: '',
    coordinates: {
      lat: '',
      lng: '',
    },
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    if (name === 'lat' || name === 'lng') {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Please enter a valid capacity (kg)';
    }

    // Coordinates are now optional - only validate if provided
    if (formData.coordinates.lat && isNaN(formData.coordinates.lat)) {
      newErrors.lat = 'Latitude must be a valid number';
    }

    if (formData.coordinates.lng && isNaN(formData.coordinates.lng)) {
      newErrors.lng = 'Longitude must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      // Only include coordinates if they're provided
      if (formData.coordinates.lat && formData.coordinates.lng) {
        submitData.coordinates = {
          lat: Number(formData.coordinates.lat),
          lng: Number(formData.coordinates.lng),
        };
      }
      
      await onSubmit(submitData);
      
      // Reset form on success
      setFormData({
        location: '',
        zone: 'Zone A',
        binType: 'General Waste',
        capacity: '',
        coordinates: { lat: '', lng: '' },
        notes: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting bin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      location: '',
      zone: 'Zone A',
      binType: 'General Waste',
      capacity: '',
      coordinates: { lat: '', lng: '' },
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Bin</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={[styles.input, errors.location && styles.inputError]}
                placeholder="Enter bin location address"
                value={formData.location}
                onChangeText={(value) => handleChange('location', value)}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>

            {/* Zone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Zone *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.zone}
                  onValueChange={(value) => handleChange('zone', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Zone A" value="Zone A" />
                  <Picker.Item label="Zone B" value="Zone B" />
                  <Picker.Item label="Zone C" value="Zone C" />
                  <Picker.Item label="Zone D" value="Zone D" />
                </Picker>
              </View>
            </View>

            {/* Bin Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bin Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.binType}
                  onValueChange={(value) => handleChange('binType', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="General Waste" value="General Waste" />
                  <Picker.Item label="Recyclable" value="Recyclable" />
                  <Picker.Item label="Organic" value="Organic" />
                  <Picker.Item label="Hazardous" value="Hazardous" />
                </Picker>
              </View>
            </View>

            {/* Capacity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity (kg) *</Text>
              <TextInput
                style={[styles.input, errors.capacity && styles.inputError]}
                placeholder="Enter bin capacity in kg"
                value={formData.capacity}
                onChangeText={(value) => handleChange('capacity', value)}
                keyboardType="numeric"
              />
              {errors.capacity && (
                <Text style={styles.errorText}>{errors.capacity}</Text>
              )}
            </View>

            {/* Coordinates */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Coordinates (Optional)</Text>
              <View style={styles.coordinatesRow}>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Latitude</Text>
                  <TextInput
                    style={[styles.input, errors.lat && styles.inputError]}
                    placeholder="e.g., 6.9271"
                    value={formData.coordinates.lat}
                    onChangeText={(value) => handleChange('lat', value)}
                    keyboardType="numeric"
                  />
                  {errors.lat && (
                    <Text style={styles.errorText}>{errors.lat}</Text>
                  )}
                </View>
                <View style={styles.coordinateInput}>
                  <Text style={styles.coordinateLabel}>Longitude</Text>
                  <TextInput
                    style={[styles.input, errors.lng && styles.inputError]}
                    placeholder="e.g., 79.8612"
                    value={formData.coordinates.lng}
                    onChangeText={(value) => handleChange('lng', value)}
                    keyboardType="numeric"
                  />
                  {errors.lng && (
                    <Text style={styles.errorText}>{errors.lng}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional information..."
                value={formData.notes}
                onChangeText={(value) => handleChange('notes', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Add Bin</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.lightBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.progressBarBg,
  },
  modalTitle: {
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 8,
    padding: 12,
    fontSize: FONTS.size.small,
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
  },
  inputError: {
    borderColor: COLORS.alertRed,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateInput: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: FONTS.size.caption,
    color: COLORS.iconGray,
    marginBottom: 4,
  },
  errorText: {
    color: COLORS.alertRed,
    fontSize: FONTS.size.caption,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: COLORS.iconGray,
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
  },
});

export default AddBinModal;
