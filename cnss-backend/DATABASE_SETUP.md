# CNSS Backend - Database Setup Script

This guide helps you set up the Oracle database for the CNSS backend.

## 📊 Database Schema

### USERS Table

```sql
-- Create USERS table
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

-- Create sequence for USER_ID
CREATE SEQUENCE USER_SEQ START WITH 1 INCREMENT BY 1;

-- Create index on CIN for faster lookups
CREATE INDEX idx_users_cin ON USERS(CIN);
CREATE INDEX idx_users_email ON USERS(EMAIL);
```

---

## 🔐 Generating Password Hash

### Option 1: Using the Helper Script

```bash
# Install Node packages first
npm install

# Generate hash for password "password123"
node -e "require('./utils/helpers').hashPassword('password123').then(h => console.log(h))"
```

### Option 2: Using Online Tool (for testing only)
Use [bcrypt.online](https://bcrypt.online) (NOT for production)

### Option 3: Custom Script
```javascript
const bcrypt = require('bcrypt');

async function generateHash() {
  const hash = await bcrypt.hash('password123', 10);
  console.log(hash);
}

generateHash();
```

---

## 👤 Insert Test User

### Step 1: Generate Hash
```bash
node -e "require('./utils/helpers').hashPassword('password123').then(h => console.log(h))"
```

Output example:
```
$2b$10$abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz...
```

### Step 2: Insert User Record
Connect to Oracle and run:

```sql
INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (
    USER_SEQ.NEXTVAL,
    'Test User',
    '12345678',
    'test@cnss.com',
    '$2b$10$abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz...',
    1
);

COMMIT;
```

### Step 3: Verify User
```sql
SELECT * FROM USERS WHERE CIN = '12345678';
```

---

## 📋 Complete Setup Checklist

- [ ] Create USERS table
- [ ] Create USER_SEQ sequence
- [ ] Create indexes on CIN and EMAIL
- [ ] Generate password hash for test user
- [ ] Insert test user record
- [ ] Verify test user exists
- [ ] Test login with CIN: `12345678` and password: `password123`

---

## 🗄️ Adding More Users

### SQL Template
```sql
INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (
    USER_SEQ.NEXTVAL,
    'User Full Name',
    'USER_CIN',
    'user@cnss.com',
    'HASHED_PASSWORD',
    1
);
```

### Bulk Insert Example
```sql
INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (USER_SEQ.NEXTVAL, 'Ahmed Ben Ali', '12345678', 'ahmed@cnss.com', '$2b$10$...', 1);

INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (USER_SEQ.NEXTVAL, 'Fatima Khadija', '87654321', 'fatima@cnss.com', '$2b$10$...', 1);

INSERT INTO USERS (USER_ID, FULL_NAME, CIN, EMAIL, PASSWORD_HASH, IS_ACTIVE)
VALUES (USER_SEQ.NEXTVAL, 'Mohamed Salim', '11223344', 'mohamed@cnss.com', '$2b$10$...', 1);

COMMIT;
```

---

## 🧪 Testing Connection

### Test from Node.js
```javascript
const { getConnection } = require('./config/db');

async function testConnection() {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM USERS');
    console.log('Users:', result.rows);
    await connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConnection();
```

---

## 🔄 Updating User Status

### Deactivate User
```sql
UPDATE USERS SET IS_ACTIVE = 0 WHERE CIN = '12345678';
COMMIT;
```

### Reactivate User
```sql
UPDATE USERS SET IS_ACTIVE = 1 WHERE CIN = '12345678';
COMMIT;
```

### Reset Password
```sql
UPDATE USERS 
SET PASSWORD_HASH = 'NEW_HASHED_PASSWORD',
    UPDATED_AT = SYSDATE
WHERE CIN = '12345678';
COMMIT;
```

---

## 📌 Important Notes

- **Password Hash**: Never store plain text passwords
- **CIN Format**: Adjust VARCHAR2 size based on your CIN format
- **Uniqueness**: CIN must be unique per user
- **Indexing**: Indexes on CIN and EMAIL improve query performance
- **Timestamps**: CREATED_AT and UPDATED_AT track record lifecycle
- **Active Flag**: IS_ACTIVE = 1 for enabled users, 0 for disabled

---

## 🆘 Troubleshooting

### Error: "Table already exists"
```sql
DROP TABLE USERS;
DROP SEQUENCE USER_SEQ;
-- Then recreate
```

### Error: "Unique constraint violated"
CIN already exists. Use different CIN for new user.

### Error: "ORA-00001"
Duplicate key value. Check if USER_ID or CIN already exists.

---

For more help, see `README.md` in the project root.
