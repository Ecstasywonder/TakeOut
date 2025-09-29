const {
  DeliveryAgent,
  Order,
  Customer,
  Restaurant,
  OrderItem,
  MenuItem
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
const {
  ORDER_STATUS
} = require('../utils/constants');
const agentService = require('../services/agentService');
const notificationService = require('../services/notificationService');
// Get delivery agent profile
exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
// Update delivery agent profile
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      vehicleType,
      vehicleNumber
    } = req.body;
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent) {
      throw new ApiError('Delivery agent not found', 404);
    }
    // Update fields
    agent.name = name || agent.name;
    agent.phone = phone || agent.phone;
    agent.vehicleType = vehicleType || agent.vehicleType;
    agent.vehicleNumber = vehicleNumber || agent.vehicleNumber;
    await agent.save();
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};
// Toggle availability status
exports.toggleAvailability = async (req, res, next) => {
  try {
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent) {
      throw new ApiError('Delivery agent not found', 404);
    }
    // Check if agent has ongoing deliveries
    if (agent.isAvailable === false) {
      const ongoingDeliveries = await Order.count({
        where: {
          deliveryAgentId: agent.id,
          status: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT]
        }
      });
      if (ongoingDeliveries > 0) {
        throw new ApiError('Cannot change status while having ongoing deliveries', 400);
      }
    }
    agent.isAvailable = !agent.isAvailable;
    await agent.save();
    res.status(200).json({
      success: true,
      data: {
        isAvailable: agent.isAvailable
      }
    });
  } catch (error) {
    next(error);
  }
};
// Update current location
exports.updateLocation = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude
    } = req.body;
    if (!latitude || !longitude) {
      throw new ApiError('Latitude and longitude are required', 400);
    }
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent) {
      throw new ApiError('Delivery agent not found', 404);
    }
    // Update location
    agent.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    await agent.save();
    // Update location for any active orders
    const activeOrders = await Order.findAll({
      where: {
        deliveryAgentId: agent.id,
        status: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT]
      }
    });
    // Notify customers about location update
    for (const order of activeOrders) {
      notificationService.updateOrderLocation(order.id, latitude, longitude);
    }
    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
// Get available orders for delivery
exports.getAvailableOrders = async (req, res, next) => {
  try {
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent) {
      throw new ApiError('Delivery agent not found', 404);
    }
    if (!agent.isAvailable) {
      throw new ApiError('You must be available to see new orders', 400);
    }
    // Get nearby restaurants with ready orders
    const nearbyOrders = await agentService.getNearbyOrders(agent);
    res.status(200).json({
      success: true,
      count: nearbyOrders.length,
      data: nearbyOrders
    });
  } catch (error) {
    next(error);
  }
};
// Accept an order
exports.acceptOrder = async (req, res, next) => {
  try {
    const {
      orderId
    } = req.params;
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent) {
      throw new ApiError('Delivery agent not found', 404);
    }
    if (!agent.isAvailable) {
      throw new ApiError('You must be available to accept orders', 400);
    }
    // Check if order exists and is ready for pickup
    const order = await Order.findOne({
      where: {
        id: orderId,
        status: ORDER_STATUS.READY,
        deliveryAgentId: null
      },
      include: [{
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'phone']
      }, {
        model: Customer,
        attributes: ['id', 'name', 'address', 'phone']
      }]
    });
    if (!order) {
      throw new ApiError('Order not found or already assigned', 404);
    }
    // Assign agent to order
    order.deliveryAgentId = agent.id;
    await order.save();
    // Mark agent as unavailable
    agent.isAvailable = false;
    await agent.save();
    // Notify customer and restaurant
    notificationService.notifyOrderAccepted(order);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Get agent's current orders
exports.getCurrentOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        deliveryAgentId: req.user.id,
        status: [ORDER_STATUS.READY, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT]
      },
      include: [{
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'phone']
      }, {
        model: Customer,
        attributes: ['id', 'name', 'address', 'phone']
      }, {
        model: OrderItem,
        include: [{
          model: MenuItem,
          attributes: ['id', 'name']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
// Update order status (for delivery agent)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const {
      orderId
    } = req.params;
    const {
      status
    } = req.body;
    // Validate status
    const allowedStatuses = [ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED];
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(`Status must be one of: ${allowedStatuses.join(', ')}`, 400);
    }
    const order = await Order.findOne({
      where: {
        id: orderId,
        deliveryAgentId: req.user.id
      }
    });
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check for valid status transitions
    const currentStatus = order.status;
    if (status === ORDER_STATUS.PICKED_UP && currentStatus !== ORDER_STATUS.READY || status === ORDER_STATUS.IN_TRANSIT && currentStatus !== ORDER_STATUS.PICKED_UP || status === ORDER_STATUS.DELIVERED && currentStatus !== ORDER_STATUS.IN_TRANSIT) {
      throw new ApiError(`Cannot transition from ${currentStatus} to ${status}`, 400);
    }
    // Update order status
    order.status = status;
    // If delivered, set actual delivery time and make agent available again
    if (status === ORDER_STATUS.DELIVERED) {
      order.actualDeliveryTime = new Date();
      // Make agent available again
      const agent = await DeliveryAgent.findByPk(req.user.id);
      agent.isAvailable = true;
      agent.totalDeliveries += 1;
      await agent.save();
    }
    await order.save();
    // Notify customer about status update
    notificationService.sendOrderStatusUpdate(order);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Get delivery history
exports.getDeliveryHistory = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;
    let whereClause = {
      deliveryAgentId: req.user.id,
      status: ORDER_STATUS.DELIVERED
    };
    if (startDate && endDate) {
      whereClause.updatedAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    const offset = (page - 1) * limit;
    const {
      count,
      rows: orders
    } = await Order.findAndCountAll({
      where: whereClause,
      include: [{
        model: Restaurant,
        attributes: ['id', 'name']
      }, {
        model: Customer,
        attributes: ['id', 'name']
      }],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
// Get earnings summary
exports.getEarningsSummary = async (req, res, next) => {
  try {
    const {
      period = 'week'
    } = req.query;
    const earnings = await agentService.calculateEarnings(req.user.id, period);
    res.status(200).json({
      success: true,
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};