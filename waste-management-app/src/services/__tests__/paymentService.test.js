import { processPayment, getPaymentMethods, addPaymentMethod, setDefaultPaymentMethod, detectCardType } from '../paymentService';

describe('Payment Service', () => {
  const mockResidentId = 'user123';
  const mockCardData = {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe'
  };

  test('processPayment should handle successful payment', async () => {
    const paymentData = {
      invoiceId: 'inv123',
      amount: 100,
      paymentMethodId: 'card123',
      creditAmount: 50
    };
    
    const result = await processPayment(paymentData);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('transactionId');
    expect(result).toHaveProperty('message');
  });

  test('getPaymentMethods should return array of payment methods', async () => {
    const methods = await getPaymentMethods(mockResidentId);
    expect(Array.isArray(methods)).toBe(true);
    if (methods.length > 0) {
      expect(methods[0]).toHaveProperty('id');
      expect(methods[0]).toHaveProperty('cardType');
      expect(methods[0]).toHaveProperty('last4');
    }
  });

  test('addPaymentMethod should return success response', async () => {
    const result = await addPaymentMethod(mockResidentId, mockCardData);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('paymentMethod');
    expect(result.paymentMethod).toHaveProperty('id');
  });

  test('setDefaultPaymentMethod should update default method', async () => {
    const result = await setDefaultPaymentMethod('card123');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
  });

  test('detectCardType should identify Visa cards', () => {
    const cardType = detectCardType('4111111111111111');
    expect(cardType).toBe('visa');
  });

  test('detectCardType should identify Mastercard cards', () => {
    const cardType = detectCardType('5555555555554444');
    expect(cardType).toBe('mastercard');
  });

  test('detectCardType should identify Amex cards', () => {
    const cardType = detectCardType('371449635398431');
    expect(cardType).toBe('amex');
  });

  test('detectCardType should return unknown for invalid cards', () => {
    const cardType = detectCardType('1234567890123456');
    expect(cardType).toBe('unknown');
  });
});