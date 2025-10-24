import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal, Button, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import services
import paymentService from '../../services/paymentService';

const AddPaymentMethodModal = ({ visible, onDismiss, onPaymentMethodAdded }) => {
  // State variables
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock user ID (would come from auth context in a real app)
  const residentId = 'user-123';

  // Detect card type when card number changes
  useEffect(() => {
    if (cardNumber.length >= 4) {
      const detectedType = detectCardType(cardNumber);
      setCardType(detectedType);
    } else {
      setCardType('');
    }
  }, [cardNumber]);

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  // Handle card number change
  const handleCardNumberChange = (text) => {
    const formatted = formatCardNumber(text.replace(/[^0-9]/g, ''));
    setCardNumber(formatted);
    validateField('cardNumber', formatted.replace(/\s+/g, ''));
  };

  // Handle expiry month change
  const handleExpiryMonthChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setExpiryMonth(cleaned);
      validateField('expiryMonth', cleaned);
    }
  };

  // Handle expiry year change
  const handleExpiryYearChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setExpiryYear(cleaned);
      validateField('expiryYear', cleaned);
    }
  };

  // Handle CVV change
  const handleCvvChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setCvv(cleaned);
      validateField('cvv', cleaned);
    }
  };

  // Validate a specific field
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'cardNumber':
        if (!value) {
          newErrors.cardNumber = 'Card number is required';
        } else if (value.length < 13 || value.length > 19) {
          newErrors.cardNumber = 'Invalid card number length';
        } else if (!validateLuhnAlgorithm(value)) {
          newErrors.cardNumber = 'Invalid card number';
        } else {
          delete newErrors.cardNumber;
        }
        break;
        
      case 'cardholderName':
        if (!value) {
          newErrors.cardholderName = 'Cardholder name is required';
        } else if (value.length < 3) {
          newErrors.cardholderName = 'Name is too short';
        } else {
          delete newErrors.cardholderName;
        }
        break;
        
      case 'expiryMonth':
        if (!value) {
          newErrors.expiryMonth = 'Month is required';
        } else if (parseInt(value) < 1 || parseInt(value) > 12) {
          newErrors.expiryMonth = 'Invalid month';
        } else {
          delete newErrors.expiryMonth;
        }
        break;
        
      case 'expiryYear':
        if (!value) {
          newErrors.expiryYear = 'Year is required';
        } else {
          const currentYear = new Date().getFullYear();
          const yearValue = value.length === 2 ? 2000 + parseInt(value) : parseInt(value);
          
          if (yearValue < currentYear) {
            newErrors.expiryYear = 'Card has expired';
          } else {
            delete newErrors.expiryYear;
          }
        }
        break;
        
      case 'cvv':
        if (!value) {
          newErrors.cvv = 'CVV is required';
        } else if (value.length < 3 || value.length > 4) {
          newErrors.cvv = 'CVV must be 3-4 digits';
        } else {
          delete newErrors.cvv;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  };

  // Validate all fields
  const validateForm = () => {
    validateField('cardNumber', cardNumber.replace(/\s+/g, ''));
    validateField('cardholderName', cardholderName);
    validateField('expiryMonth', expiryMonth);
    validateField('expiryYear', expiryYear);
    validateField('cvv', cvv);
    
    return !(errors.cardNumber || 
             errors.cardholderName || 
             errors.expiryMonth || 
             errors.expiryYear || 
             errors.cvv);
  };

  // Handle save button press
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Prepare card data
      const cardData = {
        number: cardNumber.replace(/\s+/g, ''),
        name: cardholderName,
        expiryMonth,
        expiryYear,
        cvv
      };
      
      // Add payment method
      const result = await paymentService.addPaymentMethod(residentId, cardData);
      
      // Call the callback function
      if (onPaymentMethodAdded) {
        onPaymentMethodAdded(result);
      }
      
      // Close the modal
      onDismiss();
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Failed to add payment method. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Detect card type based on card number
  const detectCardType = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    
    if (cleaned.startsWith('4')) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleaned)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cleaned)) {
      return 'amex';
    } else if (/^6/.test(cleaned)) {
      return 'discover';
    }
    
    return '';
  };

  // Validate card number using Luhn algorithm
  const validateLuhnAlgorithm = (number) => {
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return (sum % 10) === 0;
  };

  // Get card type icon
  const getCardTypeIcon = () => {
    switch (cardType) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card-outline';
      case 'amex':
        return 'card';
      case 'discover':
        return 'card-outline';
      default:
        return 'card-outline';
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>
          
          <View style={styles.formContainer}>
            {/* Card Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.cardNumberContainer}>
                <TextInput
                  style={styles.cardNumberInput}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
                {cardType && (
                  <Ionicons
                    name={getCardTypeIcon()}
                    size={24}
                    color="#005257"
                    style={styles.cardTypeIcon}
                  />
                )}
              </View>
              {errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}
            </View>
            
            {/* Cardholder Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                value={cardholderName}
                onChangeText={(text) => {
                  setCardholderName(text);
                  validateField('cardholderName', text);
                }}
                placeholder="John Doe"
              />
              {errors.cardholderName && (
                <Text style={styles.errorText}>{errors.cardholderName}</Text>
              )}
            </View>
            
            {/* Expiry Date and CVV */}
            <View style={styles.rowContainer}>
              {/* Expiry Date */}
              <View style={[styles.inputContainer, styles.expiryContainer]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.expiryInputContainer}>
                  <TextInput
                    style={styles.expiryInput}
                    value={expiryMonth}
                    onChangeText={handleExpiryMonthChange}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.expirySeparator}>/</Text>
                  <TextInput
                    style={styles.expiryInput}
                    value={expiryYear}
                    onChangeText={handleExpiryYearChange}
                    placeholder="YYYY"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <Text style={styles.errorText}>
                    {errors.expiryMonth || errors.expiryYear}
                  </Text>
                )}
              </View>
              
              {/* CVV */}
              <View style={[styles.inputContainer, styles.cvvContainer]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>
            </View>
            
            {/* General Error */}
            {errors.general && (
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            )}
            
            {/* Save Button */}
            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
            >
              {loading ? 'Saving...' : 'Save Card'}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    margin: 0,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  cardNumberInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  cardTypeIcon: {
    marginLeft: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryContainer: {
    flex: 3,
    marginRight: 8,
  },
  cvvContainer: {
    flex: 2,
    marginLeft: 8,
  },
  expiryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  expiryInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  expirySeparator: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  generalErrorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#005257',
    marginTop: 8,
  },
});

export default AddPaymentMethodModal;