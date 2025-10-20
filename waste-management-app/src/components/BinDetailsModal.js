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
  // Collection status: 'pending', 'completed', or 'issue'
  const [collectionStatus, setCollectionStatus] = useState(
    initialStatus === 'maintenance' ? 'issue' :
    initialFillLevel >= 50 || initialStatus === 'full' ? 'pending' : 'completed'
  );
  const [weight, setWeight] = useState(initialWeight?.toString() || '0');
  const [fillLevel, setFillLevel] = useState(initialFillLevel?.toString() || '0');
  const [complaint, setComplaint] = useState('');

  // Update local state when props change
  useEffect(() => {
    setCollectionStatus(
      initialStatus === 'maintenance' ? 'issue' :
      initialFillLevel >= 50 || initialStatus === 'full' ? 'pending' : 'completed'
    );
    setWeight(initialWeight?.toString() || '0');
    setFillLevel(initialFillLevel?.toString() || '0');
  }, [initialStatus, initialWeight, initialFillLevel]);

  const handleUpdate = () => {
    if (onUpdate) {
      // Map collection status to bin updates
      const updates = {
        fillLevel: parseInt(fillLevel) || 0,
        weight: parseFloat(weight) || 0,
      };
      
      // Handle different collection statuses
      if (collectionStatus === 'completed') {
        // Reset bin when marked as completed
        updates.fillLevel = 0;
        updates.weight = 0;
        updates.status = 'active';
        updates.lastCollection = new Date().toISOString();
      } else if (collectionStatus === 'issue') {
        // Set to maintenance status with complaint
        updates.status = 'maintenance';
        if (complaint.trim()) {
          updates.notes = complaint.trim();
        }
      } else {
        // Pending: ensure fillLevel is high enough to show as pending
        // If fillLevel is too low (< 50), set it to 85% as default
        if (updates.fillLevel < 50) {
          console.log('⚠️ FillLevel too low for pending status, setting to 85%');
          updates.fillLevel = 85;
          // Also estimate weight based on capacity if available
          updates.weight = parseFloat(weight) > 0 ? parseFloat(weight) : 75;
        }
        // Set appropriate status based on fill level
        updates.status = updates.fillLevel >= 85 ? 'full' : 'active';
      }
      
      console.log('📤 Modal sending updates:', updates);
      onUpdate(updates);
    }
    // Don't close here - let parent handle it after update completes
  };

  const getStatusColor = (statusValue) => {
    // Determine color based on fillLevel and backend status
    if (statusValue === 'full' || initialFillLevel >= 85) {
      return '#EF4444'; // Red - needs collection urgently
    } else if (initialFillLevel >= 50) {
      return '#F59E0B'; // Yellow - needs collection soon
    } else if (statusValue === 'maintenance') {
      return '#9CA3AF'; // Gray - maintenance
    } else {
      return '#10B981'; // Green - active/good
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
              <Text style={styles.statusLabel}>Collection Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(initialStatus) }]}>
                <Text style={styles.statusText}>
                  {initialFillLevel >= 50 || initialStatus === 'full' ? 'Pending' : 'Completed'}
                </Text>
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
              {/* Collection Status Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mark Collection As</Text>
                <View style={styles.statusSelectorThree}>
                  {[{ value: 'pending', label: '⏳ Pending' }, 
                    { value: 'completed', label: '✅ Completed' },
                    { value: 'issue', label: '⚠️ Issue' }].map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption.value}
                      style={[
                        styles.statusOptionThree,
                        collectionStatus === statusOption.value && styles.statusOptionSelected,
                      ]}
                      onPress={() => setCollectionStatus(statusOption.value)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          collectionStatus === statusOption.value && styles.statusOptionTextSelected,
                        ]}
                      >
                        {statusOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {collectionStatus === 'completed' && (
                  <Text style={styles.helpText}>
                    ℹ️ This will reset fill level and weight to 0
                  </Text>
                )}
                {collectionStatus === 'pending' && parseInt(fillLevel) < 50 && (
                  <Text style={styles.helpText}>
                    ℹ️ Fill level will be set to 85% (minimum for pending)
                  </Text>
                )}
                {collectionStatus === 'issue' && (
                  <Text style={styles.helpText}>
                    ℹ️ Bin will be marked for maintenance
                  </Text>
                )}
              </View>
              
              {/* Complaint Field (only show for issues) */}
              {collectionStatus === 'issue' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Describe the Issue</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={complaint}
                    onChangeText={setComplaint}
                    placeholder="Enter details about the issue..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}

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
  textArea: {
    minHeight: 80,
    paddingTop: 10,
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  statusSelectorThree: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  statusOptionThree: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 8,
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
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
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
