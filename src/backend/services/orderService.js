const {
  Order,
  Restaurant,
  Customer,
  DeliveryAgent,
  Payment
} = require('../models');
const {
  ORDER_STATUS
} = require('../utils/constants');
const {
  ApiError
} = require('../utils/errors');
const {
  sequelize
} = require('../config/db');
// Check if status transition is valid
exports.isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY],
    [ORDER_STATUS.READY]: [ORDER_STATUS.PICKED_UP],
    [ORDER_STATUS.PICKED_UP]: [ORDER_STATUS.IN_TRANSIT],
    [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: []
  };
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
// Calculate estimated delivery time
exports.calculateEstimatedDeliveryTime = async (restaurantId, deliveryAddress) => {
  const restaurant = await Restaurant.findByPk(restaurantId);
  if (!restaurant) {
    throw new ApiError('Restaurant not found', 404);
  }
  // In a real app, you'd use a mapping service to calculate this
  // For now, just use the restaurant's estimated delivery time
  const estimatedTime = restaurant.estimatedDeliveryTime || 30; // minutes
  const deliveryTime = new Date();
  deliveryTime.setMinutes(deliveryTime.getMinutes() + estimatedTime);
  return deliveryTime;
};
// Get order statistics
exports.getOrderStatistics = async (startDate, endDate) => {
  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };
  }
  // Total orders
  const totalOrders = await Order.count({
    where: dateFilter
  });
  // Orders by status
  const ordersByStatus = await Order.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
    where: dateFilter,
    group: ['status'],
    raw: true
  });
  // Revenue statistics
  const revenue = await Order.sum('totalAmount', {
    where: {
      ...dateFilter,
      status: {
        [Op.not]: ORDER_STATUS.CANCELLED
      }
    }
  });
  // Average order value
  const avgOrderValue = await Order.findOne({
    attributes: [[sequelize.fn('AVG', sequelize.col('totalAmount')), 'average']],
    where: {
      ...dateFilter,
      status: {
        [Op.not]: ORDER_STATUS.CANCELLED
      }
    },
    raw: true
  });
  // Orders by restaurant
  const ordersByRestaurant = await Order.findAll({
    attributes: ['restaurantId', [sequelize.fn('COUNT', sequelize.col('restaurantId')), 'orderCount'], [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']],
    where: dateFilter,
    group: ['restaurantId'],
    include: [{
      model: Restaurant,
      attributes: ['name']
    }],
    raw: true,
    nest: true
  });
  // Orders by payment method
  const ordersByPaymentMethod = await Payment.findAll({
    attributes: ['method', [sequelize.fn('COUNT', sequelize.col('method')), 'count'], [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
    where: {
      ...dateFilter,
      status: 'completed'
    },
    group: ['method'],
    raw: true
  });
  return {
    totalOrders,
    ordersByStatus,
    revenue: revenue || 0,
    avgOrderValue: avgOrderValue?.average || 0,
    ordersByRestaurant,
    ordersByPaymentMethod
  };
};
// Get order timeline events
exports.getOrderTimeline = async orderId => {
  const order = await Order.findByPk(orderId, {
    include: [{
      model: Restaurant,
      attributes: ['name']
    }, {
      model: Customer,
      attributes: ['name']
    }, {
      model: DeliveryAgent,
      attributes: ['name']
    }]
  });
  if (!order) {
    throw new ApiError('Order not found', 404);
  }
  // Get status history from order audit logs (would require a separate table in a real app)
  // For now, we'll simulate this with the available data
  const timeline = [{
    status: ORDER_STATUS.PENDING,
    timestamp: order.createdAt,
    actor: order.Customer.name,
    description: 'Order placed'
  }];
  // Add other events based on order data
  if (order.status !== ORDER_STATUS.PENDING) {
    timeline.push({
      status: ORDER_STATUS.CONFIRMED,
      timestamp: new Date(order.createdAt.getTime() + 5 * 60000),
      // 5 minutes after creation
      actor: order.Restaurant.name,
      description: 'Order confirmed by restaurant'
    });
  }
  if ([ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED].includes(order.status)) {
    timeline.push({
      status: ORDER_STATUS.PREPARING,
      timestamp: new Date(order.createdAt.getTime() + 10 * 60000),
      // 10 minutes after creation
      actor: order.Restaurant.name,
      description: 'Restaurant started preparing your order'
    });
  }
  if ([ORDER_STATUS.READY, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED].includes(order.status)) {
    timeline.push({
      status: ORDER_STATUS.READY,
      timestamp: new Date(order.createdAt.getTime() + 25 * 60000),
      // 25 minutes after creation
      actor: order.Restaurant.name,
      description: 'Order is ready for pickup'
    });
  }
  if ([ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED].includes(order.status) && order.DeliveryAgent) {
    timeline.push({
      status: ORDER_STATUS.PICKED_UP,
      timestamp: new Date(order.createdAt.getTime() + 35 * 60000),
      // 35 minutes after creation
      actor: order.DeliveryAgent.name,
      description: 'Order picked up by delivery agent'
    });
  }
  if ([ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED].includes(order.status) && order.DeliveryAgent) {
    timeline.push({
      status: ORDER_STATUS.IN_TRANSIT,
      timestamp: new Date(order.createdAt.getTime() + 40 * 60000),
      // 40 minutes after creation
      actor: order.DeliveryAgent.name,
      description: 'Order is on the way to your location'
    });
  }
  if (order.status === ORDER_STATUS.DELIVERED && order.DeliveryAgent) {
    timeline.push({
      status: ORDER_STATUS.DELIVERED,
      timestamp: order.actualDeliveryTime || new Date(order.createdAt.getTime() + 55 * 60000),
      // 55 minutes after creation
      actor: order.DeliveryAgent.name,
      description: 'Order delivered successfully'
    });
  }
  if (order.status === ORDER_STATUS.CANCELLED) {
    timeline.push({
      status: ORDER_STATUS.CANCELLED,
      timestamp: order.updatedAt,
      actor: 'System',
      description: order.cancelReason || 'Order was cancelled'
    });
  }
  return timeline;
};