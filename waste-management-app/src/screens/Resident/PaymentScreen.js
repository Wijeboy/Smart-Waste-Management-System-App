/**
 * Payment Screen
 * Screen for residents to view payment summary and apply credit points
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import {
  calculatePaymentSummary,
  formatCurrency,
} from '../../utils/paymentService';

/**
 * PaymentScreen Component
 * Displays payment information and credit points integration
 */
const PaymentScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const [creditPoints, setCreditPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [appliedPoints, setAppliedPoints] = useState(0);

  // Check if points were just applied
  useEffect(() => {
    if (route.params?.refreshPoints) {
      fetchCreditPoints();
      // Clear the param
      navigation.setParams({ refreshPoints: undefined });
    }
    if (route.params?.pointsApplied) {
      setAppliedPoints(route.params.pointsApplied);
    }
  }, [route.params]);

  // Fetch credit points
  const fetchCreditPoints = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      
      const response = await apiService.getUserCreditPoints(user.id);
      if (response.success) {
        setCreditPoints(response.data.creditPoints);
      }
    } catch (error) {
      console.error('Error fetching credit points:', error);
      Alert.alert('Error', 'Failed to load credit points');
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  // Load data when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchCreditPoints();
      // Reset applied points when leaving and coming back
      return () => setAppliedPoints(0);
    }, [])
  );

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setAppliedPoints(0);
    fetchCreditPoints(true);
  };

  // Navigate to credit points screen
  const handleCheckPoints = () => {
    navigation.navigate('CreditPoints');
  };

  // Navigate to apply points screen
  const handleApplyPoints = () => {
    if (creditPoints < 50) {
      Alert.alert(
        'Insufficient Points',
        `You need at least 50 points to redeem. You currently have ${creditPoints} points.`,
        [
          {
            text: 'OK',
          },
        ]
      );
      return;
    }
    navigation.navigate('ApplyPoints', { availablePoints: creditPoints });
  };

  // Handle payment
  const handlePayNow = () => {
    const paymentSummary = calculatePaymentSummary(appliedPoints);
    
    Alert.alert(
      'Process Payment',
      `Total Amount: ${formatCurrency(paymentSummary.totalAmount)}\n\nThis is a demo. Payment processing will be implemented in the future.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset applied points after payment
            setAppliedPoints(0);
          },
        },
      ]
    );
  };

  // Calculate payment summary
  const paymentSummary = calculatePaymentSummary(appliedPoints);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment Page</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Credit Points Card */}
      <View style={styles.creditPointsCard}>
        <View style={styles.creditPointsHeader}>
          <View style={styles.pointsIcon}>
            <Text style={styles.pointsIconText}>�</Text>
          </View>
          <Text style={styles.creditPointsTitle}>Credit Points</Text>
        </View>
        
        <View style={styles.pointsRow}>
          <Text style={styles.pointsLabel}>Available Points:</Text>
          <Text style={styles.pointsValue}>{creditPoints} pts</Text>
        </View>

        <View style={styles.pointsButtons}>
          <TouchableOpacity
            style={styles.checkPointsButton}
            onPress={handleCheckPoints}
          >
            <Text style={styles.checkPointsText}>Check Points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.applyPointsButton,
              creditPoints < 50 && styles.applyPointsButtonDisabled,
            ]}
            onPress={handleApplyPoints}
            disabled={creditPoints < 50}
          >
            <Text style={styles.applyPointsText}>Apply Points</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={styles.paymentSummaryContainer}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Waste Collection Service</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(paymentSummary.wasteCollection)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recycling Processing</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(paymentSummary.recyclingProcessing)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(paymentSummary.serviceFee)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>
              {formatCurrency(paymentSummary.subtotal)}
            </Text>
          </View>

          {appliedPoints > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.discountLabel}>Credit Points Discount</Text>
              <Text style={styles.discountValue}>
                -{formatCurrency(paymentSummary.discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(paymentSummary.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            selectedPaymentMethod === 'visa' && styles.paymentMethodSelected,
          ]}
          onPress={() => setSelectedPaymentMethod('visa')}
        >
          <View style={styles.paymentMethodIcon}>
            <Text style={styles.cardIcon}>💳</Text>
          </View>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>Visa Card</Text>
            <Text style={styles.paymentMethodSubtitle}>**** 4832</Text>
          </View>
          {selectedPaymentMethod === 'visa' && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIndicatorText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            selectedPaymentMethod === 'mastercard' && styles.paymentMethodSelected,
          ]}
          onPress={() => setSelectedPaymentMethod('mastercard')}
        >
          <View style={styles.paymentMethodIcon}>
            <Text style={styles.cardIcon}>💳</Text>
          </View>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>Mastercard</Text>
            <Text style={styles.paymentMethodSubtitle}>**** 2345</Text>
          </View>
          {selectedPaymentMethod === 'mastercard' && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIndicatorText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            selectedPaymentMethod === 'wallet' && styles.paymentMethodSelected,
          ]}
          onPress={() => setSelectedPaymentMethod('wallet')}
        >
          <View style={styles.paymentMethodIcon}>
            <Text style={styles.cardIcon}>👛</Text>
          </View>
          <View style={styles.paymentMethodDetails}>
            <Text style={styles.paymentMethodTitle}>Digital Wallet</Text>
            <Text style={styles.paymentMethodSubtitle}>Apple Pay, Google Pay</Text>
          </View>
          {selectedPaymentMethod === 'wallet' && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIndicatorText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={styles.payNowButton}
        onPress={handlePayNow}
      >
        <Text style={styles.payNowText}>Pay Now</Text>
      </TouchableOpacity>

      {/* Spacer for bottom navigation */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  content: {
    paddingBottom: 20,
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
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 24,
  },
  creditPointsCard: {
    backgroundColor: COLORS.lightCard,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  creditPointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pointsIconText: {
    fontSize: 24,
  },
  creditPointsTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsLabel: {
    fontSize: FONTS.size.body,
    color: '#1F2937', // Darker for better visibility
    fontWeight: FONTS.weight.medium,
  },
  pointsValue: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#059669', // Darker green for better visibility
  },
  pointsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkPointsButton: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkTeal + '20',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  checkPointsText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
  },
  applyPointsButton: {
    flex: 1,
    backgroundColor: COLORS.accentGreen,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyPointsButtonDisabled: {
    backgroundColor: COLORS.iconGray,
    opacity: 0.5,
  },
  applyPointsText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  paymentSummaryContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.lightCard,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: FONTS.size.body,
    color: '#1F2937', // Darker gray for better visibility
    fontWeight: FONTS.weight.medium,
  },
  summaryValue: {
    fontSize: FONTS.size.body,
    color: '#111827', // Almost black for better readability
    fontWeight: FONTS.weight.semiBold,
  },
  subtotalLabel: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
  },
  subtotalValue: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  discountLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.semiBold,
  },
  discountValue: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
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
    color: '#111827', // Almost black for maximum visibility
  },
  totalValue: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#111827', // Almost black for maximum visibility
  },
  paymentMethodsContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: COLORS.primaryDarkTeal,
    backgroundColor: COLORS.primaryDarkTeal + '10',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryDarkTeal + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#111827',
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: FONTS.size.small,
    color: '#1F2937',
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDarkTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: FONTS.weight.bold,
  },
  payNowButton: {
    backgroundColor: COLORS.accentGreen,
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
  payNowText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  bottomSpacer: {
    height: 100, // Extra space for bottom navigation
  },
});

export default PaymentScreen;
