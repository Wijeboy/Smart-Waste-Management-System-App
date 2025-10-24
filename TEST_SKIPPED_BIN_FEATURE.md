# 🧪 Quick Test Guide: Skipped Bin Notifications

## Prerequisites
- Backend running on port 5000
- Frontend running (Expo)
- At least one resident user with bins
- At least one collector user
- At least one admin user

---

## 🎯 Test Scenario 1: Basic Skip Display

### Step 1: Setup (Admin)
1. Login as **admin**
2. Go to **Bin Management**
3. Note a resident bin (e.g., BIN0005)
4. Go to **Route Management**
5. Create new route:
   - Name: "Test Skip Route"
   - Add the resident bin
   - Assign to a collector
   - Set today's date

### Step 2: Skip the Bin (Collector)
1. Logout and login as **collector**
2. Go to **My Routes**
3. Open "Test Skip Route"
4. Complete pre-route checklist (if required)
5. Start the route
6. When you see the resident bin, click on it
7. Click **"Skip Bin"** button
8. Enter reason: **"Gate locked, no access"**
9. Submit
10. Complete the route (all other bins collected or skipped)

### Step 3: Verify Display (Resident)
1. Logout and login as **resident** (bin owner)
2. Go to **Home/Dashboard**
3. Find your bin card

**✅ Expected Result:**
```
┌──────────────────────────────────┐
│ BIN0005 • ACTIVE    [Type Badge] │
│ 📍 Location                      │
│ Zone: Zone A                     │
│                                  │
│ ⚠️ BIN SKIPPED DURING           │ ← Yellow/Orange Section
│    COLLECTION                    │
│                                  │
│ 📝 Reason: Gate locked, no      │
│    access                        │
│ 🗓️ Oct 25, 2025 - 10:30 AM     │
│ 👤 Collector: [Name]            │
│ 📍 Route: Test Skip Route       │
│                                  │
│ 💡 This information will be     │
│    cleared when your bin is     │
│    successfully collected.      │
└──────────────────────────────────┘
```

---

## 🎯 Test Scenario 2: Multiple Skips

### Step 1: Skip Again
1. Login as **admin**
2. Create **second route** with same bin
3. Assign to collector

### Step 2: Collector Skips Again
1. Login as **collector**
2. Start second route
3. Skip the bin again with different reason: **"Bin damaged"**
4. Complete route

### Step 3: Verify Multiple Skips
1. Login as **resident**
2. View dashboard
3. Pull to refresh

**✅ Expected Result:**
- Should see **TWO** skip incidents
- Newest skip at top
- Divider line between them
- Each with its own reason, date, collector, route

---

## 🎯 Test Scenario 3: Clear Skips After Collection

### Step 1: Collect the Bin
1. Login as **admin**
2. Create **third route** with the same bin
3. Assign to collector

### Step 2: Collector Collects Successfully
1. Login as **collector**
2. Start third route
3. Click on the bin
4. Click **"Mark as Collected"**
5. Enter weight: **30 kg**
6. Submit
7. Complete route

### Step 3: Verify Skips Cleared
1. Login as **resident**
2. View dashboard
3. Pull to refresh

**✅ Expected Result:**
- ❌ Yellow skip section **GONE**
- ✅ "Latest Collection" section appears
- ✅ Shows weight: 30 kg
- ✅ Shows collector name
- ✅ Shows collection date/time

---

## 🎯 Test Scenario 4: No Skips

### Test a bin that was never skipped

1. Login as **resident**
2. View a bin that has only been collected (never skipped)

**✅ Expected Result:**
- No yellow skip section
- Only shows scheduled/collection sections
- Normal bin display

---

## 🔍 What to Check

### Visual Elements
- [ ] Yellow/orange background color (`#FFF3E0`)
- [ ] Orange left border (`#FF9800`)
- [ ] Warning badge with icon (⚠️)
- [ ] Skip reason prominently displayed
- [ ] Date/time formatted correctly
- [ ] Collector name shown
- [ ] Route name shown
- [ ] Info note at bottom
- [ ] Divider between multiple skips (if applicable)

### Functionality
- [ ] Skip appears after route completed
- [ ] Skip reason matches what collector entered
- [ ] Multiple skips all displayed
- [ ] Skips cleared after successful collection
- [ ] No errors in console
- [ ] Pull-to-refresh updates data
- [ ] Works on different screen sizes

### Backend Verification
- [ ] Check backend logs for skip data fetching
- [ ] Verify API response includes `skippedIncidents` array
- [ ] Confirm date filtering logic works
- [ ] Route status is 'completed' for skips to show

---

## 🐛 Troubleshooting

### Skip Not Showing
1. ✅ Verify route status is 'completed'
2. ✅ Check collector entered skip reason
3. ✅ Confirm bin belongs to resident
4. ✅ Refresh resident dashboard
5. ✅ Check backend logs for errors

### Multiple Skips Not Showing
1. ✅ Verify all routes are completed
2. ✅ Check each route has skip status and notes
3. ✅ Verify skip dates are after last collection

### Skip Not Clearing
1. ✅ Confirm bin was actually collected (not skipped again)
2. ✅ Verify collection has later date than skip
3. ✅ Check `latestCollection.collectedAt` exists
4. ✅ Refresh dashboard

---

## 📱 Testing Checklist

- [ ] Test on Android
- [ ] Test on iOS (if available)
- [ ] Test with different bin types
- [ ] Test with different zones
- [ ] Test with multiple residents
- [ ] Test with multiple collectors
- [ ] Test pull-to-refresh
- [ ] Test with slow network
- [ ] Test with no internet (should show cached data)

---

## 🎉 Success Criteria

✅ Skip incidents displayed correctly  
✅ Warning styling (yellow/orange) applied  
✅ All skip details shown (reason, date, collector, route)  
✅ Multiple skips handled properly  
✅ Skips cleared after successful collection  
✅ No crashes or errors  
✅ Good UX and clear messaging  

---

## 📸 Screenshot Locations

After testing, you should see:

1. **Skip Section**: Yellow/orange warning box
2. **Skip Details**: Reason, date, collector, route
3. **Multiple Skips**: Stacked with dividers
4. **Info Note**: Helpful message at bottom
5. **Cleared State**: Skip gone, collection shown

---

**Ready to Test!** 🚀

Start with Scenario 1, then proceed through all scenarios to verify complete functionality.
