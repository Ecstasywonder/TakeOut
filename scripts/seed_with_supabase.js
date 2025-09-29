#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'src', 'backend', '.env') });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; // should be service_role for server-side operations

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in src/backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function upsert(table, rows, conflictKey) {
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict: conflictKey }).select();
  if (error) throw error;
  return data;
}

async function seed() {
  try {
    console.log('Seeding via Supabase API...');

    // Restaurants
    const restaurants = await upsert('restaurants', [
      {
        name: 'Testaurant',
        email: 'owner@testaurant.local',
        password: 'password-hash-sample',
        phone: '555-0100',
        address: '123 Test St',
        city: 'Testville',
        state: 'TS',
        postal_code: '12345',
        cuisine: 'International',
        is_active: true,
        is_verified: true,
        min_order_amount: 0.0,
        delivery_fee: 2.5
      }
    ], 'email');

    const restaurantId = restaurants && restaurants[0] && restaurants[0].id;
    if (!restaurantId) throw new Error('Failed to get restaurant id');

    // Menu items
    await upsert('menu_items', [
      { name: 'Test Burger', description: 'A tasty test burger', price: 6.5, category: 'Main', restaurant_id: restaurantId },
      { name: 'Test Fries', description: 'Crispy fries', price: 2.5, category: 'Sides', restaurant_id: restaurantId }
    ], 'name');

    // Customer
    const customers = await upsert('customers', [
      { name: 'Jane Tester', email: 'jane@test.local', password: 'custpass-sample', phone: '555-0200', address: '456 Customer Ln', city: 'Testville', state: 'TS', postal_code: '12345', is_active: true }
    ], 'email');
    const customerId = customers && customers[0] && customers[0].id;
    if (!customerId) throw new Error('Failed to get customer id');

    // Delivery agent
    const agents = await upsert('delivery_agents', [
      { name: 'Andy Agent', email: 'andy@agents.local', password: 'agentpass-sample', phone: '555-0300', vehicle_type: 'bike', vehicle_number: 'AG-001', is_available: true, is_verified: true }
    ], 'email');
    const agentId = agents && agents[0] && agents[0].id;

    // Get menu item id for burger
    const { data: menuItems } = await supabase.from('menu_items').select('*').eq('name', 'Test Burger').limit(1);
    if (!menuItems || menuItems.length === 0) throw new Error('No menu item found');
    const menuItemId = menuItems[0].id;

    // Create order
    const { data: orderRows, error: orderErr } = await supabase.from('orders').insert([
      {
        order_number: `ORD-${Date.now()}`,
        status: 'pending',
        total_amount: (parseFloat(menuItems[0].price) + 2.5).toFixed(2),
        subtotal: menuItems[0].price,
        tax: 0.5,
        delivery_fee: 2.5,
        delivery_address: '456 Customer Ln',
        customer_id: customerId,
        restaurant_id: restaurantId,
        delivery_agent_id: agentId
      }
    ]).select();
    if (orderErr) throw orderErr;
    const orderId = orderRows && orderRows[0] && orderRows[0].id;
    if (!orderId) throw new Error('Failed to create order');

    // Order item
    await supabase.from('order_items').upsert([
      { quantity: 1, price: menuItems[0].price, order_id: orderId, menu_item_id: menuItemId }
    ], { onConflict: ['order_id', 'menu_item_id'] });

    // Payment
    await supabase.from('payments').upsert([
      { amount: orderRows[0].total_amount, currency: 'USD', method: 'credit_card', status: 'completed', transaction_id: `TX-${Date.now()}`, payment_date: new Date().toISOString(), order_id: orderId }
    ], { onConflict: ['order_id'] });

    console.log('Supabase seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding via Supabase failed:', err.message || err);
    process.exit(1);
  }
}

seed();
