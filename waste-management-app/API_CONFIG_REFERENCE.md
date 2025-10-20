# API Configuration Quick Reference

## Current Configuration

The API service now automatically detects your platform and uses the appropriate URL:

**File**: `src/services/api.js`

```javascript
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';  // Android Emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';  // iOS Simulator
  } else if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';  // Web Browser
  }
  return 'http://localhost:5000/api';    // Default
};
```

## Testing Scenarios

### ✅ Testing on Android Emulator
**No changes needed** - Already configured!
- URL: `http://10.0.2.2:5000/api`
- Start backend, start app, test registration

### ✅ Testing on iOS Simulator
**No changes needed** - Already configured!
- URL: `http://localhost:5000/api`
- Start backend, start app, test registration

### ✅ Testing on Web Browser
**No changes needed** - Already configured!
- URL: `http://localhost:5000/api`
- Start backend, start app with `npm start` → press `w`

### ⚠️ Testing on Physical Android/iOS Device
**Requires manual configuration**:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Look for something like: `192.168.1.5` or `10.0.0.5`

2. Edit `src/services/api.js` and update the return statement:
   ```javascript
   const getApiUrl = () => {
     if (Platform.OS === 'android') {
       return 'http://10.0.2.2:5000/api';
     } else if (Platform.OS === 'ios') {
       return 'http://localhost:5000/api';
     } else if (Platform.OS === 'web') {
       return 'http://localhost:5000/api';
     }
     // Replace 192.168.1.5 with YOUR computer's IP
     return 'http://192.168.1.5:5000/api';
   };
   ```

3. Ensure your phone and computer are on the **same WiFi network**

4. Test backend is accessible from phone's browser:
   - Open browser on phone
   - Go to: `http://YOUR_IP:5000/api/health`
   - Should see: `{"success":true,"message":"Server is running",...}`

## Quick Test Commands

### Test Backend is Running
```bash
# In browser or terminal (curl)
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Test Backend from Different Device
```bash
# From your phone or another computer on same network
curl http://YOUR_COMPUTER_IP:5000/api/health

# Replace YOUR_COMPUTER_IP with actual IP
# Example: curl http://192.168.1.5:5000/api/health
```

## Troubleshooting

### Backend starts but app says "Cannot connect to server"

**For Android Emulator**:
- ✅ Check URL is `http://10.0.2.2:5000/api`
- ✅ NOT `http://localhost:5000/api`
- ✅ NOT `http://127.0.0.1:5000/api`

**For Physical Device**:
- ✅ Using your computer's IP address (not localhost)
- ✅ Phone and computer on same WiFi
- ✅ Backend accessible from phone's browser
- ✅ Firewall not blocking port 5000

### How to check if backend is accessible

**From your computer**:
```bash
curl http://localhost:5000/api/health
```

**From Android emulator**:
```bash
# In emulator's browser
http://10.0.2.2:5000/api/health
```

**From physical device**:
```bash
# In device's browser
http://YOUR_COMPUTER_IP:5000/api/health
```

If you see the health check response, backend is accessible!

## Platform Detection Reference

The app automatically detects which platform it's running on:

| Platform.OS Value | Device Type | API URL Used |
|-------------------|-------------|--------------|
| `'android'` | Android Emulator | `http://10.0.2.2:5000/api` |
| `'ios'` | iOS Simulator | `http://localhost:5000/api` |
| `'web'` | Web Browser | `http://localhost:5000/api` |
| Default | Physical Device | `http://localhost:5000/api` (needs manual update) |

## Development Workflow

### Standard Development (Emulator/Simulator)
1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd waste-management-app && npm start`
4. Press `a` (Android) or `i` (iOS)
5. Test registration - should work!

### Physical Device Testing
1. Find your computer's IP address
2. Update API URL in `src/services/api.js`
3. Restart Metro bundler
4. Test backend health check from phone's browser
5. Run app and test registration

## Environment Variables (Future Enhancement)

For better configuration management, consider using environment variables:

Create `.env` in `/waste-management-app/`:
```env
API_URL_ANDROID=http://10.0.2.2:5000/api
API_URL_IOS=http://localhost:5000/api
API_URL_WEB=http://localhost:5000/api
API_URL_DEVICE=http://192.168.1.5:5000/api
```

Then use a package like `react-native-dotenv` to load these values.

## Quick Copy-Paste Solutions

### For Android Emulator (Default - No Change Needed)
```javascript
return 'http://10.0.2.2:5000/api';
```

### For Physical Device (Update with Your IP)
```javascript
return 'http://192.168.1.5:5000/api';  // Change 192.168.1.5 to your IP
```

### For Testing Both
You can also detect if running on emulator vs device, but the simplest approach is to manually update for physical device testing, then revert back.

## Summary

✅ **Emulators/Simulators**: No configuration needed - works out of the box!
⚠️ **Physical Devices**: Update IP address once, ensure same WiFi network
🚀 **Backend**: Must be running and accessible for all scenarios
