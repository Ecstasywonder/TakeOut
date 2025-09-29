const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');
// Initialize Socket.IO
const initializeSocket = server => {
  const io = socketIO(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });
  // Create rooms for different user roles
  io.on('connection', socket => {
    const {
      id,
      role
    } = socket.user;
    logger.info(`Socket connected: ${id} (${role})`);
    // Join role-specific room
    if (role === 'delivery') {
      socket.join('delivery_agents');
    }
    // Join user-specific room
    socket.join(`${role}_${id}`);
    // Listen for location updates from delivery agents
    if (role === 'delivery') {
      socket.on('location_update', data => {
        const {
          latitude,
          longitude,
          orderId
        } = data;
        if (latitude && longitude && orderId) {
          // Update order location
          notificationService.updateOrderLocation(orderId, latitude, longitude);
        }
      });
    }
    // Disconnect event
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${id} (${role})`);
    });
  });
  // Initialize notification service with io instance
  notificationService.init(io);
  return io;
};
module.exports = initializeSocket;