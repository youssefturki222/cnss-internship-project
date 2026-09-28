const jwt = require('jsonwebtoken');

/**
 * Verify JWT Token Middleware
 * Protects routes by verifying the JWT token in the Authorization header
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please include Authorization header with Bearer token.',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }
    res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

module.exports = {
  verifyToken,
};
