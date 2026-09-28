# CNSS Backend API - Production Ready Documentation

## 📋 Project Overview

Complete Node.js + Express backend for CNSS mobile app with JWT authentication, OracleDB integration, and clean architecture.

---

## 🏗️ Project Structure

```
cnss-backend/
├── server.js                    # Express server entry point
├── .env                         # Environment variables
├── package.json                 # Project dependencies
│
├── config/
│   └── db.js                    # Oracle Database connection pool
│
├── controllers/
│   └── auth.controller.js       # Authentication logic
│
├── routes/
│   └── auth.routes.js           # Auth endpoints definition
│
├── middleware/
│   └── auth.middleware.js       # JWT verification middleware
│
└── README.md                    # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Edit `.env` file with your Oracle Database credentials:
```
DB_USER=your_username
DB_PASSWORD=your_password
DB_CONNECT_STRING=localhost:1521/orcl
JWT_SECRET=your_super_secret_key_change_in_production
PORT=3000
NODE_ENV=development
```

### 3. Oracle Database Setup

**Create USERS table:**
```sql
CREATE TABLE USERS (
    USER_ID NUMBER PRIMARY KEY,
    FULL_NAME VARCHAR2(100) NOT NULL,
    CIN VARCHAR2(20) UNIQUE NOT NULL,
    EMAIL VARCHAR2(100),
    PASSWORD_HASH VARCHAR2(255) NOT NULL,
    IS_ACTIVE NUMBER DEFAULT 1,
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP DEFAULT SYSDATE
);

CREATE SEQUENCE USER_SEQ START WITH 1 INCREMENT BY 1;

-- Optional: Create index on CIN for faster lookups
CREATE INDEX idx_users_cin ON USERS(CIN);
```

**Insert test user (password: 'password123' hashed with bcrypt):**
```sql
INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (
    USER_SEQ.NEXTVAL,
    'Test User',
    '12345678',
    'test@cnss.com',
    -- Use bcrypt to hash password first
    '$2b$10$abcdefghijklmnopqrstuvwxyz...',
    1
);
COMMIT;
```

### 4. Start Server
```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## 📚 API Endpoints

### Health Check
**GET** `/api/health`
- No authentication required
- Response: Server status

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "CNSS Backend API is running",
  "timestamp": "2026-06-25T10:30:00.000Z"
}
```

---

### Login (Public)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "cin": "12345678",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "fullName": "Test User",
      "cin": "12345678",
      "email": "test@cnss.com"
    }
  }
}
```

**Error Responses:**
```json
// Invalid credentials (401)
{
  "success": false,
  "message": "Invalid CIN or password."
}

// Missing fields (400)
{
  "success": false,
  "message": "CIN and password are required."
}

// User not active (403)
{
  "success": false,
  "message": "User account is not active."
}
```

---

### Get Current User Profile (Protected)
**GET** `/api/auth/me`

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully.",
  "data": {
    "userId": 1,
    "fullName": "Test User",
    "cin": "12345678",
    "email": "test@cnss.com",
    "isActive": 1,
    "createdAt": "2026-01-15T08:30:00Z"
  }
}
```

**Error Responses:**
```json
// No token (401)
{
  "success": false,
  "message": "No token provided. Please include Authorization header with Bearer token."
}

// Expired token (401)
{
  "success": false,
  "message": "Token has expired. Please login again."
}

// Invalid token (401)
{
  "success": false,
  "message": "Invalid token. Please login again."
}

// User not found (404)
{
  "success": false,
  "message": "User not found."
}
```

---

## 🔐 JWT Token Details

**Token Payload:**
```json
{
  "userId": 1,
  "cin": "12345678",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Expiration:** 7 days (configurable in `.env`)

---

## 🛠️ Testing with cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cin": "12345678", "password": "password123"}'
```

### 2. Use Token to Access Protected Route
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔄 How It Works

1. **User Login**
   - Sends CIN + password to `/api/auth/login`
   - Server queries Oracle USERS table
   - Compares hashed password using bcrypt
   - Returns JWT token if valid

2. **Token Usage**
   - Client stores JWT token
   - Includes token in `Authorization: Bearer <token>` header
   - Middleware (`auth.middleware.js`) verifies token on protected routes

3. **Protected Routes**
   - `verifyToken` middleware extracts and validates JWT
   - User data attached to `req.user`
   - Controller accesses authenticated user info

---

## 📁 File Descriptions

### `server.js`
- Express app initialization
- CORS configuration
- Middleware setup
- Route registration
- Error handling
- Server startup

### `config/db.js`
- Oracle connection pool
- Connection management
- Reusable `getConnection()` function

### `controllers/auth.controller.js`
- `login()` - User authentication logic
- `getCurrentUser()` - Protected route example
- Password validation with bcrypt
- JWT token generation

### `routes/auth.routes.js`
- Route definitions
- Middleware attachment
- Route grouping

### `middleware/auth.middleware.js`
- `verifyToken()` - JWT verification
- Token extraction from Authorization header
- Error handling for expired/invalid tokens

### `.env`
- Environment variables
- Database credentials
- JWT secret key
- Server configuration

---

## ✅ Production Checklist

- [ ] Update `.env` with real database credentials
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS `origin` to your frontend domain
- [ ] Enable HTTPS (use `https://` module or reverse proxy)
- [ ] Add request logging (morgan middleware)
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add input validation (joi or yup)
- [ ] Add database transaction support
- [ ] Implement refresh tokens
- [ ] Add user registration endpoint
- [ ] Add password reset functionality
- [ ] Set up monitoring/logging (Winston, Bunyan)
- [ ] Add API documentation (Swagger/OpenAPI)

---

## 🚀 Future Extensions

### User Registration
```javascript
POST /api/auth/register
Body: { fullName, cin, email, password }
```

### Password Reset
```javascript
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### CNSS Services (Future)
```javascript
GET /api/cotisation/my-contributions
GET /api/retirement/eligibility
POST /api/claims/submit-claim
```

### User Management
```javascript
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

---

## 🐛 Troubleshooting

**Issue:** Oracle connection fails
- Check DB credentials in `.env`
- Verify Oracle service is running
- Test connection string format

**Issue:** JWT validation fails
- Ensure token is correctly formatted
- Check if token has expired
- Verify JWT_SECRET matches between generation and verification

**Issue:** Password comparison fails
- Ensure password is hashed with bcrypt
- Verify hash format is correct
- Check bcrypt version compatibility

---

## 📝 Security Notes

1. **Password Storage:** Never store plain passwords. Always use bcrypt.
2. **JWT Secret:** Use a strong, random secret (min 32 characters)
3. **HTTPS:** Always use HTTPS in production
4. **CORS:** Restrict origin to your frontend domain
5. **Rate Limiting:** Implement rate limiting on login endpoint
6. **Input Validation:** Validate all user inputs
7. **Error Messages:** Don't expose database errors to clients
8. **Token Expiration:** Implement refresh token strategy for long sessions

---

## 📞 Support

For issues or questions, refer to:
- [Express Documentation](https://expressjs.com)
- [OracleDB Node Module](https://github.com/oracle/node-oracledb)
- [JWT Documentation](https://jwt.io)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

## 📄 License

ISC

---

**Version:** 1.0.0  
**Last Updated:** June 2026  
**Status:** Production Ready ✓
