#!/usr/bin/env node
/*
  Quick test for Paystack initializeTransaction using server secret.
  Usage: set PAYSTACK_SECRET in src/backend/.env then run:
    node scripts/test_paystack.js
*/
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'src', 'backend', '.env') });

const fetch = global.fetch || require('node-fetch');
const PAYSTACK_BASE = 'https://api.paystack.co';
const SECRET = process.env.PAYSTACK_SECRET;

if (!SECRET) {
  console.error('Missing PAYSTACK_SECRET in src/backend/.env');
  process.exit(1);
}

async function testInit() {
  try {
    const amountKobo = 5000; // e.g. NGN 50.00
    const email = 'test@example.com';
    const metadata = { test: true };
    console.log('Calling Paystack initialize with', { amountKobo, email });
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, amount: amountKobo, metadata })
    });
    const body = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(body, null, 2));
    if (!res.ok) process.exit(2);
    process.exit(0);
  } catch (err) {
    console.error('Paystack test failed:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

testInit();
