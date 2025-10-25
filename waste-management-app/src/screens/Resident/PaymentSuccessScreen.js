/**
 * Payment Success Screen
 * Displays payment confirmation and receipt
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * PaymentSuccessScreen Component
 * Shows payment success confirmation and details
 */
const PaymentSuccessScreen = ({ navigation, route }) => {
  const { payment, remainingPoints } = route.params;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Navigate back to payment dashboard
  const handleBackToDashboard = () => {
    // Navigate to the root of the resident dashboard
    navigation.reset({
      index: 0,
      routes: [{ name: 'ResidentDashboard' }],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Icon */}
      <View style={styles.successIcon}>
        <Text style={styles.successEmoji}>✅</Text>
      </View>

      {/* Success Message */}
      <Text style={styles.successTitle}>Payment Successful!</Text>
      <Text style={styles.successSubtitle}>
        Your payment has been processed successfully
      </Text>

      {/* Transaction Details */}
      <View style={styles.receiptCard}>
        <Text style={styles.receiptTitle}>Payment Receipt</Text>
        
        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValue}>
            {payment.paymentIntentId.substring(0, 20)}...
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time</Text>
          <Text style={styles.detailValue}>
            {formatDate(payment.createdAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>Card ending in ****</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailValue}>{payment.description}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Original Amount</Text>
          <Text style={styles.detailValue}>${payment.amount.toFixed(2)}</Text>
        </View>

        {payment.appliedPoints > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.discountLabel}>
              Points Used ({payment.appliedPoints} pts)
            </Text>
            <Text style={styles.discountValue}>
              -${(payment.amount - payment.finalAmount).toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>${payment.finalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Points Summary */}
      <View style={styles.pointsCard}>
        <View style={styles.pointsHeader}>
          <Text style={styles.pointsIcon}>🎁</Text>
          <View style={styles.pointsDetails}>
            <Text style={styles.pointsLabel}>Remaining Credit Points</Text>
            <Text style={styles.pointsValue}>{remainingPoints} pts</Text>
          </View>
        </View>
        {payment.appliedPoints > 0 && (
          <Text style={styles.pointsNote}>
            You saved ${(payment.amount - payment.finalAmount).toFixed(2)} using your credit points!
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleBackToDashboard}
      >
        <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          A receipt has been saved to your payment history. You can view all your transactions in the Payment History section.
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
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accentGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 60,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  receiptTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.iconGray + '30',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FONTS.size.body,
    color: '#000000',
    fontWeight: FONTS.weight.medium,
    flex: 1,
    textAlign: 'right',
  },
  discountLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.medium,
    flex: 1,
  },
  discountValue: {
    fontSize: FONTS.size.body,
    color: COLORS.accentGreen,
    fontWeight: FONTS.weight.bold,
    flex: 1,
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
  },
  totalValue: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
  },
  pointsCard: {
    width: '100%',
    backgroundColor: COLORS.accentGreen + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  pointsDetails: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.accentGreen,
  },
  pointsNote: {
    fontSize: FONTS.size.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
  },
  infoNote: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.size.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default PaymentSuccessScreen;
