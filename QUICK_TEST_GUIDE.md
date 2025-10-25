# Quick Test Guide - Resident Features

## Prerequisites
1. Backend server running on port 3001
2. Frontend app running (Expo)
3. MongoDB running and connected

---

## Test Case 1: Register as Resident

**Steps:**
1. Open the app
2. Click "Sign Up" or "Register"
3. Fill in all required fields:
   - First Name: Test
   - Last Name: Resident
   - Username: resident1
   - Email: resident1@test.com
   - Password: password123
   - Confirm Password: password123
   - NIC: 123456789V
   - Date of Birth: Select any date
   - Phone: 0771234567
   - **Register As: Select "Resident"** ⬅️ Important!
4. Click "Register"

**Expected Result:**
- Success message appears
- Redirected to login screen

---

## Test Case 2: Login as Resident

**Steps:**
1. On login screen, enter:
   - Username: resident1
   - Password: password123
2. Click "Sign In"

**Expected Result:**
- Automatically redirected to **Resident Dashboard** (not collector dashboard)
- Dashboard shows: "Welcome back, Test Resident"
- Stats card shows all zeros initially
- FAB (+ button) visible at bottom right

---

## Test Case 3: Add a Bin

**Steps:**
1. On Resident Dashboard, click the **+ button** (bottom right)
2. Fill in the form:
   - Location: "123 Main Street, Colombo"
   - Zone: Select "Zone A"
   - Bin Type: Select "General Waste"
   - Capacity: 100
   - Latitude: 6.9271
   - Longitude: 79.8612
   - Notes (optional): "My home bin"
3. Click "Add Bin"

**Expected Result:**
- Success message appears
- Modal closes
- Bin appears in dashboard with:
  - Auto-generated Bin ID (e.g., BIN001)
  - Location
  - Zone badge
  - Status: ACTIVE
  - Fill Level: 0%

---

## Test Case 4: View Collection Schedule

**Steps:**
1. On Resident Dashboard, tap on the bin card you created
2. In the alert dialog, select "View Schedule"

**Expected Result:**
- Message appears: "No upcoming collections scheduled for this bin"
- This is expected since no route has been created yet

---

## Test Case 5: Admin Views Resident Bin

**Steps:**
1. Logout from resident account
2. Login as admin:
   - Username: admin
   - Password: admin123
3. Navigate to "Bin Management" from admin dashboard
4. Scroll to find the resident's bin

**Expected Result:**
- Resident bin appears in the list
- Shows "🏠 Owner: Test Resident" below location
- Has "RESIDENT" badge in blue
- Can be edited/deleted like any other bin

---

## Test Case 6: Admin Creates Route with Resident Bin

**Steps:**
1. Still logged in as admin
2. Navigate to "Route Management" → "Create Route"
3. Fill in route details:
   - Route Name: "Test Route 1"
   - Schedule Date: Tomorrow's date
   - Schedule Time: 10:00 AM
4. Add bins to route - **include the resident bin** you created
5. Assign route to a collector
6. Create the route

**Expected Result:**
- Route created successfully
- Resident bin included in route
- Route assigned to collector

---

## Test Case 7: Collector Collects Resident Bin

**Steps:**
1. Logout from admin
2. Login as the collector assigned to the route
3. Navigate to "My Routes"
4. Start the route
5. Navigate to the resident bin
6. Click "Mark as Collected"
7. **Enter weight**: 25 (kg)
8. Confirm collection
9. Complete the route

**Expected Result:**
- Bin marked as collected
- Weight recorded: 25 kg
- Route completion shows correct statistics

---

## Test Case 8: Resident Views Collection Details

**Steps:**
1. Logout from collector account
2. Login back as resident (resident1)
3. View Resident Dashboard

**Expected Result:**
- Bin card now shows "Latest Collection" section:
  - 🗓️ Date and time of collection
  - ⚖️ Weight: 25 kg
  - 👤 Collected by: [Collector's name]
- Fill level reset to 0%

---

## Test Case 9: View Schedule After Route Assignment

**Steps:**
1. Admin creates another route for tomorrow with the resident bin
2. Login as resident
3. Tap the bin card
4. Select "View Schedule"

**Expected Result:**
- Alert shows upcoming collection:
  - Date and time
  - Assigned collector name

---

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** 
- Make sure backend is running: `cd backend && npm start`
- Check API_URL in `waste-management-app/src/services/api.js`
- Use network IP (not localhost) for mobile devices

### Issue: Resident dashboard not showing after login
**Solution:**
- Check that role was properly selected during registration
- Verify user role in database: should be "resident"
- Clear app cache and restart

### Issue: Bin not showing in admin panel
**Solution:**
- Refresh the bin list (pull down)
- Check that bin was created successfully (check backend logs)
- Verify owner field is populated in database

### Issue: Collection details not appearing for resident
**Solution:**
- Ensure collector entered weight when collecting
- Check that route was completed properly
- Verify bin.latestCollection is populated in database

---

## Database Verification

### Check User Role
```javascript
// In MongoDB
db.users.find({ username: "resident1" })
// Should show: role: "resident"
```

### Check Bin Owner
```javascript
// In MongoDB
db.bins.find({ owner: { $exists: true } })
// Should show your resident bins with owner ObjectId
```

### Check Latest Collection
```javascript
// In MongoDB
db.bins.find({ "latestCollection.collectedAt": { $exists: true } })
// Should show bins with collection details after collector completes route
```

---

## Quick Command Reference

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd waste-management-app
npm start
# Then press 'a' for Android or 'i' for iOS
```

### Clear Cache (if needed)
```bash
cd waste-management-app
npm start -- --clear
```

---

## Test Data Reference

**Admin Account:**
- Username: admin
- Password: admin123

**Test Resident Account:**
- Username: resident1
- Email: resident1@test.com
- Password: password123

**Sample Bin Coordinates (Sri Lanka):**
- Colombo: 6.9271, 79.8612
- Kandy: 7.2906, 80.6337
- Galle: 6.0535, 80.2210

---

**Happy Testing! 🎉**

If you find any bugs or issues, note down:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
