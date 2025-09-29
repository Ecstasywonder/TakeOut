require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  JWT_SECRET: process.env.JWT_SECRET || 'f96b786e-0cd6-4a95-941a-6463bd6acad2',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // If you migrate to Supabase, set SUPABASE_URL and SUPABASE_KEY in src/backend/.env
  DATABASE_URL: process.env.DATABASE_URL || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',

  // Paystack settings
  PAYSTACK_SECRET: process.env.PAYSTACK_SECRET || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};