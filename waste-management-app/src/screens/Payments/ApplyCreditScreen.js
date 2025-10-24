import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Slider } from 'react-native-paper';

const ApplyCreditScreen = ({ navigation, route }) => {
  // Get params from route
  const { availableCredits, conversionRate, invoiceTotal, onApplyCredits } = route.params;

  // State variables
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [creditValue, setCreditValue] = useState(0);
  const [newTotal, setNewTotal] = useState(invoiceTotal);
  const [error, setError] = useState(null);

  // Calculate maximum allowed points (50% of invoice total)
  const maxAllowedCreditValue = invoiceTotal * 0.5;
  const maxAllowedPoints = Math.floor(maxAllowedCreditValue / conversionRate);
  const maxPoints = Math.min(availableCredits, maxAllowedPoints);

  // Quick select point values
  const quickSelectValues = [20, 50, 100].filter(value => value <= maxPoints);
  if (maxPoints > 0 && !quickSelectValues.includes(maxPoints)) {
    quickSelectValues.push(maxPoints);
  }

  // Update credit value and new total when selected points change
  useEffect(() => {
    const value = selectedPoints * conversionRate;
    setCreditValue(value);
    setNewTotal(invoiceTotal - value);
    
    // Validate against business rules
    if (value > maxAllowedCreditValue) {
      setError(`Maximum credit allowed is Rs. ${maxAllowedCreditValue.toFixed(2)} (50% of bill)`);
    } else if (selectedPoints > availableCredits) {
      setError('Insufficient points available');
    } else {
      setError(null);
    }
  }, [selectedPoints, conversionRate, invoiceTotal, maxAllowedCreditValue, availableCredits]);

  // Handle quick select button press
  const handleQuickSelect = (points) => {
    setSelectedPoints(points);
  };

  // Handle apply and pay button press
  const handleApplyAndPay = () => {
    if (error) return;
    
    // Call the callback function from the parent screen
    if (onApplyCredits) {
      onApplyCredits(selectedPoints);
    }
    
    // Navigate back to payment page
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Apply Credit Points" />
        <Card.Content>
          {/* Available Points */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Available Balance:</Text>
            <Text style={styles.balanceValue}>{availableCredits} points</Text>
            <Text style={styles.balanceWorth}>
              (Worth Rs. {(availableCredits * conversionRate).toFixed(2)})
            </Text>
          </View>
          
          {/* Quick Select Buttons */}
          <View style={styles.quickSelectContainer}>
            <Text style={styles.quickSelectLabel}>Quick Select:</Text>
            <View style={styles.quickSelectButtons}>
              {quickSelectValues.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.quickSelectButton,
                    selectedPoints === value && styles.quickSelectButtonActive
                  ]}
                  onPress={() => handleQuickSelect(value)}
                >
                  <Text
                    style={[
                      styles.quickSelectButtonText,
                      selectedPoints === value && styles.quickSelectButtonTextActive
                    ]}
                  >
                    {value} pts
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Points to Apply: {selectedPoints} 
              {selectedPoints > 0 && ` (Rs. ${creditValue.toFixed(2)})`}
            </Text>
            <Slider
              value={selectedPoints}
              onValueChange={setSelectedPoints}
              minimumValue={0}
              maximumValue={maxPoints}
              step={1}
              minimumTrackTintColor="#34D399"
              thumbTintColor="#005257"
              style={styles.slider}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>0</Text>
              <Text style={styles.sliderMaxLabel}>{maxPoints}</Text>
            </View>
          </View>
          
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={{color: "#EF4444", fontSize: 16, fontWeight: 'bold'}}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Invoice Recalculation */}
          <View style={styles.recalculationContainer}>
            <View style={styles.recalculationRow}>
              <Text style={styles.recalculationLabel}>Original Total:</Text>
              <Text style={styles.recalculationValue}>
                Rs. {invoiceTotal.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.recalculationRow}>
              <Text style={styles.creditLabel}>Applied Credit:</Text>
              <Text style={styles.creditValue}>
                - Rs. {creditValue.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.recalculationRow}>
              <Text style={styles.newTotalLabel}>New Total:</Text>
              <Text style={styles.newTotalValue}>
                Rs. {newTotal.toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Apply & Pay Button */}
          <Button
            mode="contained"
            onPress={handleApplyAndPay}
            disabled={!!error || selectedPoints === 0}
            style={styles.applyButton}
          >
            Apply & Pay
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005257',
    marginTop: 4,
  },
  balanceWorth: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickSelectContainer: {
    marginBottom: 24,
  },
  quickSelectLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quickSelectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickSelectButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  quickSelectButtonActive: {
    backgroundColor: '#005257',
  },
  quickSelectButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  quickSelectButtonTextActive: {
    color: 'white',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderMinLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sliderMaxLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
  },
  recalculationContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  recalculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recalculationLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  recalculationValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  creditLabel: {
    fontSize: 14,
    color: '#059669',
  },
  creditValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  newTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  newTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  applyButton: {
    backgroundColor: '#005257',
  },
});

export default ApplyCreditScreen;