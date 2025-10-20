# Admin Login Guide

## Overview
A quick admin login feature has been implemented with hardcoded credentials for accessing the admin dashboard.

## Hardcoded Credentials
- **Username:** `admin`
- **Password:** `admin123`

## API Endpoint

### Admin Login
**POST** `/api/auth/admin-login`

#### Request Body
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": "admin-1729450320000",
      "firstName": "Admin",
      "lastName": "User",
      "username": "admin",
      "email": "admin@wastesystem.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid admin credentials"
}
```

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Using JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:5000/api/auth/admin-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
console.log(data.data.token); // Use this token for authenticated requests
```

## Using the Token

Once you receive the token, include it in the Authorization header for protected routes:

```javascript
const response = await fetch('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Implementation Details

1. **Controller:** `backend/controllers/authController.js` - Contains the `adminLogin` function
2. **Route:** `backend/routes/auth.js` - Exposes `/admin-login` endpoint
3. **Middleware:** `backend/middleware/auth.js` - Updated to handle admin tokens

## Security Notes

⚠️ **WARNING:** This is a quick implementation with hardcoded credentials for development purposes.

For production:
- Replace with proper admin user management
- Use environment variables for credentials
- Implement proper password hashing
- Add rate limiting
- Consider multi-factor authentication
- Use a database-backed admin user system

## Role-Based Access

The admin token includes `role: 'admin'`, which can be used with the `authorize` middleware:

```javascript
const { protect, authorize } = require('../middleware/auth');

// Only admins can access
router.get('/admin-only', protect, authorize('admin'), adminOnlyController);

// Admins and collectors can access
router.get('/staff-only', protect, authorize('admin', 'collector'), staffController);
```

## Testing

A test script is available at `backend/test-admin-login.js`:

```bash
node backend/test-admin-login.js
```
