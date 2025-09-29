#!/usr/bin/env node
/**
 * Simple DB sync and seed script for development.
 * - Uses existing Sequelize models in src/backend/models
 * - Calls sequelize.sync({ alter: true }) to apply model changes non-destructively
 * - Inserts a small set of sample rows for testing
 *
 * Usage: node scripts/setupTestData.js
 * Ensure src/backend/.env is populated with DATABASE_URL and the DB is reachable.
 */

const path = require('path');

// Ensure backend config env is loaded
require('dotenv').config({ path: path.resolve(__dirname, '..', 'src', 'backend', '.env') });

const { sequelize } = require(path.resolve(__dirname, '..', 'src', 'backend', 'config', 'db'));
const models = require(path.resolve(__dirname, '..', 'src', 'backend', 'models', 'index'));

async function seed() {
  try {
    console.log('Authenticating DB...');
    await sequelize.authenticate();
    console.log('Syncing models (alter:true)...');
    await sequelize.sync({ alter: true });

    // Create a restaurant
    const restaurant = await models.Restaurant.create({
      name: 'Testaurant',
      email: 'owner@testaurant.local',
      password: 'password123',
      phone: '555-0100',
      address: '123 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '12345',
      cuisine: 'International',
      isActive: true,
      isVerified: true,
      minOrderAmount: 0.0,
      deliveryFee: 2.5
    });

    // Create menu items for the restaurant
    const menuItems = await models.MenuItem.bulkCreate([
      {
        name: 'Test Burger',
        description: 'A tasty test burger',
        price: 6.5,
        category: 'Main',
        restaurantId: restaurant.id
      },
      {
        name: 'Test Fries',
        description: 'Crispy fries',
        price: 2.5,
        category: 'Sides',
        restaurantId: restaurant.id
      }
    ]);

    // Create a customer
    const customer = await models.Customer.create({
      name: 'Jane Tester',
      email: 'jane@test.local',
      password: 'custpass1',
      phone: '555-0200',
      address: '456 Customer Ln',
      city: 'Testville',
      state: 'TS',
      postalCode: '12345',
      isActive: true
    });

    // Create a delivery agent
    const agent = await models.DeliveryAgent.create({
      name: 'Andy Agent',
      email: 'andy@agents.local',
      password: 'agentpass1',
      phone: '555-0300',
      vehicleType: 'bike',
      vehicleNumber: 'AG-001',
      isAvailable: true,
      isVerified: true
    });

    // Create an order for the customer with one item
    const order = await models.Order.create({
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      totalAmount: 9.0,
      subtotal: 8.5,
      tax: 0.5,
      deliveryFee: 2.5,
      deliveryAddress: customer.address,
      customerId: customer.id,
      restaurantId: restaurant.id,
      deliveryAgentId: agent.id
    });

    // Create order items (link to first menu item)
    await models.OrderItem.create({
      quantity: 1,
      price: menuItems[0].price,
      orderId: order.id,
      menuItemId: menuItems[0].id
    });

    // Create a payment record
    await models.Payment.create({
      amount: order.totalAmount,
      currency: 'USD',
      method: 'credit_card',
      status: 'completed',
      transactionId: `TX-${Date.now()}`,
      paymentDate: new Date(),
      orderId: order.id
    });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

