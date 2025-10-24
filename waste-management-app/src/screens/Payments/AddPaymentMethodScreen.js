import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddPaymentMethodModal from '../../components/payments/AddPaymentMethodModal';

/**
 * AddPaymentMethodScreen
 * Screen wrapper for the AddPaymentMethodModal component
 */
const AddPaymentMethodScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AddPaymentMethodModal 
        visible={true}
        onClose={() => navigation.goBack()}
        onSuccess={() => {
          // Navigate back to payment page on success
          navigation.navigate('PaymentPage');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default AddPaymentMethodScreen;