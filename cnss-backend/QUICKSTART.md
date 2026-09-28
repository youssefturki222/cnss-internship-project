# 🚀 CNSS Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Verify Installation
```bash
npm install
```
✓ All dependencies already installed

### 2. Configure Database
Update `.env` with your Oracle credentials:
```
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_CONNECT_STRING=localhost:1521/orcl
JWT_SECRET=change_this_to_secure_key
```

### 3. Create Database Table
Execute in Oracle SQL:
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
```

### 4. Add Test User
```bash
# Generate password hash
node -e "require('./utils/helpers').hashPassword('password123').then(h => console.log(h))"
```

Copy the hash and run in Oracle:
```sql
INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (USER_SEQ.NEXTVAL, 'Test User', '12345678', 'test@cnss.com', '[PASTE_HASH_HERE]', 1);
COMMIT;
```

### 5. Start Server
```bash
npm start
```

✅ Server running on `http://localhost:3000`

---

## 🧪 Quick Tests

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```

### Test 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cin":"12345678","password":"password123"}'
```

**Save the returned token!**

### Test 3: Protected Route
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 File Map

| File | Purpose |
|------|---------|
| `server.js` | Main Express server |
| `config/db.js` | Oracle connection pool |
| `controllers/auth.controller.js` | Auth logic |
| `routes/auth.routes.js` | API endpoints |
| `middleware/auth.middleware.js` | Token verification |
| `.env` | Configuration |

---

## 🔧 Troubleshooting

**Connection refused?**
- Check DB credentials in `.env`
- Verify Oracle service is running

**Login returns "Invalid CIN or password"?**
- Verify test user exists: `SELECT * FROM USERS WHERE CIN = '12345678';`
- Check password hash is correct

**Token invalid?**
- Token might be expired (check JWT_EXPIRE in .env)
- Ensure full "Bearer " prefix in Authorization header

---

## 📚 Full Documentation
See `README.md` and `EXAMPLES.md` for complete documentation.

---

## ✨ You're All Set!

The backend is production-ready. Start building your CNSS mobile app! 🎉
