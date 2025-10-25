/**
 * Payment Details Screen
 * Screen for residents to enter payment card details using Stripe
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { CardField, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

/**
 * PaymentDetailsScreen Component
 * Collects card details and billing information
 */
const PaymentDetailsScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { amount, appliedPoints, paymentSummary } = route.params;

  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    address: user.address || '',
    city: '',
    postalCode: '',
  });

  // Handle card field change
  const handleCardChange = (cardDetails) => {
    setCardComplete(cardDetails.complete);
  };

  // Handle billing detail change
  const handleBillingChange = (field, value) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate billing details
  const validateBillingDetails = () => {
    if (!billingDetails.name.trim()) {
      Alert.alert('Validation Error', 'Please enter cardholder name');
      return false;
    }
    if (!billingDetails.address.trim()) {
      Alert.alert('Validation Error', 'Please enter billing address');
      return false;
    }
    if (!billingDetails.city.trim()) {
      Alert.alert('Validation Error', 'Please enter city');
      return false;
    }
    if (!billingDetails.postalCode.trim()) {
      Alert.alert('Validation Error', 'Please enter postal code');
      return false;
    }
    return true;
  };

  // Navigate to review screen
  const handleContinueToReview = () => {
    if (!cardComplete) {
      Alert.alert('Incomplete Card Details', 'Please enter complete card information');
      return;
    }

    if (!validateBillingDetails()) {
      return;
    }

    // Navigate to review screen with all details
    navigation.navigate('PaymentReview', {
      amount,
      appliedPoints,
      paymentSummary,
      billingDetails,
      saveCard
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Amount Summary */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amountValue}>${amount.toFixed(2)}</Text>
        {appliedPoints > 0 && (
          <Text style={styles.pointsApplied}>
            {appliedPoints} points applied
          </Text>
        )}
      </View>

      {/* Card Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Information</Text>
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.card}
            style={styles.cardField}
            onCardChange={handleCardChange}
          />
        </View>
        <Text style={styles.helperText}>
          Test card: 4242 4242 4242 4242, any future date, any CVC
        </Text>
      </View>

      {/* Billing Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Details</Text>
        
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={billingDetails.name}
          onChangeText={(text) => handleBillingChange('name', text)}
          placeholder="John Doe"
          placeholderTextColor={COLORS.iconGray}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={billingDetails.email}
          onChangeText={(text) => handleBillingChange('email', text)}
          placeholder="john@example.com"
          keyboardType="email-address"
          placeholderTextColor={COLORS.iconGray}
        />

        <Text style={styles.label}>Billing Address</Text>
        <TextInput
          style={styles.input}
          value={billingDetails.address}
          onChangeText={(text) => handleBillingChange('address', text)}
          placeholder="123 Main Street"
          placeholderTextColor={COLORS.iconGray}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={billingDetails.city}
              onChangeText={(text) => handleBillingChange('city', text)}
              placeholder="New York"
              placeholderTextColor={COLORS.iconGray}
            />
          </View>
          
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              style={styles.input}
              value={billingDetails.postalCode}
              onChangeText={(text) => handleBillingChange('postalCode', text)}
              placeholder="10001"
              keyboardType="numeric"
              placeholderTextColor={COLORS.iconGray}
            />
          </View>
        </View>
      </View>

      {/* Save Card Option */}
      <View style={styles.saveCardContainer}>
        <View style={styles.saveCardLeft}>
          <Text style={styles.saveCardTitle}>Save card for future payments</Text>
          <Text style={styles.saveCardSubtext}>
            Securely save this card for faster checkout
          </Text>
        </View>
        <Switch
          value={saveCard}
          onValueChange={setSaveCard}
          trackColor={{ false: COLORS.iconGray, true: COLORS.accentGreen }}
          thumbColor={COLORS.white}
        />
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          (!cardComplete || loading) && styles.continueButtonDisabled
        ]}
        onPress={handleContinueToReview}
        disabled={!cardComplete || loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.continueButtonText}>Continue to Review</Text>
        )}
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#000000',
  },
  placeholder: {
    width: 60,
  },
  amountCard: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: FONTS.size.body,
    color: COLORS.white,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
  },
  pointsApplied: {
    fontSize: FONTS.size.caption,
    color: COLORS.accentGreen,
    marginTop: 8,
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
  cardFieldContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.iconGray + '40',
    overflow: 'hidden',
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  card: {
    backgroundColor: COLORS.white,
    textColor: '#000000',
    fontSize: 16,
  },
  helperText: {
    fontSize: FONTS.size.caption,
    color: COLORS.iconGray,
    marginTop: 8,
    fontStyle: 'italic',
  },
  label: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: '#000000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.iconGray + '40',
    padding: 14,
    fontSize: FONTS.size.body,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  saveCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  saveCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  saveCardTitle: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semiBold,
    color: '#000000',
    marginBottom: 4,
  },
  saveCardSubtext: {
    fontSize: FONTS.size.caption,
    color: COLORS.iconGray,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentGreen + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  securityText: {
    fontSize: FONTS.size.caption,
    color: '#000000',
    fontWeight: FONTS.weight.medium,
  },
  continueButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.iconGray,
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
  },
});

export default PaymentDetailsScreen;
