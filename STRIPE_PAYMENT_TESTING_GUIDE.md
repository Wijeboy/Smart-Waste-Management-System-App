# 💳 Stripe Payment Integration - Testing Guide

## 📋 Overview
This guide provides step-by-step instructions for testing the complete Stripe payment integration in the Smart Waste Management System.

**Implementation Date:** October 25, 2025  
**Payment Gateway:** Stripe (Test Mode)  
**Features:** Credit/Debit Card Payments, Saved Cards, Credit Points Integration

---

## 🔧 Pre-Testing Setup

### 1. **Backend Setup**

#### Start the Backend Server
```powershell
cd backend
npm start
```

**Verify Backend is Running:**
- Open browser and go to: `http://localhost:3001/api/health`
- Should see: `{"success": true, "message": "Server is running"}`

#### Verify Environment Variables
Check `backend/.env` file contains:
```
STRIPE_SECRET_KEY=sk_test_51SFr23ACfj16ELp7dAm0CAII6nj2LyPOF0DKSyqhEQQguSFBPmBay1WHft9lf9nk17vpNJfxUFAjPJDJXgJSVf1F00xCbajaIM
STRIPE_PUBLISHABLE_KEY=pk_test_51SFr23ACfj16ELp7g2H9jJYn8m1cCz3XhZ7VKqQe0K5qJm8Oe6Zv7Fz3Yy1rJ4wL5nH6tG8xK9sP2wQ3vR4uS5dM00ABCdefgh
```

### 2. **Frontend Setup**

#### Start the React Native App
```powershell
cd waste-management-app
npm start
```

Then press:
- `a` for Android emulator
- `i` for iOS simulator
- `w` for web browser

---

## 🧪 Test Scenarios

### Test Case 1: Basic Payment Flow (No Points)

#### Steps:
1. **Login as Resident**
   - Email: `nimal@gmail.com` (or your test resident account)
   - Password: (your password)

2. **Navigate to Payment Screen**
   - Go to bottom tab: **"Payment"**
   - Should see:
     - Available credit points
     - Payment summary ($75.00 by default)
     - "Pay Now" button

3. **Initiate Payment**
   - Click **"Pay Now"** button
   - Should navigate to **Payment Details Screen**

4. **Enter Card Details**
   - **Test Card:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/25`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **Cardholder Name:** Your name
   - **Email:** Should be pre-filled
   - **Address:** Enter test address (e.g., "123 Test St")
   - **City:** Enter city (e.g., "New York")
   - **Postal Code:** Enter code (e.g., "10001")

5. **Continue to Review**
   - Card field should turn green when complete
   - Click **"Continue to Review"** button
   - Should navigate to **Payment Review Screen**

6. **Review and Confirm**
   - Verify payment summary shows correctly
   - Verify billing details are correct
   - Check the **Terms and Conditions** checkbox
   - Click **"Pay $75.00 Now"** button

7. **Wait for Processing**
   - Should show "Processing Payment..." with loading indicator
   - Wait 3-5 seconds for Stripe to process

8. **Verify Success**
   - Should navigate to **Payment Success Screen**
   - Should show:
     - ✅ Success icon
     - Transaction ID
     - Payment details
     - Receipt information
   - Click **"Back to Dashboard"**

9. **Verify Database**
   - Check MongoDB for new payment record
   - Should have status: "completed"

**Expected Result:** ✅ Payment should complete successfully

---

### Test Case 2: Payment With Credit Points

#### Steps:
1. **Ensure You Have Points**
   - Go to Settings → Credit Points
   - Should see your available points
   - If you have 0 points, collect a bin first to earn points

2. **Navigate to Payment Screen**
   - Go to Payment tab
   - Click **"Apply Points"** button

3. **Apply Points**
   - Select preset amount (e.g., 100 points)
   - Verify discount shows (-$10.00)
   - Click **"Apply Points & Pay"**

4. **Complete Payment**
   - Follow same steps as Test Case 1
   - Notice final amount is reduced by points discount

5. **Verify Points Deduction**
   - After successful payment
   - Check "Remaining Credit Points" on success screen
   - Should show reduced points (original - applied)

6. **Verify in Credit Points Screen**
   - Go to Settings → Credit Points
   - Should see updated point balance

**Expected Result:** ✅ Points should be deducted and discount applied

---

### Test Case 3: Save Card for Future Payments

#### Steps:
1. **Start Payment Flow**
   - Navigate to Payment → Pay Now

2. **Enter Card Details**
   - Enter test card: `4242 4242 4242 4242`
   - Fill billing details
   - **Toggle ON:** "Save card for future payments" switch

3. **Complete Payment**
   - Continue to review → Pay
   - Wait for success

4. **Verify Card Saved** (Future Feature)
   - Next time you pay, saved card should appear
   - Can select saved card instead of entering new one

**Expected Result:** ✅ Card saved successfully (will show in future payments)

---

### Test Case 4: Invalid Card Number

#### Steps:
1. **Start Payment Flow**
   - Navigate to Payment → Pay Now

2. **Enter Invalid Card**
   - Card: `4000 0000 0000 0002` (Stripe test decline card)
   - Fill other details correctly

3. **Try to Pay**
   - Continue to review
   - Check terms
   - Click Pay

4. **Verify Error Handling**
   - Should show alert: "Payment Failed"
   - Should stay on review screen
   - Can try again with valid card

**Expected Result:** ✅ Error handled gracefully, user can retry

---

### Test Case 5: Incomplete Card Details

#### Steps:
1. **Start Payment Flow**
   - Navigate to Payment → Pay Now

2. **Enter Partial Card Info**
   - Card: `4242 4242` (incomplete)
   - Try to click "Continue to Review"

3. **Verify Validation**
   - Button should be disabled (grayed out)
   - Cannot proceed without complete card info

**Expected Result:** ✅ Validation prevents incomplete submissions

---

### Test Case 6: Missing Billing Details

#### Steps:
1. **Start Payment Flow**
   - Navigate to Payment → Pay Now

2. **Enter Card but Skip Billing**
   - Card: `4242 4242 4242 4242` (complete)
   - Leave address, city, or postal code empty

3. **Try to Continue**
   - Click "Continue to Review"
   - Should show alert: "Please enter billing address" (or city/postal code)

**Expected Result:** ✅ Validation catches missing fields

---

### Test Case 7: Network Failure Simulation

#### Steps:
1. **Start Payment Flow**
   - Navigate to Payment → Pay Now → enter details

2. **Disconnect Network**
   - Turn off WiFi or mobile data
   - Try to continue to review or pay

3. **Verify Error Handling**
   - Should show connection error
   - User can retry when connection restored

**Expected Result:** ✅ Graceful error handling for network issues

---

### Test Case 8: Payment History

#### Steps:
1. **Complete a Few Payments**
   - Make 2-3 test payments

2. **View Payment History** (Feature to be accessed)
   - Go to Settings or Payment tab
   - Look for "Payment History" option

3. **Verify Records**
   - Should see list of past payments
   - Each showing: date, amount, status
   - Can tap for details

**Expected Result:** ✅ All payments recorded and viewable

---

## 🃏 Stripe Test Cards

### Successful Payments
| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Success |
| `5555 5555 5555 4444` | Mastercard - Success |
| `3782 822463 10005` | American Express - Success |

### Declined Payments
| Card Number | Error |
|-------------|-------|
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |

### 3D Secure Cards (requires authentication)
| Card Number | Description |
|-------------|-------------|
| `4000 0027 6000 3184` | 3D Secure 2 (authentication required) |

**Note:** All test cards work with:
- Any future expiry date
- Any 3-digit CVC
- Any postal code

---

## 🔍 Backend Verification

### Check Payment in Database
```javascript
// In MongoDB Compass or mongo shell
db.payments.find().sort({createdAt: -1}).limit(5)
```

Should show:
```json
{
  "_id": "...",
  "user": "...",
  "paymentIntentId": "pi_...",
  "amount": 75,
  "appliedPoints": 0,
  "finalAmount": 75,
  "status": "completed",
  "paymentMethod": "card",
  "createdAt": "..."
}
```

### Check User Points Deduction
```javascript
db.users.findOne({email: "nimal@gmail.com"}, {creditPoints: 1})
```

Should show reduced points after payment with points applied.

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution:**
- Verify backend is running on port 3001
- Check API URL in `waste-management-app/src/services/api.js`
- Ensure your device/emulator can reach the backend IP

### Issue 2: "Stripe key error"
**Solution:**
- Verify `.env` file has correct Stripe keys
- Restart backend server after adding keys
- Check `App.js` has correct publishable key

### Issue 3: Card field not appearing
**Solution:**
- Ensure `@stripe/stripe-react-native` is installed
- Check StripeProvider wraps the app in `App.js`
- Try restarting the app

### Issue 4: Payment succeeds but points not deducted
**Solution:**
- Check backend logs for errors in `confirmPayment` function
- Verify user ID matches in payment request
- Check User model has `redeemPoints` method

### Issue 5: "Payment intent already succeeded"
**Solution:**
- Don't try to pay same intent twice
- Create new payment each time
- Clear app state and try again

---

## 📊 Test Results Checklist

Use this checklist to track your testing:

- [ ] Test Case 1: Basic Payment Flow (No Points)
- [ ] Test Case 2: Payment With Credit Points
- [ ] Test Case 3: Save Card for Future Payments
- [ ] Test Case 4: Invalid Card Number
- [ ] Test Case 5: Incomplete Card Details
- [ ] Test Case 6: Missing Billing Details
- [ ] Test Case 7: Network Failure Simulation
- [ ] Test Case 8: Payment History
- [ ] Backend verification completed
- [ ] Database records verified
- [ ] Points deduction verified
- [ ] Error handling tested
- [ ] UI/UX is smooth and intuitive

---

## 🚀 Production Deployment Checklist

Before going live with real payments:

### Backend
- [ ] Replace test Stripe keys with live keys in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL on backend server
- [ ] Set up Stripe webhooks for payment events
- [ ] Implement proper logging and monitoring
- [ ] Add rate limiting to payment endpoints
- [ ] Review and test error handling in production

### Frontend
- [ ] Update Stripe publishable key to live key in `App.js`
- [ ] Test on real devices (iOS and Android)
- [ ] Review payment flow UX
- [ ] Add analytics tracking for payment events
- [ ] Test with real payment amounts
- [ ] Implement receipt email notifications (if needed)

### Security
- [ ] Never commit Stripe keys to Git
- [ ] Use environment variables for all keys
- [ ] Implement webhook signature verification
- [ ] Add fraud prevention measures
- [ ] Set up PCI compliance requirements
- [ ] Review and update Terms & Conditions

---

## 📞 Support & Resources

### Stripe Resources
- **Dashboard:** https://dashboard.stripe.com/test/payments
- **Documentation:** https://stripe.com/docs/payments/accept-a-payment
- **Test Cards:** https://stripe.com/docs/testing

### Project Resources
- **Backend API:** `http://localhost:3001/api`
- **Payment Endpoints:** `/api/payments/*`
- **Logs Location:** Terminal where backend is running

---

## ✅ Testing Complete

Once all test cases pass:
1. Document any issues found
2. Fix critical bugs
3. Retest affected areas
4. Get user acceptance
5. Prepare for production deployment

---

**Happy Testing! 🎉**

If you encounter any issues not covered in this guide, check the backend logs and Stripe dashboard for more details.
