const {
  Order,
  OrderItem,
  Customer,
  Restaurant,
  DeliveryAgent,
  Payment
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
const {
  ORDER_STATUS
} = require('../utils/constants');
const orderService = require('../services/orderService');
const notificationService = require('../services/notificationService');
// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const {
      status,
      startDate,
      endDate
    } = req.query;
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'phone']
      }, {
        model: Restaurant,
        attributes: ['id', 'name']
      }, {
        model: DeliveryAgent,
        attributes: ['id', 'name']
      }, {
        model: Payment,
        attributes: ['id', 'method', 'status', 'amount']
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
// Get order details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'phone', 'address']
      }, {
        model: Restaurant,
        attributes: ['id', 'name', 'phone', 'address']
      }, {
        model: DeliveryAgent,
        attributes: ['id', 'name', 'phone']
      }, {
        model: OrderItem,
        include: [{
          model: MenuItem,
          attributes: ['id', 'name', 'price', 'image']
        }]
      }, {
        model: Payment,
        attributes: ['id', 'method', 'status', 'amount', 'transactionId']
      }]
    });
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      status
    } = req.body;
    // Validate status
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new ApiError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    // Get order
    const order = await Order.findByPk(id);
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check for valid status transition
    const isValidTransition = orderService.isValidStatusTransition(order.status, status);
    if (!isValidTransition) {
      throw new ApiError(`Invalid status transition from ${order.status} to ${status}`, 400);
    }
    // Update order status
    order.status = status;
    // Additional actions based on status
    if (status === ORDER_STATUS.DELIVERED) {
      order.actualDeliveryTime = new Date();
      // If delivery agent exists, update their stats
      if (order.deliveryAgentId) {
        const deliveryAgent = await DeliveryAgent.findByPk(order.deliveryAgentId);
        deliveryAgent.totalDeliveries += 1;
        await deliveryAgent.save();
      }
    }
    await order.save();
    // Send notifications
    notificationService.sendOrderStatusUpdate(order);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Assign delivery agent to order
exports.assignDeliveryAgent = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      deliveryAgentId
    } = req.body;
    if (!deliveryAgentId) {
      throw new ApiError('Delivery agent ID is required', 400);
    }
    // Check if order exists
    const order = await Order.findByPk(id);
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check if order status is appropriate for assignment
    if (order.status !== ORDER_STATUS.READY) {
      throw new ApiError('Order must be in READY status to assign a delivery agent', 400);
    }
    // Check if delivery agent exists and is available
    const deliveryAgent = await DeliveryAgent.findOne({
      where: {
        id: deliveryAgentId,
        isActive: true,
        isAvailable: true
      }
    });
    if (!deliveryAgent) {
      throw new ApiError('Delivery agent not found or not available', 404);
    }
    // Assign delivery agent to order
    order.deliveryAgentId = deliveryAgentId;
    await order.save();
    // Mark delivery agent as unavailable
    deliveryAgent.isAvailable = false;
    await deliveryAgent.save();
    // Send notification to delivery agent
    notificationService.notifyDeliveryAgentAssignment(order, deliveryAgent);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      reason
    } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check if order can be cancelled
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)) {
      throw new ApiError('Order cannot be cancelled at this stage', 400);
    }
    // Update order status
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelReason = reason || 'Cancelled by admin';
    await order.save();
    // Process refund if payment was made
    const payment = await Payment.findOne({
      where: {
        orderId: id
      }
    });
    if (payment && payment.status === 'completed') {
      payment.status = 'refunded';
      payment.refundAmount = payment.amount;
      payment.refundDate = new Date();
      payment.refundReason = reason || 'Order cancelled';
      await payment.save();
    }
    // Send notifications
    notificationService.sendOrderCancellation(order);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Get order statistics
exports.getOrderStatistics = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate
    } = req.query;
    const stats = await orderService.getOrderStatistics(startDate, endDate);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};