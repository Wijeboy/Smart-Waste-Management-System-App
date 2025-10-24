/**
 * Apply Credit Points Screen
 * Screen for residents to select and apply credit points to payment
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import {
  calculatePaymentSummary,
  validatePointsRedemption,
  formatCurrency,
  getPointPresets,
} from '../../utils/paymentService';

/**
 * ApplyPointsScreen Component
 * Allows residents to select preset point amounts and apply to payment
 */
const ApplyPointsScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { availablePoints: initialPoints } = route.params || {};
  
  const [availablePoints, setAvailablePoints] = useState(initialPoints || 0);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  // Fetch latest credit points
  useEffect(() => {
    fetchCreditPoints();
  }, []);

  const fetchCreditPoints = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserCreditPoints(user.id);
      if (response.success) {
        setAvailablePoints(response.data.creditPoints);
      }
    } catch (error) {
      console.error('Error fetching credit points:', error);
      Alert.alert('Error', 'Failed to load credit points');
    } finally {
      setLoading(false);
    }
  };

  // Handle point selection
  const handleSelectPoints = (points) => {
    setSelectedPoints(points);
  };

  // Handle apply points and pay
  const handleApplyAndPay = async () => {
    if (selectedPoints === 0) {
      Alert.alert('No Points Selected', 'Please select points to apply');
      return;
    }

    // Validate points
    const validation = validatePointsRedemption(availablePoints, selectedPoints);
    if (!validation.valid) {
      Alert.alert('Invalid Redemption', validation.message);
      return;
    }

    try {
      setApplying(true);

      // Redeem points
      const response = await apiService.redeemCreditPoints(user.id, selectedPoints);
      
      if (response.success) {
        const { discount, remainingPoints } = response.data;
        
        Alert.alert(
          'Success! 🎉',
          `You've redeemed ${selectedPoints} points for a ${formatCurrency(discount)} discount!\n\nRemaining Points: ${remainingPoints}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to ResidentDashboard and switch to Payment tab
                navigation.navigate('ResidentDashboard', { 
                  screen: 'Payment',
                  params: {
                    pointsApplied: selectedPoints,
                    discount: discount,
                    refreshPoints: true,
                  }
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error applying points:', error);
      Alert.alert('Error', error.message || 'Failed to apply points. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // Calculate payment summary
  const paymentSummary = calculatePaymentSummary(selectedPoints);
  const pointPresets = getPointPresets(availablePoints);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Credit Points</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Available Points */}
      <View style={styles.availablePointsCard}>
        <Text style={styles.availablePointsLabel}>Available Points:</Text>
        <Text style={styles.availablePointsValue}>{availablePoints}</Text>
      </View>

      {/* Point Selection */}
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionTitle}>Select Points to Redeem</Text>
        
        {pointPresets.length === 0 ? (
          <View style={styles.noPresetsCard}>
            <Text style={styles.noPresetsText}>
              {availablePoints < 50 
                ? `You need at least 50 points to redeem.\nYou have ${availablePoints} points.` 
                : 'No preset amounts available for this payment.'}
            </Text>
          </View>
        ) : (
          <View style={styles.presetsGrid}>
            {[50, 100, 200, 300].map((points) => {
              const isAvailable = pointPresets.includes(points);
              const isSelected = selectedPoints === points;

              return (
                <TouchableOpacity
                  key={points}
                  style={[
                    styles.presetButton,
                    isSelected && styles.presetButtonSelected,
                    !isAvailable && styles.presetButtonDisabled,
                  ]}
                  onPress={() => isAvailable && handleSelectPoints(points)}
                  disabled={!isAvailable}
                >
                  <Text style={[
                    styles.presetPoints,
                    isSelected && styles.presetPointsSelected,
                    !isAvailable && styles.presetPointsDisabled,
                  ]}>
                    {points}
                  </Text>
                  <Text style={[
                    styles.presetLabel,
                    isSelected && styles.presetLabelSelected,
                    !isAvailable && styles.presetLabelDisabled,
                  ]}>
                    Points
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Invoice Summary */}
      <View style={styles.invoiceContainer}>
        <Text style={styles.sectionTitle}>Invoice Summary</Text>
        
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Waste Collection</Text>
            <Text style={styles.invoiceValue}>
              {formatCurrency(paymentSummary.wasteCollection)}
            </Text>
          </View>

          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Recycling</Text>
            <Text style={styles.invoiceValue}>
              {formatCurrency(paymentSummary.recyclingProcessing)}
            </Text>
          </View>

          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Service Fee</Text>
            <Text style={styles.invoiceValue}>
              {formatCurrency(paymentSummary.serviceFee)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabelBold}>Subtotal</Text>
            <Text style={styles.invoiceValueBold}>
              {formatCurrency(paymentSummary.subtotal)}
            </Text>
          </View>

          {selectedPoints > 0 && (
            <View style={styles.invoiceRow}>
              <Text style={styles.discountLabel}>
                Credit Points Discount ({selectedPoints} pts)
              </Text>
              <Text style={styles.discountValue}>
                -{formatCurrency(paymentSummary.discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.invoiceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(paymentSummary.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={[
          styles.applyButton,
          (selectedPoints === 0 || applying) && styles.applyButtonDisabled,
        ]}
        onPress={handleApplyAndPay}
        disabled={selectedPoints === 0 || applying}
      >
        {applying ? (
          <ActivityIndicator color={COLORS.textPrimary} />
        ) : (
          <Text style={styles.applyButtonText}>Apply Points & Pay</Text>
        )}
      </TouchableOpacity>

      {/* Info */}
      {selectedPoints > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 You'll save {formatCurrency(paymentSummary.discount)} with {selectedPoints} points!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  content: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryDarkTeal,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  availablePointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentGreen + '20',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
  },
  availablePointsLabel: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#111827',
  },
  availablePointsValue: {
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
    color: COLORS.accentGreen,
  },
  selectionContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.iconGray + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  presetButtonSelected: {
    backgroundColor: COLORS.accentGreen + '20',
    borderColor: COLORS.accentGreen,
  },
  presetButtonDisabled: {
    backgroundColor: COLORS.iconGray + '10',
    opacity: 0.5,
  },
  presetPoints: {
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  presetPointsSelected: {
    color: COLORS.accentGreen,
  },
  presetPointsDisabled: {
    color: COLORS.iconGray,
  },
  presetLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  presetLabelSelected: {
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.semiBold,
  },
  presetLabelDisabled: {
    color: COLORS.iconGray,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  noPresetsCard: {
    backgroundColor: COLORS.lightCard,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  noPresetsText: {
    fontSize: FONTS.size.body,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 22,
  },
  invoiceContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  invoiceCard: {
    backgroundColor: COLORS.lightCard,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceLabel: {
    fontSize: FONTS.size.body,
    color: '#1F2937',
  },
  invoiceValue: {
    fontSize: FONTS.size.body,
    color: '#111827',
  },
  invoiceLabelBold: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#111827',
  },
  invoiceValueBold: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#111827',
  },
  discountLabel: {
    fontSize: FONTS.size.body,
    color: '#059669',
    fontWeight: FONTS.weight.semiBold,
  },
  discountValue: {
    fontSize: FONTS.size.body,
    color: '#059669',
    fontWeight: FONTS.weight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.iconGray + '30',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#111827',
  },
  totalValue: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#111827',
  },
  applyButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    marginHorizontal: 16,
    marginTop: 32,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.iconGray,
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  infoCard: {
    backgroundColor: COLORS.accentGreen + '20',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: FONTS.size.body,
    color: '#111827',
    fontWeight: FONTS.weight.semiBold,
    textAlign: 'center',
  },
});

export default ApplyPointsScreen;
