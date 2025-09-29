#!/usr/bin/env node
const path = require('path');

// Load backend .env (server-only variables)
require('dotenv').config({ path: path.resolve(__dirname, '..', 'src', 'backend', '.env') });

const { sequelize } = require(path.resolve(__dirname, '..', 'src', 'backend', 'config', 'db'));

(async () => {
  console.log('Testing DB connection using src/backend/.env -> DATABASE_URL');
  try {
    await sequelize.authenticate();
    console.log('OK: DB connection test completed.');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR: DB connection test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
