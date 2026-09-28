const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * Public Routes
 */

// Login endpoint
router.post('/login', authController.login);

// Register endpoint
router.post('/register', authController.register);

/**
 * Protected Routes (require valid JWT token)
 */

// Get current user profile
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
