const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeConnectionPool, closeConnectionPool } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================

// CORS Configuration - Allow requests from any origin (adjust in production)
app.use(cors({
  origin: '*', // Change to your frontend URL in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser - Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// Routes
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CNSS Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// ============================================
// Error Handling Middleware
// ============================================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('✗ Global error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ============================================
// Server Startup
// ============================================

async function startServer() {
  try {
    // Initialize Oracle Database Connection Pool
    await initializeConnectionPool();

    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔════════════════════════════════════════════╗
║   CNSS Backend API Server Started          ║
║   🚀 Running on port ${PORT}                  ║
║   📍 http://localhost:${PORT}                 ║
║   🌐 http://0.0.0.0:${PORT}                  ║
║   🔗 Health Check: /api/health              ║
║   🔐 Auth Endpoints: /api/auth/*            ║
╚════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n✓ Shutting down gracefully...');
      await closeConnectionPool();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n✓ Shutting down gracefully...');
      await closeConnectionPool();
      process.exit(0);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
