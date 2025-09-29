const {
  DeliveryAgent,
  Order,
  Restaurant
} = require('../models');
const {
  ORDER_STATUS
} = require('../utils/constants');
const {
  sequelize
} = require('../config/db');
// Get nearby restaurants with ready orders
exports.getNearbyOrders = async agent => {
  // In a real app, we would use geospatial queries to find nearby orders
  // For now, we'll just return all ready orders
  const readyOrders = await Order.findAll({
    where: {
      status: ORDER_STATUS.READY,
      deliveryAgentId: null
    },
    include: [{
      model: Restaurant,
      attributes: ['id', 'name', 'address', 'phone', 'location']
    }],
    order: [['createdAt', 'ASC']]
  });
  return readyOrders;
};
// Calculate agent earnings
exports.calculateEarnings = async (agentId, period = 'week') => {
  let startDate;
  const now = new Date();
  // Set start date based on period
  switch (period) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }
  // Get completed orders
  const completedOrders = await Order.findAll({
    where: {
      deliveryAgentId: agentId,
      status: ORDER_STATUS.DELIVERED,
      updatedAt: {
        [Op.gte]: startDate
      }
    },
    attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'totalDeliveries'], [sequelize.fn('SUM', sequelize.col('deliveryFee')), 'totalEarnings']],
    raw: true
  });
  // Get daily earnings breakdown
  const dailyEarnings = await Order.findAll({
    where: {
      deliveryAgentId: agentId,
      status: ORDER_STATUS.DELIVERED,
      updatedAt: {
        [Op.gte]: startDate
      }
    },
    attributes: [[sequelize.fn('DATE', sequelize.col('updatedAt')), 'date'], [sequelize.fn('COUNT', sequelize.col('id')), 'deliveries'], [sequelize.fn('SUM', sequelize.col('deliveryFee')), 'earnings']],
    group: [sequelize.fn('DATE', sequelize.col('updatedAt'))],
    order: [[sequelize.fn('DATE', sequelize.col('updatedAt')), 'ASC']],
    raw: true
  });
  return {
    period,
    totalDeliveries: completedOrders[0]?.totalDeliveries || 0,
    totalEarnings: completedOrders[0]?.totalEarnings || 0,
    dailyBreakdown: dailyEarnings
  };
};
// Find available agent for order
exports.findAvailableAgent = async order => {
  // Get restaurant location
  const restaurant = await Restaurant.findByPk(order.restaurantId);
  if (!restaurant || !restaurant.location) {
    return null;
  }
  // Find available agents near the restaurant
  // In a real app, we would use geospatial queries to find nearby agents
  const availableAgents = await DeliveryAgent.findAll({
    where: {
      isActive: true,
      isAvailable: true,
      isVerified: true
    },
    limit: 1,
    order: sequelize.random()
  });
  return availableAgents[0] || null;
};
// Update agent location
exports.updateAgentLocation = async (agentId, latitude, longitude) => {
  const agent = await DeliveryAgent.findByPk(agentId);
  if (!agent) {
    return false;
  }
  agent.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  await agent.save();
  return true;
};