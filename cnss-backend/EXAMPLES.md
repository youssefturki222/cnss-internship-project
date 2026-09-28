# CNSS Backend - Example Usage Guide

This guide shows how to use the CNSS Backend API with real-world examples.

## 📌 Prerequisites

- Backend running on `http://localhost:3000`
- Oracle database configured with USERS table
- Test user created in database

---

## 🧪 Example 1: User Login

### Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "cin": "12345678",
    "password": "password123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNpbiI6IjEyMzQ1Njc4IiwiaWF0IjoxNjI0NzU2MTExLCJleHAiOjE2MjUzNjA5MTF9.X9Z9X...",
    "user": {
      "userId": 1,
      "fullName": "Test User",
      "cin": "12345678",
      "email": "test@cnss.com"
    }
  }
}
```

### Store Token
Save the token for subsequent requests:
```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

---

## 🔐 Example 2: Access Protected Route

### Request with Token
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response
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

---

## 📱 Example 3: Frontend Integration (JavaScript/React Native)

### Using Fetch API
```javascript
// 1. Login
async function login(cin, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // Store token in device storage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Get user profile with stored token
async function getUserProfile() {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('User profile:', data.data);
    } else {
      console.error('Error:', data.message);
      // Redirect to login
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 3. Logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Redirect to login screen
}
```

### Usage in React Native
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000'
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (cin, password) => {
  const { data } = await apiClient.post('/api/auth/login', { cin, password });
  await AsyncStorage.setItem('authToken', data.data.token);
  return data;
};

// Get profile
export const getUserProfile = async () => {
  const { data } = await apiClient.get('/api/auth/me');
  return data;
};
```

---

## 🧬 Example 4: Error Handling

### Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cin": "99999999", "password": "wrongpassword"}'
```

Response (401):
```json
{
  "success": false,
  "message": "Invalid CIN or password."
}
```

### Missing Token
```bash
curl http://localhost:3000/api/auth/me
```

Response (401):
```json
{
  "success": false,
  "message": "No token provided. Please include Authorization header with Bearer token."
}
```

### Expired Token
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQwMDAwMDB9..."
```

Response (401):
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

---

## 📊 Example 5: Complete Login Flow

```javascript
class AuthService {
  constructor(apiUrl = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
    this.token = null;
    this.user = null;
  }

  async login(cin, password) {
    const response = await fetch(`${this.apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, password })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    this.token = result.data.token;
    this.user = result.data.user;

    // Store in session
    sessionStorage.setItem('token', this.token);
    sessionStorage.setItem('user', JSON.stringify(this.user));

    return result.data;
  }

  async getProfile() {
    if (!this.token) {
      this.token = sessionStorage.getItem('token');
    }

    if (!this.token) {
      throw new Error('No token found. Please login first.');
    }

    const response = await fetch(`${this.apiUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  logout() {
    this.token = null;
    this.user = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Usage
const auth = new AuthService();

// Step 1: Login
auth.login('12345678', 'password123')
  .then((data) => {
    console.log('Login successful:', data.user.fullName);
  })
  .catch((error) => {
    console.error('Login failed:', error.message);
  });

// Step 2: Get profile
auth.getProfile()
  .then((profile) => {
    console.log('Profile:', profile);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

// Step 3: Logout
auth.logout();
```

---

## 🔧 Testing Different Scenarios

### Scenario 1: New User First Login
```javascript
async function firstLogin() {
  try {
    const result = await login('12345678', 'password123');
    console.log('Welcome,', result.user.fullName);
    // Store token for next app launch
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Scenario 2: Token Expires During Session
```javascript
async function makeRequestWithRefresh() {
  try {
    const data = await getUserProfile();
    return data;
  } catch (error) {
    if (error.message.includes('expired')) {
      // Redirect to login
      logout();
      return null;
    }
  }
}
```

### Scenario 3: Multi-device Login
```javascript
// Device 1 and Device 2 can have different tokens
// Each device stores its own token
// Tokens are independent and work simultaneously
```

---

## 📈 Performance Tips

1. **Cache Token**: Store JWT token in secure storage
2. **Minimize Requests**: Use token data when possible
3. **Request Timeout**: Set timeout for network requests
4. **Retry Logic**: Implement exponential backoff for retries
5. **Connection Pooling**: Already handled in `config/db.js`

---

## 🔐 Security Best Practices

1. **Use HTTPS**: Always use encrypted connections
2. **Secure Token Storage**: Use device secure storage (not plain text)
3. **Validate Input**: Check CIN format before sending
4. **Handle Errors**: Don't expose sensitive info in error messages
5. **Token Rotation**: Implement refresh tokens for long sessions
6. **Logout**: Always clear token on logout

---

For more details, see `README.md` in the project root.
