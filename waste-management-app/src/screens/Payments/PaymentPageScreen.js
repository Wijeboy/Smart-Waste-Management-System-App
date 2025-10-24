import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, RadioButton, ActivityIndicator, Portal, Modal } from 'react-native-paper';

// Import services
import billingService from '../../services/billingService';
import paymentService from '../../services/paymentService';
import rewardsService from '../../services/rewardsService';

// Import components (assuming these exist in the project)
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Toast from '../../components/common/Toast';

const PaymentPageScreen = ({ navigation, route }) => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [credits, setCredits] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [appliedCredit, setAppliedCredit] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState(null);

  // Mock user ID (would come from auth context in a real app)
  const residentId = 'user-123';

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all required data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel for better performance
      const [invoiceData, creditsData, paymentMethodsData] = await Promise.all([
        billingService.requestInvoice(residentId),
        rewardsService.checkCredits(residentId),
        paymentService.getPaymentMethods(residentId)
      ]);
      
      setInvoice(invoiceData);
      setCredits(creditsData);
      setPaymentMethods(paymentMethodsData);
      setAmountDue(invoiceData.total);
      
      // Auto-select default payment method if available
      const defaultMethod = paymentMethodsData.find(method => method.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (paymentMethodsData.length > 0) {
        setSelectedPaymentMethod(paymentMethodsData[0].id);
      }
    } catch (err) {
      setError('Failed to load payment data. Please try again.');
      console.error('Error loading payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle applying credits
  const handleApplyCredits = () => {
    navigation.navigate('ApplyCredit', {
      availableCredits: credits.availablePoints,
      conversionRate: credits.conversionRate,
      invoiceTotal: invoice.total,
      onApplyCredits: handleCreditsApplied
    });
  };

  // Callback when credits are applied from ApplyCreditScreen
  const handleCreditsApplied = (pointsToApply) => {
    const creditValue = pointsToApply * credits.conversionRate;
    
    // Ensure credit doesn't exceed 50% of total
    const maxAllowedCredit = invoice.total * 0.5;
    const finalCredit = Math.min(creditValue, maxAllowedCredit);
    
    setAppliedCredit(finalCredit);
    setAmountDue(invoice.total - finalCredit);
  };

  // Function to handle adding a new payment method
  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod', {
      onPaymentMethodAdded: (newMethod) => {
        setPaymentMethods([...paymentMethods, newMethod]);
        setSelectedPaymentMethod(newMethod.id);
      }
    });
  };

  // Function to process payment
  const handlePayment = async () => {
    // Validate payment method selection if payment is needed
    if (amountDue > 0 && !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    setProcessingPayment(true);
    setError(null);
    
    try {
      // Prepare payment data
      const paymentData = {
        invoiceId: invoice.invoiceId,
        amount: amountDue,
        paymentMethodId: selectedPaymentMethod,
        appliedCredit: appliedCredit
      };
      
      // Process the payment
      const result = await paymentService.processPayment(paymentData);
      
      // Store transaction details for the success modal
      setTransactionDetails(result);
      
      // Show success modal
      setSuccessModalVisible(true);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Error processing payment:', err);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Function to close success modal and navigate back
  const handleSuccessDone = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Home');
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader type="payment" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{color: "#EF4444", fontSize: 24, fontWeight: 'bold'}}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Invoice Summary */}
      <Card style={styles.card}>
        <Card.Title title="Invoice Summary" />
        <Card.Content>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Invoice #:</Text>
            <Text style={styles.invoiceValue}>{invoice.invoiceId}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Due Date:</Text>
            <Text style={styles.invoiceValue}>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </View>
          
          {/* Invoice Items */}
          {invoice.items.map(item => (
            <View key={item.id} style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>{item.description}</Text>
              <Text style={styles.invoiceValue}>Rs. {item.amount.toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Subtotal:</Text>
            <Text style={styles.invoiceValue}>Rs. {invoice.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Tax:</Text>
            <Text style={styles.invoiceValue}>Rs. {invoice.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>Rs. {invoice.total.toFixed(2)}</Text>
          </View>
          
          {/* Applied Credit */}
          {appliedCredit > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.invoiceRow}>
                <Text style={styles.creditLabel}>Applied Credit:</Text>
                <Text style={styles.creditValue}>- Rs. {appliedCredit.toFixed(2)}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.amountDueLabel}>Amount Due:</Text>
                <Text style={styles.amountDueValue}>Rs. {amountDue.toFixed(2)}</Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Credit Points */}
      <Card style={styles.card}>
        <Card.Title title="Credit Points" />
        <Card.Content>
          <View style={styles.creditPointsContainer}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Available Points:</Text>
              <Text style={styles.pointsValue}>{credits.availablePoints}</Text>
              <Text style={styles.pointsSubtext}>
                (Worth Rs. {(credits.availablePoints * credits.conversionRate).toFixed(2)})
              </Text>
            </View>
            <Button 
              mode="contained" 
              onPress={handleApplyCredits}
              disabled={credits.availablePoints === 0 || appliedCredit > 0}
              style={styles.applyButton}
            >
              Apply Points
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Methods */}
      <Card style={styles.card}>
        <Card.Title title="Payment Method" />
        <Card.Content>
          <RadioButton.Group
            onValueChange={value => setSelectedPaymentMethod(value)}
            value={selectedPaymentMethod}
          >
            {paymentMethods.map(method => (
              <View key={method.id} style={styles.paymentMethodItem}>
                <RadioButton value={method.id} />
                <View style={styles.cardInfo}>
                  <Text style={{color: "#005257", fontSize: 24}}>
                    {method.cardType === 'visa' ? '💳' : '💳'}
                  </Text>
                  <Text style={styles.cardText}>
                    {method.cardType.toUpperCase()} •••• {method.last4}
                  </Text>
                  <Text style={styles.expiryText}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Add New Card Option */}
            <TouchableOpacity 
              style={styles.addCardButton} 
              onPress={handleAddPaymentMethod}
            >
              <Text style={{color: "#005257", fontSize: 24}}>+</Text>
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Pay Button */}
      <Button
        mode="contained"
        onPress={handlePayment}
        disabled={processingPayment || (amountDue > 0 && !selectedPaymentMethod)}
        loading={processingPayment}
        style={styles.payButton}
        labelStyle={styles.payButtonLabel}
      >
        {processingPayment ? 'Processing...' : `Pay Rs. ${amountDue.toFixed(2)}`}
      </Button>

      {/* Success Modal */}
      <Portal>
        <Modal
          visible={successModalVisible}
          onDismiss={handleSuccessDone}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={{color: "#34D399", fontSize: 48, fontWeight: 'bold'}}>✓</Text>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            
            {transactionDetails && (
              <>
                <Text style={styles.modalText}>
                  Transaction ID: {transactionDetails.transactionId}
                </Text>
                <Text style={styles.modalText}>
                  Amount Paid: Rs. {transactionDetails.amountPaid.toFixed(2)}
                </Text>
                {transactionDetails.appliedCredit > 0 && (
                  <Text style={styles.modalText}>
                    Credits Applied: Rs. {transactionDetails.appliedCredit.toFixed(2)}
                  </Text>
                )}
                <Text style={styles.modalText}>
                  Date: {new Date(transactionDetails.timestamp).toLocaleString()}
                </Text>
              </>
            )}
            
            <Button
              mode="contained"
              onPress={handleSuccessDone}
              style={styles.doneButton}
            >
              Done
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#005257',
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  invoiceValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  creditLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  creditValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  amountDueLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amountDueValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  creditPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005257',
  },
  pointsSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 8,
  },
  expiryText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 'auto',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addCardText: {
    fontSize: 14,
    color: '#005257',
    fontWeight: '500',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: '#005257',
    paddingVertical: 8,
    marginVertical: 24,
  },
  payButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 24,
  },
  modalText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#005257',
    marginTop: 24,
    width: '100%',
  },
});

export default PaymentPageScreen;