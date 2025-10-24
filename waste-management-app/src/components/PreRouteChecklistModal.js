/**
 * PreRouteChecklistModal Component
 * Modal that displays a checklist for collectors to complete before starting a route
 * All items must be checked before proceeding
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

/**
 * Checklist items that must be verified before starting a route
 */
const CHECKLIST_ITEMS = [
  {
    id: 'vehicle',
    label: 'Vehicle inspection completed',
    description: 'Check tires, brakes, lights, and fuel level',
  },
  {
    id: 'safety',
    label: 'Safety equipment available',
    description: 'Gloves, vest, safety boots, and first aid kit',
  },
  {
    id: 'containers',
    label: 'Collection containers ready',
    description: 'Bags, bins, and tie-wraps are loaded',
  },
  {
    id: 'route',
    label: 'Route map reviewed',
    description: 'Familiar with all bin locations and route order',
  },
  {
    id: 'communication',
    label: 'Communication device functional',
    description: 'Phone charged and signal available',
  },
];

/**
 * PreRouteChecklistModal
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onComplete - Called when checklist is completed with all checked items
 * @param {boolean} props.loading - Shows loading state when submitting
 * @param {string} props.routeName - Name of the route being started
 * @returns {JSX.Element} The PreRouteChecklistModal component
 */
const PreRouteChecklistModal = ({ visible, onComplete, loading = false, routeName = '' }) => {
  const [checkedItems, setCheckedItems] = useState({});

  /**
   * Toggle checkbox state for a specific item
   * @param {string} itemId - ID of the checklist item
   */
  const toggleItem = (itemId) => {
    if (loading) return; // Prevent changes while submitting
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  /**
   * Check if all items are checked
   * @returns {boolean} True if all items are checked
   */
  const isAllChecked = () => {
    return CHECKLIST_ITEMS.every((item) => checkedItems[item.id] === true);
  };

  /**
   * Handle proceed button press
   * Calls onComplete with checklist data
   */
  const handleProceed = () => {
    if (!isAllChecked() || loading) return;

    const checklistData = {
      items: CHECKLIST_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
        checked: true,
      })),
      completedAt: new Date().toISOString(),
    };

    onComplete(checklistData);
  };

  /**
   * Reset checklist when modal becomes visible
   */
  React.useEffect(() => {
    if (visible) {
      setCheckedItems({});
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        // Prevent closing by back button - checklist must be completed
        return false;
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>✓</Text>
            <Text style={styles.headerTitle}>Pre-Route Checklist</Text>
            {routeName && <Text style={styles.routeName}>{routeName}</Text>}
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Please verify all items before starting your route. This ensures safety and efficiency.
            </Text>
          </View>

          {/* Checklist Items */}
          <ScrollView style={styles.checklistContainer} showsVerticalScrollIndicator={false}>
            {CHECKLIST_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleItem(item.id)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      checkedItems[item.id] && styles.checkboxChecked,
                    ]}
                  >
                    {checkedItems[item.id] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {Object.values(checkedItems).filter(Boolean).length} of {CHECKLIST_ITEMS.length} items checked
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.proceedButton,
                (!isAllChecked() || loading) && styles.proceedButtonDisabled,
              ]}
              onPress={handleProceed}
              disabled={!isAllChecked() || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textWhite} size="small" />
              ) : (
                <Text style={styles.proceedButtonText}>
                  {isAllChecked() ? 'Proceed to Start Route →' : 'Complete All Items to Proceed'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: COLORS.modalBackground,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: COLORS.primaryDarkTeal,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },
  routeName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },
  checklistContainer: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accentGreen,
    borderColor: COLORS.accentGreen,
  },
  checkmark: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: FONTS.semiBold,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 16,
  },
  proceedButton: {
    backgroundColor: COLORS.accentGreen,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  proceedButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  proceedButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});

export default PreRouteChecklistModal;
