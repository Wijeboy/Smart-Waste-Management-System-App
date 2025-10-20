const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('nic')
    .trim()
    .notEmpty()
    .withMessage('NIC is required')
    .matches(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)
    .withMessage('Please provide a valid NIC number'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('phoneNo')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number')
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
