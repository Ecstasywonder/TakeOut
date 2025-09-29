const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const {
  ApiError
} = require('./utils/errors');
// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const deliveryAgentRoutes = require('./routes/deliveryAgentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Initialize Express app
const app = express();
// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({
  limit: '10mb'
})); // Parse JSON bodies
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
})); // Parse URL-encoded bodies
// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/delivery', deliveryAgentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: env.NODE_ENV,
    timestamp: new Date()
  });
});
// Handle 404 errors
app.use('*', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use(errorHandler);
module.exports = app;