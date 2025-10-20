# Network Request Fix & Date Picker Implementation

## Issues Fixed

### 1. Network Request Failed ✅
**Problem**: Registration was failing with "Network request failed" error.

**Root Cause**: The API URL was hardcoded to `http://localhost:5000/api`, which doesn't work correctly across different platforms:
- **Android Emulator**: Cannot reach `localhost` on host machine
- **Physical Device**: Cannot reach `localhost` on development machine
- **iOS Simulator**: Works with `localhost` but inconsistent

**Solution**: Implemented platform-specific API URL detection in `/waste-management-app/src/services/api.js`:

```javascript
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  } else if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  return 'http://localhost:5000/api';
};
```

**Additional Improvements**:
- Better error messages for network failures
- Clear indication when server is not reachable
- Instructions for physical device setup

### 2. Date Picker Implementation ✅
**Problem**: Users had to manually type date in YYYY-MM-DD format, which was error-prone.

**Solution**: Implemented native date picker using `@react-native-community/datetimepicker`:
- **Beautiful UI**: Calendar icon with formatted date display
- **Easy Selection**: Native date picker for both iOS and Android
- **Validation**: Automatic date format validation
- **Constraints**: Maximum date is today, minimum date is 1900
- **Cross-platform**: Works on iOS, Android, and Web

## Setup Instructions

### Step 1: Install New Dependencies

Navigate to the frontend folder and install the new package:

```bash
cd waste-management-app
npm install
```

This will install `@react-native-community/datetimepicker` which was added to `package.json`.

### Step 2: Configure for Physical Devices (Optional)

If you're testing on a **physical device**, you need to update the API URL with your computer's IP address:

#### Find Your Computer's IP Address:

**Windows**:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.5`)

**Mac/Linux**:
```bash
ifconfig
```
Look for "inet" under your active network (e.g., `192.168.1.5`)

#### Update API Configuration:

Edit `/waste-management-app/src/services/api.js`:

```javascript
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  } else if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  // For physical devices, uncomment and replace with your IP:
  return 'http://YOUR_IP_ADDRESS:5000/api'; // e.g., http://192.168.1.5:5000/api
};
```

**Important**: Make sure your phone and computer are on the **same WiFi network**.

### Step 3: Start the Backend

```bash
cd backend
npm run dev
```

Server should start on `http://localhost:5000`

### Step 4: Start the Frontend

```bash
cd waste-management-app
npm start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## Testing the Fixes

### Test Network Connection

1. Open the app on your device/emulator
2. Navigate to the registration screen
3. Fill in the form
4. Click "Register"
5. Should now successfully connect to the backend

**If still failing**, check:
- ✅ Backend is running (`http://localhost:5000/api/health` should return OK in browser)
- ✅ Using correct API URL for your platform (see table below)
- ✅ Firewall/antivirus not blocking port 5000
- ✅ For physical devices: same WiFi network

### Test Date Picker

1. On registration screen, find "Date of Birth" field
2. Click the field (shows "Select Date of Birth" initially)
3. Date picker should appear:
   - **Android**: Material Design date picker dialog
   - **iOS**: Spinning wheel date picker
   - **Web**: Browser's native date picker
4. Select a date
5. Date should display in readable format (e.g., "January 1, 1990")
6. Date is stored in YYYY-MM-DD format for API

## Platform-Specific API URLs

| Platform | API URL | Notes |
|----------|---------|-------|
| Android Emulator | `http://10.0.2.2:5000/api` | Special alias for host machine |
| iOS Simulator | `http://localhost:5000/api` | Can access localhost directly |
| Web | `http://localhost:5000/api` | Running in browser |
| Physical Device | `http://YOUR_IP:5000/api` | Replace YOUR_IP (e.g., 192.168.1.5) |

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solutions**:
1. Verify backend is running: Check terminal for "Server running on port 5000"
2. Test backend health: Visit `http://localhost:5000/api/health` in browser
3. Check platform-specific URL is correct
4. For physical devices: Ensure same WiFi network
5. Check firewall settings (allow port 5000)

### Issue: Date picker not showing
**Solutions**:
1. Run `npm install` in waste-management-app folder
2. Restart Metro bundler (press `R` in terminal)
3. For Android: Rebuild app (`npm run android`)
4. For iOS: `cd ios && pod install && cd ..` then `npm run ios`

### Issue: "Network request failed" on physical device
**Solutions**:
1. Update API URL with your computer's IP address (see Step 2 above)
2. Ensure phone and computer on same WiFi
3. Check if backend is accessible from phone's browser: `http://YOUR_IP:5000/api/health`
4. Disable VPN if active
5. Check router/firewall settings

### Issue: Date format validation error
**Solution**: The date picker automatically formats correctly. If you see this error, ensure you're using the date picker button, not typing manually.

## Files Modified

### Frontend Changes:
1. **`/waste-management-app/package.json`**
   - Added `@react-native-community/datetimepicker` dependency

2. **`/waste-management-app/src/services/api.js`**
   - Added platform-specific API URL detection
   - Improved network error handling
   - Better error messages

3. **`/waste-management-app/src/screens/Auth/RegisterScreen.js`**
   - Replaced date text input with date picker button
   - Added DateTimePicker component
   - Added date formatting functions
   - Added date picker state management
   - Added styles for date picker UI

## Features of New Date Picker

✅ **User-Friendly**: Native date picker for each platform
✅ **Validation**: Automatic format validation
✅ **Constraints**: Can't select future dates or dates before 1900
✅ **Visual Feedback**: Calendar icon and formatted display
✅ **Cross-Platform**: Consistent experience on all devices
✅ **Accessible**: Works with screen readers and accessibility features

## API Response Examples

### Successful Registration:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "nic": "123456789V",
      "dateOfBirth": "1990-01-01",
      "phoneNo": "0771234567"
    },
    "token": "jwt_token_here"
  }
}
```

### Network Error (Improved Message):
```
"Cannot connect to server. Make sure the backend is running and accessible."
```

## Verification Checklist

Before testing, ensure:
- [ ] Backend server is running (port 5000)
- [ ] MongoDB is running
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Correct API URL for your platform/device
- [ ] Same WiFi network (for physical devices)
- [ ] Port 5000 is not blocked by firewall

## Next Steps

With these fixes, you should be able to:
1. Successfully register new users from any platform
2. Easily select date of birth with native date picker
3. Get clear error messages if connection fails
4. Test on emulators and physical devices

If you continue to experience issues, check the console logs in:
- **Backend**: Terminal where server is running
- **Frontend**: Metro bundler terminal
- **Device**: React Native Debugger or Chrome DevTools

## Support

For additional help:
1. Check backend logs for API errors
2. Check frontend Metro bundler for JavaScript errors
3. Verify API URL matches your setup
4. Test backend directly with Postman/cURL
5. Ensure all dependencies are installed
