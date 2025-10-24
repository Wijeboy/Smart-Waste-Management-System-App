import { requestInvoice, applyCreditToInvoice, getBillingHistory } from '../billingService';

describe('Billing Service', () => {
  const mockResidentId = 'user123';
  const mockInvoiceId = 'inv123';

  test('requestInvoice should return invoice data', async () => {
    const invoice = await requestInvoice(mockResidentId);
    expect(invoice).toHaveProperty('invoiceId');
    expect(invoice).toHaveProperty('items');
    expect(invoice).toHaveProperty('totalAmount');
    expect(Array.isArray(invoice.items)).toBe(true);
  });

  test('applyCreditToInvoice should apply credits and return updated invoice', async () => {
    const creditAmount = 50;
    const result = await applyCreditToInvoice(mockInvoiceId, creditAmount);
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('updatedInvoice');
    expect(result.updatedInvoice).toHaveProperty('totalAmount');
    expect(result.updatedInvoice).toHaveProperty('creditApplied');
    expect(result.updatedInvoice).toHaveProperty('amountDue');
    expect(result.updatedInvoice.creditApplied).toBe(creditAmount);
  });

  test('applyCreditToInvoice should validate 50% rule', async () => {
    // Test with credit amount exceeding 50% of invoice
    const excessiveCredit = 1000;
    
    await expect(applyCreditToInvoice(mockInvoiceId, excessiveCredit))
      .rejects.toThrow('Credit amount exceeds 50% of invoice total');
  });

  test('getBillingHistory should return array of invoices', async () => {
    const history = await getBillingHistory(mockResidentId);
    
    expect(Array.isArray(history)).toBe(true);
    if (history.length > 0) {
      expect(history[0]).toHaveProperty('invoiceId');
      expect(history[0]).toHaveProperty('date');
      expect(history[0]).toHaveProperty('totalAmount');
      expect(history[0]).toHaveProperty('status');
    }
  });
});