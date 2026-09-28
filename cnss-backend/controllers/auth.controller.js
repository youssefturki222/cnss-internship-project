const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendAccountCreatedEmail } = require('../utils/email');

const getConfiguredMobileAccountTable = () => {
  return process.env.MOBILE_ACCOUNT_TABLE || process.env.MOBILE_USERS_TABLE || null;
};

const findMobileAccountTable = async (connection) => {
  const configuredTable = getConfiguredMobileAccountTable();
  if (configuredTable) {
    const checkQuery = `
      SELECT COUNT(*) AS CNT
      FROM USER_TABLES
      WHERE UPPER(TABLE_NAME) = :tableName
    `;

    const result = await connection.execute(checkQuery, { tableName: configuredTable.toUpperCase() }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    if (Number(result.rows[0].CNT) > 0) {
      return configuredTable;
    }

    return null;
  }

  const candidates = ['MOBILE_USERS', 'MOBILE_ACCOUNTS', 'APP_USERS', 'AUTH_USERS', 'USERS'];

  for (const tableName of candidates) {
    const checkQuery = `
      SELECT COUNT(*) AS CNT
      FROM USER_TABLES
      WHERE UPPER(TABLE_NAME) = :tableName
    `;

    const result = await connection.execute(checkQuery, { tableName: tableName.toUpperCase() }, { outFormat: 2 });
    const exists = Number(result.rows[0].CNT) > 0;

    if (exists) {
      return tableName;
    }
  }

  return null;
};

const getTableColumns = async (connection, tableName) => {
  const query = `
    SELECT COLUMN_NAME
    FROM USER_TAB_COLUMNS
    WHERE UPPER(TABLE_NAME) = :tableName
  `;

  const result = await connection.execute(query, { tableName: tableName.toUpperCase() }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
  return (result.rows || []).map((row) => row.COLUMN_NAME.toUpperCase());
};

const getPreferredColumn = (columns, preferredNames) => {
  for (const columnName of preferredNames) {
    const match = columns.find((existingColumn) => existingColumn === columnName.toUpperCase());
    if (match) {
      return match;
    }
  }

  return null;
};

/**
 * Register User
 * POST /api/auth/register
 * Body: { ASS_MAT, BEN_IU, email, password }
 */
const register = async (req, res) => { 
  let connection; 
  try { 
    console.log('Registration request received'); 
    const { ASS_MAT, BEN_IU, email, password } = req.body; 

    if (!ASS_MAT || !BEN_IU || !email || !password) { 
      return res.status(400).json({ 
        success: false, 
        message: 'ASS_MAT, BEN_IU, email and password are required.', 
      }); 
    } 

    connection = await db.getConnection(); 
    console.log('Checking enterprise BENEFICIAIRE table'); 

    const enterpriseQuery = ` 
      SELECT COUNT(*) AS CNT FROM BENEFICIAIRE  
      WHERE ASS_MAT = :assMat AND BEN_IU = :benIu 
    `; 

    const enterpriseResult = await connection.execute( 
      enterpriseQuery, 
      { assMat: ASS_MAT, benIu: BEN_IU }, 
      { outFormat: oracledb.OUT_FORMAT_OBJECT } 
    ); 

    const enterpriseExists = enterpriseResult.rows && 
      enterpriseResult.rows.length > 0 && 
      Number(enterpriseResult.rows[0].CNT) > 0; 

    if (!enterpriseExists) { 
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid ASS_MAT or ASS_IU', 
      }); 
    } 

    console.log('Enterprise verified'); 

    const tableName = await findMobileAccountTable(connection); 

    if (!tableName) { 
      const fallbackTableName = getConfiguredMobileAccountTable() || 'MOBILE_USERS';

      return res.status(500).json({ 
        success: false, 
        message: 'No mobile account table found in the Oracle schema. Create one before continuing.', 
        sql: `CREATE TABLE ${fallbackTableName} ( ID NUMBER PRIMARY KEY, ASS_MAT VARCHAR2(50), ASS_IU VARCHAR2(50), EMAIL VARCHAR2(255), PASSWORD_HASH VARCHAR2(255), CREATED_AT TIMESTAMP DEFAULT SYSDATE );`, 
      }); 
    } 

    const columns = await getTableColumns(connection, tableName); 

    const assMatColumn = getPreferredColumn(columns, ['ASS_MAT']); 
    const assIuColumn = getPreferredColumn(columns, ['ASS_IU']); 
    const emailColumn = getPreferredColumn(columns, ['EMAIL', 'EMAIL_ADDRESS', 'MAIL']); 
    const passwordColumn = getPreferredColumn(columns, ['PASSWORD_HASH', 'PASSWORD', 'PASS_HASH', 'PASSHASH']); 

    if (!assMatColumn || !assIuColumn || !emailColumn || !passwordColumn) { 
      return res.status(500).json({ 
        success: false, 
        message: `The table ${tableName} does not include the required columns for mobile registration.`, 
      }); 
    } 

    const emailCheckQuery = ` 
      SELECT COUNT(*) AS CNT FROM ${tableName} 
      WHERE UPPER(${emailColumn}) = UPPER(:email) 
    `; 

    const emailCheckResult = await connection.execute(
      emailCheckQuery, 
      { email }, 
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    ); 

    const emailExists = emailCheckResult.rows && 
      emailCheckResult.rows.length > 0 && 
      Number(emailCheckResult.rows[0].CNT) > 0; 

    if (emailExists) { 
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered', 
      }); 
    } 

    const hashedPassword = await bcrypt.hash(password, 10); 

    const insertQuery = ` 
      INSERT INTO ${tableName} (${assMatColumn}, ${assIuColumn}, ${emailColumn}, ${passwordColumn}) 
      VALUES (:assMat, :assIu, :email, :passwordHash) 
    `; 

    await connection.execute( 
      insertQuery, 
      { 
        assMat: ASS_MAT, 
        assIu: BEN_IU, 
        email, 
        passwordHash: hashedPassword 
      }, 
      { autoCommit: false } 
    ); 

    await connection.commit(); 

    console.log('Mobile account created'); 


    // ================= EMAIL DEBUG LOGS =================

    try {

      console.log("========== EMAIL DEBUG ==========");

      console.log("[1] Recipient email from signup:");
      console.log(email);

      console.log("[2] Sender email from .env:");
      console.log(process.env.EMAIL_USER);

      console.log("[3] Password exists:");
      console.log(Boolean(process.env.EMAIL_PASS));

      console.log("[4] Password length:");
      console.log(process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "No password");

      console.log("[5] Sending email now...");

      await sendAccountCreatedEmail(email);

      console.log("[6] Email sent successfully");

      console.log("=================================");


    } catch (emailError) {

      console.error("========== EMAIL ERROR ==========");

      console.error("Email sending failed:");
      console.error(emailError.message);

      console.error("=================================");

    }


    return res.status(201).json({ 
      success: true, 
      message: 'Account created successfully', 
    }); 

  } catch (error) { 

    console.error('✗ Register error:', error.message); 

    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined, 
    }); 

  } finally { 

    if (connection) { 

      try { 
        await connection.close(); 

      } catch (error) { 
        console.error('✗ Error closing connection:', error.message); 
      } 
    } 
  } 
};

/**
 * Login User
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Request received with email:', email);

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password in request body');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    console.log('[LOGIN] Connecting to database');
    connection = await db.getConnection();

     
    const columns = await getTableColumns(connection, 'MOBILE_USERS');
     
    const emailColumn = getPreferredColumn(columns, ['EMAIL', 'EMAIL_ADDRESS', 'MAIL']);
    const passwordColumn = getPreferredColumn(columns, ['PASSWORD_HASH', 'PASSWORD', 'PASS_HASH', 'PASSHASH']);
    const assMatColumn = getPreferredColumn(columns, ['ASS_MAT']);
    const assIuColumn = getPreferredColumn(columns, ['ASS_IU']);

    console.log('[LOGIN] Resolved email column:', emailColumn);
    console.log('[LOGIN] Resolved password column:', passwordColumn);

    if (!emailColumn || !passwordColumn) {
      return res.status(500).json({
        success: false,
        message: 'The MOBILE_USERS table does not include the required email/password columns for login.',
      });
    }

    const query = `
      SELECT ${assMatColumn || 'ASS_MAT'}, ${assIuColumn || 'ASS_IU'}, ${emailColumn}, ${passwordColumn}
      FROM MOBILE_USERS
      WHERE UPPER(${emailColumn}) = UPPER(:email)
    `;

     
    const result = await connection.execute(query, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
     

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];
    console.log('[LOGIN] User row returned:', user);
    const storedPasswordHash = user[passwordColumn] || user.PASSWORD_HASH || user.PASSWORD || null;
    console.log('[LOGIN] Stored password hash found:', Boolean(storedPasswordHash));

    if (!storedPasswordHash) {
      return res.status(500).json({
        success: false,
        message: 'No password hash found for this account.',
      });
    }

    console.log('[LOGIN] Comparing password with bcrypt');
    const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
    console.log('[LOGIN] Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      {
        assMat: user[assMatColumn] || user.ASS_MAT || null,
        assIu: user[assIuColumn] || user.ASS_IU || null,
        email: user[emailColumn] || user.EMAIL || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          assMat: user[assMatColumn] || user.ASS_MAT || null,
          assIu: user[assIuColumn] || user.ASS_IU || null,
          email: user[emailColumn] || user.EMAIL || null,
        },
      },
    });
  } catch (error) {
    console.error('✗ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('✗ Error closing connection:', error.message);
      }
    }
  }
};

/**
 * Get Current User Profile (Protected Route)
 * GET /api/auth/me
 * Requires valid JWT token
 */
const getCurrentUser = async (req, res) => {
  let connection;
  try {
    const { ASS_MAT, assMat } = req.user || {};
    const userAssMat = ASS_MAT || assMat;

    if (!userAssMat) {
      return res.status(400).json({
        success: false,
        message: 'ASS_MAT is required to retrieve the user profile.',
      });
    }

    // Get connection from pool
    connection = await db.getConnection();

    try {
      const currentUserResult = await connection.execute(
        'SELECT USER FROM DUAL',
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      console.log('[DATABASE USER]:', currentUserResult.rows?.[0]?.USER || currentUserResult.rows?.[0]?.USER?.toString());
    } catch (debugError) {
      console.error('[DATABASE USER] Debug query failed:', debugError.message);
    }

    try {
      const availableTablesResult = await connection.execute(
        "SELECT TABLE_NAME FROM USER_TABLES WHERE TABLE_NAME IN ('ASSURE','MOBILE_USERS','BENEFICIAIRE')",
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const availableTables = (availableTablesResult.rows || []).map((row) => row.TABLE_NAME).join(', ');
      console.log('[AVAILABLE TABLES]:', availableTables);
    } catch (debugError) {
      console.error('[AVAILABLE TABLES] Debug query failed:', debugError.message);
    }

    try {
      const tableOwnersResult = await connection.execute(
        "SELECT OWNER, TABLE_NAME FROM ALL_TABLES WHERE TABLE_NAME IN ('ASSURE','MOBILE_USERS','BENEFICIAIRE')",
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const tableOwners = (tableOwnersResult.rows || []).map((row) => `${row.OWNER}.${row.TABLE_NAME}`).join(', ');
      console.log('[TABLE OWNERS]:', tableOwners);
    } catch (debugError) {
      console.error('[TABLE OWNERS] Debug query failed:', debugError.message);
    }

    console.log('[PROFILE QUERY] Searching BENEFICIAIRE with ASS_MAT:', userAssMat);

    // Query beneficiary details and validate the beneficiary type/rank
    const query = `
      SELECT BEN_NOM, BEN_PRENOM, BEN_ADR
      FROM BENEFICIAIRE
      WHERE ASS_MAT = :assMat
        AND BEN_TYPE = 1
        AND BEN_RANG = 0
    `;

    const result = await connection.execute(query, { assMat: userAssMat }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or beneficiary criteria do not match.',
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: {
        assMat: userAssMat,
        benNom: user.BEN_NOM,
        benPrenom: user.BEN_PRENOM,
        benAdr: user.BEN_ADR,
      },
    });
  } catch (error) {
    console.error('✗ Get current user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user profile.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // Release connection back to pool
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('✗ Error closing connection:', error.message);
      }
    }
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
