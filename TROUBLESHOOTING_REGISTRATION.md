# Troubleshooting Registration Issues

## Current Status
You're experiencing "Registration Failed - Cannot connect to server" error even though the backend is running.

## Step-by-Step Debugging

### Step 1: Verify Backend is Running and Accessible

**A. Check Backend Server:**
```bash
# Backend terminal should show:
Server running in development mode on port 5000
MongoDB Connected: [your-cluster]
```

**B. Test Health Endpoint:**
Open browser and go to: `http://localhost:5000/api/health`

Should see:
```json
{"success":true,"message":"Server is running","timestamp":"..."}
```

**C. Test Registration Endpoint Directly:**
```bash
cd backend
node test-registration.js
```

This will test if the registration endpoint works from the backend side.

### Step 2: Check Frontend Logs

**Look at Metro Bundler Console:**
When you try to register, you should see logs like:
```
===========================================
API Service Initialized
Platform: android (or ios/web)
API URL: http://10.0.2.2:5000/api (or http://localhost:5000/api)
===========================================

API Request: http://10.0.2.2:5000/api/auth/register
API Method: POST
API Headers: {Content-Type: 'application/json'}
```

**If you don't see these logs:**
- Frontend might not be reaching the API service
- React Native debugger might not be connected

### Step 3: Platform-Specific Checks

#### For Android Emulator:
1. **API URL should be:** `http://10.0.2.2:5000/api`
2. **Test from emulator browser:**
   - Open Chrome in Android emulator
   - Go to: `http://10.0.2.2:5000/api/health`
   - Should return success message
   
   **If it fails in browser:**
   - Emulator can't reach your host machine
   - Try restarting emulator
   - Or use your computer's actual IP address

#### For iOS Simulator:
1. **API URL should be:** `http://localhost:5000/api`
2. **Test from simulator browser:**
   - Open Safari in simulator
   - Go to: `http://localhost:5000/api/health`
   - Should return success message

#### For Physical Device:
1. **Must use your computer's IP address**
2. **Find your IP:**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.5)
   
   # Mac/Linux
   ifconfig
   # Look for inet (e.g., 192.168.1.5)
   ```
3. **Update API URL in `src/services/api.js`:**
   ```javascript
   const getApiUrl = () => {
     if (Platform.OS === 'android') {
       return 'http://10.0.2.2:5000/api';
     } else if (Platform.OS === 'ios') {
       return 'http://localhost:5000/api';
     } else if (Platform.OS === 'web') {
       return 'http://localhost:5000/api';
     }
     // For physical devices (uncomment and update):
     return 'http://YOUR_IP_HERE:5000/api';  // e.g., http://192.168.1.5:5000/api
   };
   ```
4. **Ensure same WiFi network**
5. **Test from phone browser:**
   - Open browser on phone
   - Go to: `http://YOUR_IP:5000/api/health`

### Step 4: Common Issues and Solutions

#### Issue 1: "Network request failed" after long loading
**Possible Causes:**
- Wrong API URL for your platform
- Backend not accessible from emulator/device
- Firewall blocking connections
- CORS issues (unlikely since we have cors() enabled)

**Solutions:**
1. **Check API URL matches your platform:**
   - Android Emulator → `10.0.2.2:5000`
   - iOS Simulator → `localhost:5000`
   - Physical Device → Your IP:5000

2. **Test backend accessibility:**
   - From emulator/device browser, visit health endpoint
   - If fails, backend not reachable from that device

3. **Check Windows Firewall:**
   - Search "Windows Defender Firewall"
   - Click "Allow an app through firewall"
   - Ensure Node.js is allowed for Private networks

4. **Try disabling antivirus temporarily** (just to test)

#### Issue 2: Backend receiving requests but registration fails
**Check Backend Console:**
Should show:
```
2025-10-20T... - POST /api/auth/register
Request body: { firstName: '...', ... }
```

**If you see error in backend:**
- Read the error message
- Could be validation error
- Could be MongoDB connection issue
- Could be duplicate user

#### Issue 3: Request times out
**Solutions:**
1. Increase timeout (add to fetch options):
   ```javascript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds
   
   fetch(url, {
     ...options,
     signal: controller.signal
   });
   ```

2. Check if MongoDB is responding slowly
3. Check network speed

### Step 5: Enable React Native Debugger

**To see all console.logs:**

1. **In Android Emulator:**
   - Press `Ctrl+M` (or `Cmd+M` on Mac)
   - Select "Debug"
   - Opens Chrome DevTools
   - Go to Console tab

2. **In iOS Simulator:**
   - Press `Cmd+D`
   - Select "Debug"

3. **Or use React Native Debugger app:**
   - Download from: https://github.com/jhen0409/react-native-debugger
   - More user-friendly

### Step 6: Test with Sample Data

**Use these exact values to test:**
```
First Name: John
Last Name: Doe
Username: johndoe123
Email: john.doe@test.com
Password: test1234
Confirm Password: test1234
NIC: 123456789V
Date of Birth: 1990-01-01 (use date picker)
Phone: 0771234567
```

### Step 7: Check Backend Logs

**After attempting registration, backend should show:**

**Success:**
```
2025-10-20T... - POST /api/auth/register
Request body: { firstName: 'John', lastName: 'Doe', ... }
```

**If you see this but frontend still shows error:**
- Backend IS receiving the request
- Issue is with response getting back to frontend
- Check CORS configuration
- Check if response is being sent correctly

**If you DON'T see this:**
- Backend is NOT receiving the request
- Network/routing issue
- Wrong API URL

## Quick Diagnostic Commands

```bash
# 1. Test backend health
curl http://localhost:5000/api/health

# 2. Test registration from command line
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"username\":\"test123\",\"email\":\"test@test.com\",\"password\":\"test123\",\"nic\":\"123456789V\",\"dateOfBirth\":\"1990-01-01\",\"phoneNo\":\"0771234567\"}"

# 3. Check if port 5000 is in use
netstat -ano | findstr :5000

# 4. Test from Android emulator (in emulator's terminal/browser)
curl http://10.0.2.2:5000/api/health
```

## What to Send Me for Further Help

If still not working, provide:

1. **Frontend Console Output** (Metro Bundler terminal)
   - Look for the "API Request:" logs
   - Any errors shown

2. **Backend Console Output**
   - Look for incoming requests
   - Any errors shown

3. **Platform You're Testing On**
   - Android Emulator / iOS Simulator / Physical Device

4. **Browser Test Results**
   - Can you access `http://10.0.2.2:5000/api/health` from emulator browser?
   - Or `http://localhost:5000/api/health` from your computer browser?

5. **Network Configuration**
   - Are you behind a corporate firewall?
   - Using VPN?
   - Antivirus software?

## Expected Flow (When Working)

**Frontend (React Native):**
```
1. User fills form and clicks Register
2. validateForm() passes
3. Calls register(userData)
4. AuthContext.register() calls apiService.register()
5. apiService makes fetch request
6. Console shows: "API Request: http://..."
7. Waits for response...
8. Console shows: "API Response Status: 201"
9. Console shows: "API Response Data: {success: true, ...}"
10. Stores token in AsyncStorage
11. Navigates to main app
```

**Backend (Express):**
```
1. Receives POST /api/auth/register
2. Logs: "2025-... - POST /api/auth/register"
3. Validates input
4. Checks if user exists
5. Creates user in MongoDB
6. Generates JWT token
7. Sends 201 response with user data and token
8. No errors in console
```

## Last Resort: Clean Reset

If nothing works:

```bash
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Clean backend
cd backend
rm -rf node_modules
npm install
npm start

# 3. Clean frontend (in new terminal)
cd waste-management-app
rm -rf node_modules
npm install
npx expo start --clear

# 4. Try again
```

## Success Indicators

✅ Backend logs show incoming POST request
✅ Frontend logs show "API Response Status: 201"
✅ User is created in MongoDB
✅ Token is generated and returned
✅ App navigates to Dashboard
✅ User can logout and login again

## Still Stuck?

Provide the console outputs from both frontend and backend, and I'll help identify the exact issue!
