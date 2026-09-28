const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');

const db = require('../config/db');
const email = require('../utils/email');

test('register returns invalid enterprise response when ASSURE has no match', async () => {
  db.getConnection = async () => ({
    execute: async (query) => {
      if (query.includes('FROM ASSURE')) {
        return { rows: [{ CNT: 0 }] };
      }
      throw new Error('Unexpected query in test');
    },
    close: async () => {},
  });

  delete require.cache[require.resolve('../controllers/auth.controller')];
  const authController = require('../controllers/auth.controller');

  const req = {
    body: {
      ASS_MAT: '001',
      ASS_IU: '002',
      email: 'dev@example.com',
      password: 'secret123',
    },
  };

  let statusCode;
  let payload;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    },
  };

  await authController.register(req, res);

  assert.equal(statusCode, 404);
  assert.deepEqual(payload, {
    success: false,
    message: 'Invalid ASS_MAT or ASS_IU',
  });
});

test('register sends a confirmation email after a successful commit', async () => {
  const sentEmails = [];
  email.sendAccountCreatedEmail = async (toEmail) => {
    sentEmails.push(toEmail);
  };

  db.getConnection = async () => ({
    execute: async (query) => {
      if (query.includes('FROM ASSURE')) {
        return { rows: [{ CNT: 1 }] };
      }

      if (query.includes('FROM USER_TABLES')) {
        return { rows: [{ CNT: 1 }] };
      }

      if (query.includes('FROM USER_TAB_COLUMNS')) {
        return {
          rows: [
            { COLUMN_NAME: 'ASS_MAT' },
            { COLUMN_NAME: 'ASS_IU' },
            { COLUMN_NAME: 'EMAIL' },
            { COLUMN_NAME: 'PASSWORD_HASH' },
          ],
        };
      }

      if (query.includes('FROM MOBILE_USERS')) {
        return { rows: [{ CNT: 0 }] };
      }

      return {};
    },
    commit: async () => {},
    close: async () => {},
  });

  delete require.cache[require.resolve('../controllers/auth.controller')];
  const authController = require('../controllers/auth.controller');

  const req = {
    body: {
      ASS_MAT: '001',
      ASS_IU: '002',
      email: 'welcome@example.com',
      password: 'secret123',
    },
  };

  let statusCode;
  let payload;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    },
  };

  await authController.register(req, res);

  assert.equal(statusCode, 201);
  assert.equal(payload.success, true);
  assert.deepEqual(sentEmails, ['welcome@example.com']);
});

test('login authenticates with email and password against the mobile account table', async () => {
  process.env.JWT_SECRET = 'test-secret';
  const passwordHash = await bcrypt.hash('secret123', 10);

  db.getConnection = async () => ({
    execute: async (query) => {
      if (query.includes('FROM USER_TABLES')) {
        return { rows: [{ CNT: 1 }] };
      }

      if (query.includes('FROM USER_TAB_COLUMNS')) {
        return {
          rows: [
            { COLUMN_NAME: 'ASS_MAT' },
            { COLUMN_NAME: 'ASS_IU' },
            { COLUMN_NAME: 'EMAIL' },
            { COLUMN_NAME: 'PASSWORD_HASH' },
          ],
        };
      }

      if (query.includes('FROM MOBILE_USERS')) {
        return {
          rows: [{
            EMAIL: 'dev@example.com',
            PASSWORD_HASH: passwordHash,
          }],
        };
      }

      throw new Error('Unexpected query in test');
    },
    close: async () => {},
  });

  delete require.cache[require.resolve('../controllers/auth.controller')];
  const authController = require('../controllers/auth.controller');

  const req = {
    body: {
      email: 'dev@example.com',
      password: 'secret123',
    },
  };

  let statusCode;
  let payload;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    },
  };

  await authController.login(req, res);

  assert.equal(statusCode, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.message, 'Login successful.');
  assert.ok(payload.data.token);
  assert.equal(payload.data.user.email, 'dev@example.com');
});
