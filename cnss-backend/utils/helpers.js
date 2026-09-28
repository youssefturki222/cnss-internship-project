/**
 * Utility Functions for Backend Operations
 * Includes password hashing and token generation helpers
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Hash password using bcrypt
 * Use this to hash user passwords before storing in database
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw error;
  }
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password from database
 * @returns {Promise<boolean>} - True if password matches
 */
async function verifyPassword(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('Error verifying password:', error.message);
    throw error;
  }
}

/**
 * Generate JWT token
 * @param {object} payload - Token data (userId, cin, etc.)
 * @param {string} secret - JWT secret key
 * @param {string} expiresIn - Expiration time (e.g., '7d')
 * @returns {string} - JWT token
 */
function generateToken(payload, secret, expiresIn = '7d') {
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw error;
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret key
 * @returns {object} - Decoded token payload
 */
function verifyJWT(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    throw error;
  }
}

/**
 * Generate a hash for a test user password
 * Usage: node -e "require('./utils/helpers').generateTestHash('password123')"
 * @param {string} password - Password to hash
 */
async function generateTestHash(password) {
  try {
    const hash = await hashPassword(password);
    console.log('Hashed Password:', hash);
    console.log('\nUse this hash in your SQL INSERT statement.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  const password = process.argv[2] || 'password123';
  generateTestHash(password);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyJWT,
};
