# Authentication System Setup Guide

This guide explains the authentication system that has been implemented for the Smart Waste Management System application.

## Overview

The application now includes a complete authentication system with:
- User registration with detailed information (First Name, Last Name, NIC, Date of Birth, Phone Number, Username, Email)
- User login with username/email and password
- JWT-based authentication
- Secure password hashing
- Protected routes
- Persistent login state

## System Architecture

### Backend (Node.js + Express + MongoDB)
- **Location**: `/backend/` folder
- **Database**: MongoDB
- **Authentication**: JWT tokens with bcryptjs password hashing
- **Validation**: Input validation using express-validator

### Frontend (React Native + Expo)
- **Location**: `/waste-management-app/` folder
- **State Management**: React Context API
- **Storage**: AsyncStorage for token persistence
- **Navigation**: React Navigation with conditional routing

## Setup Instructions

### 1. Backend Setup

#### Install MongoDB
Ensure MongoDB is installed and running on your system.
- Download from: https://www.mongodb.com/try/download/community
- Default connection: `mongodb://localhost:27017`

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
The `.env` file has been created with default values. Update if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste_management
JWT_SECRET=waste_management_secret_key_2024_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**IMPORTANT**: Change `JWT_SECRET` in production!

#### Start the Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The server will start on `http://localhost:5000`

### 2. Frontend Setup

#### Install Frontend Dependencies
```bash
cd waste-management-app
npm install
```

This will install the new dependency: `@react-native-async-storage/async-storage`

#### Update API URL (if needed)
If your backend is not running on `localhost:5000`, update the API_URL in:
`/waste-management-app/src/services/api.js`

```javascript
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

For Android emulator, use: `http://10.0.2.2:5000/api`
For iOS simulator, use: `http://localhost:5000/api`
For physical device, use your computer's IP address

#### Start the Frontend App
```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## API Endpoints

### Authentication Endpoints

#### 1. Register User
- **URL**: `POST /api/auth/register`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "nic": "123456789V",
  "dateOfBirth": "1990-01-01",
  "phoneNo": "0771234567"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### 2. Login
- **URL**: `POST /api/auth/login`
- **Body**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```
Note: `username` field accepts either username or email
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get Profile (Protected)
- **URL**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### 4. Update Profile (Protected)
- **URL**: `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNo": "0771234567"
}
```

#### 5. Health Check
- **URL**: `GET /api/health`
- **Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

### Registration Validation
- **firstName**: Required, max 50 characters
- **lastName**: Required, max 50 characters
- **username**: Required, 3-30 characters, unique, lowercase
- **email**: Required, valid email format, unique
- **password**: Required, minimum 6 characters
- **nic**: Required, format: 9 digits + V/X or 12 digits, unique
- **dateOfBirth**: Required, ISO 8601 format (YYYY-MM-DD)
- **phoneNo**: Required, exactly 10 digits

### Login Validation
- **username**: Required (accepts username or email)
- **password**: Required

## Frontend Screens

### 1. Login Screen
- **Location**: `/waste-management-app/src/screens/Auth/LoginScreen.js`
- **Features**:
  - Username/email and password input
  - Form validation
  - Loading state
  - Error handling
  - Navigate to Register screen

### 2. Register Screen
- **Location**: `/waste-management-app/src/screens/Auth/RegisterScreen.js`
- **Features**:
  - All required fields with validation
  - Password confirmation
  - NIC format validation (9 digits + V/X or 12 digits)
  - Date of birth in YYYY-MM-DD format
  - Phone number validation (10 digits)
  - Loading state
  - Error handling
  - Navigate to Login screen

### 3. Profile Screen (Updated)
- **Location**: `/waste-management-app/src/screens/BinCollection/ProfileScreen.js`
- **New Features**:
  - Logout button with confirmation
  - Clears authentication state and redirects to login

## Context and State Management

### AuthContext
- **Location**: `/waste-management-app/src/context/AuthContext.js`
- **Provides**:
  - `user`: Current user object or null
  - `loading`: Loading state
  - `error`: Error messages
  - `isAuthenticated`: Boolean authentication status
  - `login(username, password)`: Login function
  - `register(userData)`: Registration function
  - `logout()`: Logout function
  - `updateUserProfile(profileData)`: Update profile function

## Navigation Flow

### RootNavigator
- **Location**: `/waste-management-app/src/navigation/RootNavigator.js`
- **Logic**:
  - Shows loading screen while checking authentication
  - If not authenticated: Shows Login/Register screens
  - If authenticated: Shows main app screens (Dashboard, etc.)

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **JWT Tokens**: Secure, signed tokens with expiration
3. **Protected Routes**: Middleware checks authentication on protected endpoints
4. **Input Validation**: Server-side validation for all inputs
5. **Token Storage**: Secure storage using AsyncStorage
6. **Unique Constraints**: Email, username, and NIC must be unique

## Testing the System

### Using Postman/Thunder Client

1. **Test Health Check**:
   - GET `http://localhost:5000/api/health`

2. **Register a User**:
   - POST `http://localhost:5000/api/auth/register`
   - Include all required fields in JSON body

3. **Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Use username/email and password

4. **Get Profile**:
   - GET `http://localhost:5000/api/auth/profile`
   - Add header: `Authorization: Bearer <token_from_login>`

### Using the Mobile App

1. Start the backend server
2. Start the Expo app
3. You'll see the Login screen
4. Click "Sign Up" to register a new user
5. Fill in all required information
6. After registration, you'll be automatically logged in
7. Use the app normally
8. Click "Logout" in the Profile screen to logout

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
- Ensure MongoDB is running: `mongod` or check services
- Check connection string in `.env`

**Port Already in Use**:
- Change PORT in `.env` file
- Or kill the process using port 5000

**Module Not Found**:
- Run `npm install` in the backend folder

### Frontend Issues

**Cannot Connect to Backend**:
- Check if backend is running
- Update API_URL in `src/services/api.js`
- For Android emulator, use `10.0.2.2` instead of `localhost`

**AsyncStorage Error**:
- Run `npm install` to ensure all dependencies are installed
- Clear app cache and rebuild

**Authentication Persisting Issues**:
- Clear AsyncStorage: In DevTools or manually in code
- Check token expiration (default: 7 days)

## File Structure

```
backend/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js

waste-management-app/src/
├── context/
│   └── AuthContext.js
├── navigation/
│   ├── AppNavigator.js (existing)
│   └── RootNavigator.js (new)
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   └── RegisterScreen.js
│   └── BinCollection/
│       └── ProfileScreen.js (updated)
└── services/
    └── api.js
```

## Next Steps

1. **Add Role-Based Access Control**: Use the `role` field in User model
2. **Add Password Reset**: Implement forgot password functionality
3. **Add Email Verification**: Verify email addresses on registration
4. **Add Social Login**: Integrate Google/Facebook login
5. **Add Profile Picture Upload**: Allow users to upload avatars
6. **Add Two-Factor Authentication**: Extra security layer
7. **Add Activity Logging**: Track user actions
8. **Add Admin Dashboard**: Manage users from admin panel

## Support

For issues or questions:
1. Check the backend logs in terminal
2. Check the frontend errors in console
3. Review the API responses in network tab
4. Verify MongoDB is running and accessible
