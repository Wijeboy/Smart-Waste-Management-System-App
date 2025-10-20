# Smart Waste Management System - Backend API

Backend API for the Smart Waste Management System built with Node.js, Express, and MongoDB.

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- MongoDB database integration
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

4. Make sure MongoDB is running on your system

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
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

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```
Note: You can use either username or email in the username field.

#### Get Profile (Protected)
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

#### Update Profile (Protected)
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNo": "0771234567"
}
```

### Health Check
- **GET** `/api/health`

## Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   └── User.js          # User model schema
├── routes/
│   └── auth.js          # Authentication routes
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── README.md           # This file
└── server.js           # Entry point
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- Protected routes with middleware
- Role-based access control support

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Success Responses

Successful responses follow this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Testing

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Any HTTP client

## Notes

- Make sure MongoDB is running before starting the server
- Change the `JWT_SECRET` in production
- The NIC validation supports both old (9 digits + V/X) and new (12 digits) formats
- Phone numbers must be 10 digits
- Passwords must be at least 6 characters
