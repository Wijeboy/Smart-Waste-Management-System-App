/**
 * BinDetailsModal Component
 * Modal displaying bin details with action buttons
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * BinDetailsModal
 * Displays a modal with bin information, expandable technical details, and update functionality
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {string} props.binId - The bin identifier
 * @param {string} props.location - The bin location/address
 * @param {string} props.status - Current bin status
 * @param {number} props.weight - Current bin weight in kg
 * @param {number} props.fillLevel - Current fill level percentage
 * @param {Function} props.onUpdate - Callback for updating bin details with (status, weight, fillLevel)
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} The BinDetailsModal component
 */
const BinDetailsModal = ({
  visible,
  binId,
  location,
  status: initialStatus,
  weight: initialWeight,
  fillLevel: initialFillLevel,
  onUpdate,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(initialStatus || 'pending');
  const [weight, setWeight] = useState(initialWeight?.toString() || '0');
  const [fillLevel, setFillLevel] = useState(initialFillLevel?.toString() || '0');

  // Update local state when props change
  useEffect(() => {
    setStatus(initialStatus || 'pending');
    setWeight(initialWeight?.toString() || '0');
    setFillLevel(initialFillLevel?.toString() || '0');
  }, [initialStatus, initialWeight, initialFillLevel]);

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({
        status,
        weight: parseFloat(weight) || 0,
        fillLevel: parseInt(fillLevel) || 0,
      });
    }
    onClose();
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'completed':
        return '#1F2937';
      case 'pending':
        return '#F59E0B';
      case 'issue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          {/* Header with icon and close button */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.eyeIcon}>👁</Text>
              <Text style={styles.title}>Bin Details</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Bin ID and Status */}
          <View style={styles.binIdRow}>
            <View style={styles.binIdSection}>
              <Text style={styles.binIdLabel}>Bin ID</Text>
              <Text style={styles.binIdValue}>{binId}</Text>
            </View>
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(initialStatus) }]}>
                <Text style={styles.statusText}>{initialStatus}</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationSection}>
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationValue}>{location}</Text>
          </View>

          {/* Weight and Fill Level Display */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{initialWeight}kg</Text>
              <Text style={styles.metricLabel}>Weight</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValueGreen}>{initialFillLevel}%</Text>
              <Text style={styles.metricLabel}>Fill Level</Text>
            </View>
          </View>

          {/* Technical Details Expandable Section */}
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandableTitle}>Technical Details</Text>
            <Text style={styles.expandIcon}>{isExpanded ? '∧' : '∨'}</Text>
          </TouchableOpacity>

          {/* Expanded Content with Editable Fields */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              {/* Status Dropdown/Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.statusSelector}>
                  {['pending', 'completed', 'issue'].map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption}
                      style={[
                        styles.statusOption,
                        status === statusOption && styles.statusOptionSelected,
                      ]}
                      onPress={() => setStatus(statusOption)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          status === statusOption && styles.statusOptionTextSelected,
                        ]}
                      >
                        {statusOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Weight Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="Enter weight"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Fill Level Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fill Level (%)</Text>
                <TextInput
                  style={styles.input}
                  value={fillLevel}
                  onChangeText={setFillLevel}
                  keyboardType="number-pad"
                  placeholder="Enter fill level"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Update Button */}
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                activeOpacity={0.8}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBottomButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeBottomButtonText}>Close</Text>
          </TouchableOpacity>
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
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  binIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  binIdSection: {
    flex: 1,
  },
  binIdLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  binIdValue: {
    fontSize: 16,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  locationSection: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#3B82F6',
    marginBottom: 4,
  },
  metricValueGreen: {
    fontSize: 24,
    fontWeight: FONTS.weight.bold,
    color: '#10B981',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  expandableTitle: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
  },
  expandIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  expandedContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  statusOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: FONTS.weight.semiBold,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#FFFFFF',
  },
  closeBottomButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F3F4F6',
  },
  closeBottomButtonText: {
    fontSize: 14,
    fontWeight: FONTS.weight.semiBold,
    color: '#374151',
  },
});

export default BinDetailsModal;
