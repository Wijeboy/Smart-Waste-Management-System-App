# Phase 1 Testing Guide - Bin Management

## ✅ Implementation Complete!

All Phase 1 files have been created. Now let's test everything.

---

## 🚀 Step 1: Seed the Database

First, let's add some sample bins to the database.

```bash
cd backend
node scripts/seedBins.js
```

**Expected Output:**
```
Connecting to MongoDB...
✅ MongoDB Connected
Clearing existing bins...
✅ Existing bins cleared
Inserting sample bins...
✅ 10 sample bins inserted

📊 Bins Summary:
   Total: 10
   Active: 8
   Full: 1
   Maintenance: 1

📦 By Type:
   General Waste: 4
   Recyclable: 3
   Organic: 2
   Hazardous: 1

🗺️  By Zone:
   Zone A: 3
   Zone B: 3
   Zone C: 2
   Zone D: 2

✅ Seeding completed successfully!
```

---

## 🖥️ Step 2: Start the Backend

Make sure the backend is running:

```bash
cd backend
npm start
```

**Expected Output:**
```
Server running in development mode on port 5000
Local:   http://localhost:5000
Network: http://192.168.1.8:5000
Server is ready to accept connections from any network interface
MongoDB Connected: cluster0-shard-00-00.d3qam.mongodb.net
```

---

## 📱 Step 3: Start the Frontend

In a **new terminal**:

```bash
cd waste-management-app
npm start
```

Then press `a` for Android emulator (or `i` for iOS).

---

## 🧪 Step 4: Watch the Console Logs

### Backend Console Should Show:
When you login and the app loads bins:
```
2025-10-20T... - GET /api/bins
Request body: {}
```

### Frontend (Metro Bundler) Should Show:
```
🗑️ Fetching bins from API...
✅ Bins fetched: 10
```

---

## 📋 Step 5: Manual Testing Checklist

### Test 1: View Bins
- [ ] Login to the app
- [ ] Navigate to any screen that uses bins
- [ ] Bins should load from API (10 bins)
- [ ] Check Metro Bundler logs for "Bins fetched: 10"

### Test 2: Check Bin Data
Verify that bins have correct data structure:
- [ ] `binId` (e.g., "BIN001")
- [ ] `location` (e.g., "Colombo 01 - Fort Area")
- [ ] `zone` (e.g., "Zone A")
- [ ] `binType` (e.g., "General Waste")
- [ ] `fillLevel` (0-100)
- [ ] `status` (active/full/maintenance)

### Test 3: Loading States
- [ ] Shows loading indicator while fetching
- [ ] Loading state clears when data arrives
- [ ] No crash if bins are empty

### Test 4: Error Handling
- [ ] Stop backend server
- [ ] Reload app
- [ ] Should show error message
- [ ] Should not crash app

---

## 🧪 API Testing with Postman (Optional)

### Test 1: Get All Bins
```
GET http://localhost:5000/api/bins
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
```

**Expected**: 200 OK, array of 10 bins

### Test 2: Get Single Bin
```
GET http://localhost:5000/api/bins/BIN_ID_HERE
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
```

**Expected**: 200 OK, single bin object

### Test 3: Get Bin Stats
```
GET http://localhost:5000/api/bins/stats
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
```

**Expected**: 200 OK with statistics

### Test 4: Filter by Zone
```
GET http://localhost:5000/api/bins/zone/Zone%20A
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
```

**Expected**: 200 OK, bins from Zone A only

### Test 5: Create New Bin
```
POST http://localhost:5000/api/bins
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
  Content-Type: application/json
Body:
{
  "location": "Test Location",
  "zone": "Zone A",
  "binType": "General Waste",
  "capacity": 100,
  "fillLevel": 50,
  "weight": 50,
  "coordinates": {
    "lat": 6.9271,
    "lng": 79.8612
  }
}
```

**Expected**: 201 Created with new bin data

### Test 6: Update Bin
```
PUT http://localhost:5000/api/bins/BIN_ID_HERE
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
  Content-Type: application/json
Body:
{
  "fillLevel": 75,
  "weight": 75
}
```

**Expected**: 200 OK with updated bin

### Test 7: Update Fill Level
```
PATCH http://localhost:5000/api/bins/BIN_ID_HERE/fillLevel
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
  Content-Type: application/json
Body:
{
  "fillLevel": 95,
  "weight": 95
}
```

**Expected**: 200 OK, status should change to "full" if fillLevel >= 90

### Test 8: Delete Bin
```
DELETE http://localhost:5000/api/bins/BIN_ID_HERE
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
```

**Expected**: 200 OK with success message

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to server"
**Check:**
- Backend is running (`npm start` in backend folder)
- Backend shows "Server running on port 5000"
- API URL in frontend matches your setup (192.168.1.8 for Android)

### Issue: "Unauthorized" error
**Check:**
- You are logged in
- Token is valid
- Auth headers are being sent

### Issue: Bins not showing in app
**Check:**
- Bins were seeded (run `node scripts/seedBins.js`)
- Check MongoDB has bins: `db.bins.find()`
- Check console logs for errors
- Verify `isAuthenticated` is true

### Issue: Empty bins array
**Solution:**
```bash
# Re-seed the database
cd backend
node scripts/seedBins.js
```

### Issue: "Bin not found" when accessing specific bin
**Check:**
- Using correct MongoDB `_id` (not `binId`)
- Bin exists in database
- ID format is correct (24 character hex string)

---

## 📊 Verify Database Directly (Optional)

Using MongoDB Compass or mongo shell:

```javascript
// Connect to database
use waste_management

// Count bins
db.bins.count()
// Should return: 10

// View all bins
db.bins.find().pretty()

// View bins by zone
db.bins.find({ zone: "Zone A" }).pretty()

// View bins by status
db.bins.find({ status: "active" }).pretty()

// View bin statistics
db.bins.aggregate([
  {
    $group: {
      _id: "$binType",
      count: { $sum: 1 }
    }
  }
])
```

---

## ✅ Success Criteria

Phase 1 is complete when:
- [x] Backend model, controller, routes created
- [x] Seed script runs successfully
- [x] API endpoints return correct data
- [x] Frontend fetches bins from API
- [x] BinsContext loads real data (not mock)
- [x] Console shows "Bins fetched: 10"
- [x] No errors in console
- [x] App displays bins correctly
- [ ] CRUD operations tested
- [ ] Loading states work
- [ ] Error handling works

---

## 📝 Quick Test Script

Run these commands in sequence:

```bash
# Terminal 1 - Backend
cd backend
node scripts/seedBins.js  # Seed data
npm start                  # Start server

# Terminal 2 - Frontend
cd waste-management-app
npm start                  # Start app
# Press 'a' for Android

# Watch both console outputs for:
# Backend: GET /api/bins
# Frontend: ✅ Bins fetched: 10
```

---

## 🎯 Next Steps After Testing

Once Phase 1 testing is complete:

1. **Document any issues found**
2. **Fix bugs if any**
3. **Take screenshots of working features**
4. **Commit code to git**
5. **Move to Phase 2** (Routes & Collections)

---

## 🐛 Common Bugs to Watch For

1. **ID Mismatch**: Using `bin.id` instead of `bin._id`
2. **Type Names**: Using old type names (`general` vs `General Waste`)
3. **Missing Auth**: Trying to fetch bins before login
4. **Wrong Filters**: Using incorrect filter parameters
5. **State Not Updating**: Forgetting to update local state after API calls

---

## 💡 Testing Tips

1. **Keep both terminals visible** - Watch for errors in both
2. **Use React Native Debugger** - See all console logs clearly
3. **Test offline mode** - Stop backend and see error handling
4. **Test with no data** - Clear bins and verify empty state
5. **Test CRUD in order** - Create → Read → Update → Delete

---

## 📞 Need Help?

If tests fail:
1. Check both console outputs
2. Verify backend is connected to MongoDB
3. Check if bins were seeded
4. Verify authentication is working
5. Look for error messages

---

**Happy Testing! 🚀**

_All tests passing = Phase 1 Complete!_
