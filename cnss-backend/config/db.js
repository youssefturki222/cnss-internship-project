const oracledb = require('oracledb');
require('dotenv').config();

// Initialize connection pool
let connectionPool;

/**
 * Initialize Oracle Database Connection Pool
 */
async function initializeConnectionPool() {
  try {
    // Enable Thick Mode to support your local Oracle 11g database version
    oracledb.initOracleClient({ 
      libDir: 'C:\\oracle\\instantclient' 
    });
    console.log('✓ Oracle Instant Client Initialized (Thick Mode Enabled)');

    connectionPool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log('✓ Oracle Database Connection Pool Created');
  } catch (error) {
    console.error('✗ Error initializing connection pool:', error.message);
    throw error;
  }
}

/**
 * Get a connection from the pool
 */
async function getConnection() {
  try {
    if (!connectionPool) {
      await initializeConnectionPool();
    }
    return await connectionPool.getConnection();
  } catch (error) {
    console.error('✗ Error getting connection from pool:', error.message);
    throw error;
  }
}

/**
 * Close all connections in the pool
 */
async function closeConnectionPool() {
  try {
    if (connectionPool) {
      await connectionPool.close();
      console.log('✓ Oracle Connection Pool Closed');
    }
  } catch (error) {
    console.error('✗ Error closing connection pool:', error.message);
    throw error;
  }
}

module.exports = {
  initializeConnectionPool,
  getConnection,
  closeConnectionPool,
};
