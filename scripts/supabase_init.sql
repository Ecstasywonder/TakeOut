-- Supabase initialization SQL
-- Run this in Supabase SQL editor (Project -> SQL Editor -> New query) or with psql using your DATABASE_URL.
-- It will create tables and insert a small set of sample rows for development/testing.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Delivery agents
CREATE TABLE IF NOT EXISTS delivery_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  current_location JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  cuisine TEXT,
  description TEXT,
  opening_time TIME,
  closing_time TIME,
  is_open BOOLEAN DEFAULT FALSE,
  min_order_amount NUMERIC(10,2),
  delivery_fee NUMERIC(10,2),
  estimated_delivery_time INTEGER,
  rating NUMERIC DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  image TEXT,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  spicy_level INTEGER DEFAULT 0,
  preparation_time INTEGER,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_address TEXT,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  customer_rating INTEGER,
  customer_feedback TEXT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  delivery_agent_id UUID REFERENCES delivery_agents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  method TEXT,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_intent_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  refund_amount NUMERIC(10,2),
  refund_date TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sample data
INSERT INTO restaurants (name, email, password, phone, address, city, state, postal_code, cuisine, is_active, is_verified, min_order_amount, delivery_fee)
VALUES ('Testaurant','owner@testaurant.local','password-hash-sample','555-0100','123 Test St','Testville','TS','12345','International',TRUE,TRUE,0.00,2.50)
ON CONFLICT DO NOTHING;

-- Insert menu items for the restaurant
INSERT INTO menu_items (name, description, price, category, restaurant_id)
SELECT 'Test Burger','A tasty test burger',6.50,'Main', r.id FROM restaurants r WHERE r.email='owner@testaurant.local'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (name, description, price, category, restaurant_id)
SELECT 'Test Fries','Crispy fries',2.50,'Sides', r.id FROM restaurants r WHERE r.email='owner@testaurant.local'
ON CONFLICT DO NOTHING;

-- Insert a customer
INSERT INTO customers (name, email, password, phone, address, city, state, postal_code, is_active)
VALUES ('Jane Tester','jane@test.local','custpass-sample','555-0200','456 Customer Ln','Testville','TS','12345',TRUE)
ON CONFLICT DO NOTHING;

-- Insert a delivery agent
INSERT INTO delivery_agents (name, email, password, phone, vehicle_type, vehicle_number, is_available, is_verified)
VALUES ('Andy Agent','andy@agents.local','agentpass-sample','555-0300','bike','AG-001',TRUE,TRUE)
ON CONFLICT DO NOTHING;

-- Create an order and items using the inserted rows
WITH c AS (
  SELECT id as customer_id FROM customers WHERE email='jane@test.local' LIMIT 1
), r AS (
  SELECT id as restaurant_id FROM restaurants WHERE email='owner@testaurant.local' LIMIT 1
), mi AS (
  SELECT id as menu_item_id, price FROM menu_items WHERE name='Test Burger' LIMIT 1
), a AS (
  SELECT id as agent_id FROM delivery_agents WHERE email='andy@agents.local' LIMIT 1
)
INSERT INTO orders (order_number, status, total_amount, subtotal, tax, delivery_fee, delivery_address, customer_id, restaurant_id, delivery_agent_id)
SELECT 'ORD-' || extract(epoch FROM now())::bigint, 'pending', (mi.price + 2.50)::numeric(10,2), mi.price, 0.50, 2.50, '456 Customer Ln', c.customer_id, r.restaurant_id, a.agent_id
FROM c, r, mi, a
ON CONFLICT DO NOTHING
RETURNING id INTO TEMP order_created;

-- If RETURNING isn't supported in this flow, insert order_items and payments separately
-- Insert order_items
INSERT INTO order_items (quantity, price, order_id, menu_item_id)
SELECT 1, mi.price, o.id, mi.menu_item_id
FROM menu_items mi
JOIN orders o ON o.customer_id = (SELECT id FROM customers WHERE email='jane@test.local')
WHERE mi.name='Test Burger'
ON CONFLICT DO NOTHING;

-- Insert payment
INSERT INTO payments (amount, currency, method, status, transaction_id, payment_date, order_id)
SELECT o.total_amount, 'USD', 'credit_card', 'completed', 'TX-' || extract(epoch FROM now())::bigint, now(), o.id
FROM orders o
WHERE o.customer_id = (SELECT id FROM customers WHERE email='jane@test.local')
ON CONFLICT DO NOTHING;

-- Done
SELECT 'Supabase init complete' as message;
