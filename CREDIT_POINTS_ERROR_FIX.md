# Credit Points Error Fix

## Issue
Getting "JSON Parse error: Unexpected character: <" when accessing Credit Points or Payment Screen.

## Root Cause
The `/api/users` routes were only mounted under `/api/admin/users`, but the frontend was trying to access them at `/api/users/:id/credit-points`.

## Fix Applied
Updated `backend/server.js` to mount the user routes at both `/api/users` and `/api/admin/users`:

```javascript
app.use('/api/users', require('./routes/users')); // For credit points (residents)
app.use('/api/admin/users', require('./routes/users')); // For admin functions
```

## How to Test

### 1. Restart Backend Server
```powershell
# Stop the current server (Ctrl+C in the terminal)
# Then restart it:
cd backend
npm start
```

### 2. Test with a Resident Account
1. Login as a Resident user:
   - Email: `nimal@gmail.com` or `sss@gmail.com`
   - Password: (whatever password you set)

2. Navigate to Settings → Credit Points
   - Should show total points (initially 0)
   - Should show empty recent collections list

3. Navigate to Payment tab
   - Should show available points
   - Should show payment summary ($75.00)

### 3. Test Points Earning
To test the full flow, you need to:
1. Login as a Collector
2. Start a route that includes bins owned by the resident
3. Collect those bins with actual weight (e.g., 5 kg)
4. Logout and login as the Resident
5. Check Credit Points - should see the points earned!

## API Endpoints Now Available

- `GET /api/users/:id/credit-points` - Get user's credit points
- `POST /api/users/:id/redeem-points` - Redeem points for discount
- `GET /api/users/:id/recent-collections` - Get recent collection history

## Resident User IDs in Database
- Namal Perera: `68fb6d72db66a95c311a8f7f`
- Ss Ss: `68fbbacea4d8865bce7a69ae`

## Testing Points Earning

To manually add some points for testing:
```javascript
// In MongoDB or through a script
db.users.updateOne(
  { email: 'nimal@gmail.com' },
  { $set: { creditPoints: 150 } }
)
```

Or collect a bin owned by the resident with weight to automatically earn points.

## Next Steps
1. Restart the backend server
2. Test the Credit Points screen
3. Test the Payment screen  
4. Try redeeming points (need at least 50 points)

The routes are now properly configured and should work!
