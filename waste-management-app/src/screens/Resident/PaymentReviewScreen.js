/**
 * Payment Review Screen
 * Final review screen before processing payment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

/**
 * PaymentReviewScreen Component
 * Displays final payment summary and processes payment
 */
const PaymentReviewScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { confirmPayment } = useStripe();
  const { amount, appliedPoints, paymentSummary, billingDetails, saveCard } = route.params;

  const [processing, setProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Process payment
  const handlePayNow = async () => {
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions to proceed');
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Create payment intent
      const intentResponse = await apiService.createPaymentIntent({
        amount,
        appliedPoints,
        paymentDetails: billingDetails
      });

      if (!intentResponse.success) {
        throw new Error(intentResponse.message || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = intentResponse.data;

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              postalCode: billingDetails.postalCode,
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Step 3: Confirm payment on backend
      const confirmResponse = await apiService.confirmPayment({
        paymentIntentId,
        appliedPoints,
        amount
      });

      if (!confirmResponse.success) {
        throw new Error(confirmResponse.message || 'Failed to confirm payment');
      }

      // Step 4: Save card if requested
      if (saveCard && paymentIntent.payment_method) {
        try {
          await apiService.savePaymentMethod({
            paymentMethodId: paymentIntent.payment_method
          });
        } catch (saveError) {
          console.log('Card save failed:', saveError);
          // Don't fail the payment if card save fails
        }
      }

      // Success! Navigate to success screen
      navigation.navigate('PaymentSuccess', {
        payment: confirmResponse.data.payment,
        remainingPoints: confirmResponse.data.remainingPoints
      });

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'An error occurred while processing your payment. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Stay on review screen to allow retry
            }
          }
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={processing}>
          <Text style={[styles.backButton, processing && styles.disabled]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Waste Collection</Text>
            <Text style={styles.summaryValue}>
              ${paymentSummary.wasteCollection.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recycling Processing</Text>
            <Text style={styles.summaryValue}>
              ${paymentSummary.recyclingProcessing.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>
              ${paymentSummary.serviceFee.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${paymentSummary.subtotal.toFixed(2)}
            </Text>
          </View>

          {appliedPoints > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>
                  Points Discount ({appliedPoints} pts)
                </Text>
                <Text style={styles.discountValue}>
                  -${paymentSummary.discount.toFixed(2)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Billing Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Information</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{billingDetails.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{billingDetails.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>
              {billingDetails.address}, {billingDetails.city} {billingDetails.postalCode}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.paymentMethodRow}>
            <Text style={styles.cardIcon}>💳</Text>
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
              <Text style={styles.paymentMethodSubtext}>
                Secured by Stripe
              </Text>
            </View>
          </View>
          {saveCard && (
            <Text style={styles.saveCardNote}>
              ✓ Card will be saved for future payments
            </Text>
          )}
        </View>
      </View>

      {/* Terms and Conditions */}
      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setTermsAccepted(!termsAccepted)}
        disabled={processing}
      >
        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
          {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsLink}>Terms and Conditions</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>

      {/* Pay Button */}
      <TouchableOpacity
        style={[
          styles.payButton,
          (!termsAccepted || processing) && styles.payButtonDisabled
        ]}
        onPress={handlePayNow}
        disabled={!termsAccepted || processing}
      >
        {processing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator color={COLORS.white} size="small" />
            <Text style={styles.processingText}>Processing Payment...</Text>
          </View>
        ) : (
          <Text style={styles.payButtonText}>Pay ${amount.toFixed(2)} Now</Text>
        )}
      </TouchableOpacity>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Secure payment powered by Stripe
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  backButton: {
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
  },
  disabled: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
  },
  placeholder: {
    width: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: FONTS.size.body,
    color: '#000000',
  },
  summaryValue: {
    fontSize: FONTS.size.body,
    color: '#000000',
    fontWeight: FONTS.weight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.iconGray + '30',
    marginVertical: 8,
  },
  discountLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.medium,
  },
  discountValue: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.bold,
  },
  totalLabel: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
  },
  totalValue: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
  },
  detailRow: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: FONTS.size.caption,
    color: '#000000',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: FONTS.size.body,
    color: '#000000',
    fontWeight: FONTS.weight.medium,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: '#000000',
  },
  paymentMethodSubtext: {
    fontSize: FONTS.size.caption,
    color: '#000000',
    marginTop: 2,
  },
  saveCardNote: {
    fontSize: FONTS.size.caption,
    color: COLORS.accentGreen,
    marginTop: 12,
    fontWeight: FONTS.weight.medium,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.iconGray,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderColor: COLORS.primaryDarkTeal,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.weight.bold,
  },
  termsText: {
    flex: 1,
    fontSize: FONTS.size.body,
    color: '#000000',
    lineHeight: 20,
  },
  termsLink: {
    color: '#000000',
    fontWeight: FONTS.weight.semiBold,
  },
  payButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 16,
  },
  payButtonDisabled: {
    backgroundColor: COLORS.iconGray,
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
    marginLeft: 12,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  securityText: {
    fontSize: FONTS.size.caption,
    color: '#000000',
  },
});

export default PaymentReviewScreen;
