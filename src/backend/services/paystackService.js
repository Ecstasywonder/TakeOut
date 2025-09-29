const fetch = require('node-fetch');
const env = require('../config/env');

const PAYSTACK_BASE = 'https://api.paystack.co';
const SECRET = env.PAYSTACK_SECRET;

if (!SECRET) {
  console.warn('PAYSTACK_SECRET not set in environment');
}

async function initializeTransaction(amountKobo, email, metadata = {}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      metadata
    })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Paystack initialize failed');
  return body.data; // includes authorization_url, reference
}

async function verifyTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${SECRET}`
    }
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Paystack verify failed');
  return body.data;
}

module.exports = {
  initializeTransaction,
  verifyTransaction
};
