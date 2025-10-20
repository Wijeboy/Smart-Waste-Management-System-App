# Quick Start Guide

## Starting the Application

You need to run **both** backend and frontend servers for the app to work.

### Step 1: Start Backend Server

Open a terminal and run:
```bash
cd backend
npm start
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: [your-database-host]
```

Keep this terminal running!

### Step 2: Start Frontend App

Open a **NEW** terminal and run:
```bash
cd waste-management-app
npm start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for Web

### Step 3: Test Registration

1. Open the app on your device/emulator
2. Click "Sign Up" to go to registration screen
3. Fill in the form (use the date picker for Date of Birth!)
4. Click "Register"
5. Should successfully create account and login automatically

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is in `.env` file
- Make sure you're in the `backend` folder
- Try: `npm install` first if dependencies missing

### "Cannot connect to Server" error
- Make sure backend is running (Step 1)
- Check backend terminal shows "Server running on port 5000"
- For Android emulator: Should work automatically
- For physical device: Update IP address in `src/services/api.js`

### Date picker not showing
- Make sure you ran `npm install` in `waste-management-app` folder
- Restart Metro bundler (press `r` in terminal)

## Port Information

- **Backend API**: http://localhost:5000
- **Frontend Metro**: http://localhost:8081 (usually)

## Testing Backend Directly

Test if backend is working:
```bash
# In browser or terminal
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"Server is running","timestamp":"..."}
```

## Development Workflow

1. Start backend (`cd backend && npm start`)
2. Start frontend (`cd waste-management-app && npm start`)
3. Make code changes
4. Frontend auto-reloads
5. Backend needs restart if you change backend code (use `npm run dev` instead for auto-reload)

## Using Nodemon for Auto-Reload (Recommended)

For backend auto-reload on code changes:
```bash
cd backend
npm run dev
```

This uses nodemon to automatically restart the server when you save changes.

## Stopping the Servers

**Backend**: Press `Ctrl+C` in backend terminal
**Frontend**: Press `Ctrl+C` in frontend terminal

## Environment Variables

Your `.env` file in `/backend/` should have:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Never commit `.env` to git (it's already in .gitignore)

## Common Commands Reference

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd waste-management-app
npm install

# Start backend (manual restart on changes)
cd backend
npm start

# Start backend (auto-restart on changes)
cd backend
npm run dev

# Start frontend
cd waste-management-app
npm start

# Clear cache and start frontend
cd waste-management-app
npx expo start --clear
```

## Summary

✅ **Two terminals running at the same time**
✅ **Backend on port 5000**
✅ **Frontend on Metro bundler**
✅ **Both must be running for app to work**

Happy coding! 🚀
