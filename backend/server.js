const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/users', require('./routes/users')); // Credit points routes accessible at /api/users
app.use('/api/admin/users', require('./routes/users'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/admin/routes', require('./routes/routes'));
app.use('/api/admin/analytics', require('./routes/analytics'));
app.use('/api/payments', require('./routes/payments')); // Payment routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3001;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://192.168.1.8:${PORT}`);
    console.log('Server is ready to accept connections from any network interface');
  });
}

// Export app for testing
module.exports = app;
