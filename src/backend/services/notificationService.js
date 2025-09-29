const {
  NOTIFICATION_TYPES
} = require('../utils/constants');
const logger = require('../utils/logger');
// Store connected clients
const clients = {
  customers: {},
  restaurants: {},
  deliveryAgents: {},
  admin: {}
};
// Initialize Socket.IO
exports.init = io => {
  io.on('connection', socket => {
    logger.info('New client connected');
    // Authentication
    socket.on('authenticate', data => {
      if (data && data.userId && data.role) {
        // Store socket by user ID and role
        if (data.role === 'customer') {
          clients.customers[data.userId] = socket.id;
        } else if (data.role === 'restaurant') {
          clients.restaurants[data.userId] = socket.id;
        } else if (data.role === 'delivery') {
          clients.deliveryAgents[data.userId] = socket.id;
        } else if (data.role === 'admin') {
          clients.admin[data.userId] = socket.id;
        }
        logger.info(`User authenticated: ${data.userId} (${data.role})`);
        socket.userId = data.userId;
        socket.userRole = data.role;
      }
    });
    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId && socket.userRole) {
        // Remove socket from clients
        if (socket.userRole === 'customer') {
          delete clients.customers[socket.userId];
        } else if (socket.userRole === 'restaurant') {
          delete clients.restaurants[socket.userId];
        } else if (socket.userRole === 'delivery') {
          delete clients.deliveryAgents[socket.userId];
        } else if (socket.userRole === 'admin') {
          delete clients.admin[socket.userId];
        }
        logger.info(`User disconnected: ${socket.userId} (${socket.userRole})`);
      }
    });
  });
  // Store io instance for later use
  this.io = io;
};
// Send notification to specific user
exports.sendToUser = (userId, role, type, data) => {
  try {
    let socketId;
    if (role === 'customer') {
      socketId = clients.customers[userId];
    } else if (role === 'restaurant') {
      socketId = clients.restaurants[userId];
    } else if (role === 'delivery') {
      socketId = clients.deliveryAgents[userId];
    } else if (role === 'admin') {
      socketId = clients.admin[userId];
    }
    if (socketId && this.io) {
      this.io.to(socketId).emit('notification', {
        type,
        data
      });
      logger.info(`Notification sent to ${role} ${userId}: ${type}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error sending notification:', error);
    return false;
  }
};
// Send order status update notification
exports.sendOrderStatusUpdate = order => {
  try {
    // Notify customer
    this.sendToUser(order.customerId, 'customer', NOTIFICATION_TYPES.ORDER_STATUS, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status
    });
    // Notify restaurant
    this.sendToUser(order.restaurantId, 'restaurant', NOTIFICATION_TYPES.ORDER_STATUS, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status
    });
    // Notify delivery agent if assigned
    if (order.deliveryAgentId) {
      this.sendToUser(order.deliveryAgentId, 'delivery', NOTIFICATION_TYPES.ORDER_STATUS, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      });
    }
    return true;
  } catch (error) {
    logger.error('Error sending order status update notification:', error);
    return false;
  }
};
// Notify restaurant about new order
exports.notifyNewOrder = order => {
  return this.sendToUser(order.restaurantId, 'restaurant', NOTIFICATION_TYPES.NEW_ORDER, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.Customer ? order.Customer.name : 'Customer',
    totalAmount: order.totalAmount
  });
};
// Notify delivery agents about order ready for pickup
exports.notifyDeliveryAgents = order => {
  try {
    if (this.io) {
      // Broadcast to all connected delivery agents
      this.io.to('delivery_agents').emit('notification', {
        type: NOTIFICATION_TYPES.NEW_ORDER,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          restaurantName: order.Restaurant ? order.Restaurant.name : 'Restaurant',
          restaurantAddress: order.Restaurant ? order.Restaurant.address : '',
          estimatedEarnings: order.deliveryFee
        }
      });
      logger.info(`Broadcast notification to delivery agents: ${order.id}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error broadcasting to delivery agents:', error);
    return false;
  }
};
// Notify delivery agent about order assignment
exports.notifyDeliveryAgentAssignment = (order, agent) => {
  return this.sendToUser(agent.id, 'delivery', NOTIFICATION_TYPES.ORDER_ASSIGNED, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    restaurantName: order.Restaurant ? order.Restaurant.name : 'Restaurant',
    restaurantAddress: order.Restaurant ? order.Restaurant.address : '',
    customerAddress: order.deliveryAddress,
    estimatedEarnings: order.deliveryFee
  });
};
// Notify about order acceptance
exports.notifyOrderAccepted = order => {
  // Notify customer
  this.sendToUser(order.customerId, 'customer', NOTIFICATION_TYPES.ORDER_STATUS, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'accepted_by_delivery',
    deliveryAgentName: order.DeliveryAgent ? order.DeliveryAgent.name : 'Delivery Agent'
  });
  // Notify restaurant
  return this.sendToUser(order.restaurantId, 'restaurant', NOTIFICATION_TYPES.ORDER_STATUS, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'accepted_by_delivery',
    deliveryAgentName: order.DeliveryAgent ? order.DeliveryAgent.name : 'Delivery Agent'
  });
};
// Update order location
exports.updateOrderLocation = (orderId, latitude, longitude) => {
  try {
    if (this.io) {
      this.io.emit(`order_location_${orderId}`, {
        latitude,
        longitude,
        timestamp: new Date()
      });
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error updating order location:', error);
    return false;
  }
};
// Send order cancellation notification
exports.sendOrderCancellation = order => {
  // Notify customer
  this.sendToUser(order.customerId, 'customer', NOTIFICATION_TYPES.ORDER_STATUS, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'cancelled',
    reason: order.cancelReason || 'Order cancelled'
  });
  // Notify restaurant
  this.sendToUser(order.restaurantId, 'restaurant', NOTIFICATION_TYPES.ORDER_STATUS, {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'cancelled',
    reason: order.cancelReason || 'Order cancelled'
  });
  // Notify delivery agent if assigned
  if (order.deliveryAgentId) {
    this.sendToUser(order.deliveryAgentId, 'delivery', NOTIFICATION_TYPES.ORDER_STATUS, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: 'cancelled',
      reason: order.cancelReason || 'Order cancelled'
    });
  }
};