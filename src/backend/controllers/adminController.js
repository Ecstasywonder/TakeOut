const {
  Customer,
  Restaurant,
  DeliveryAgent,
  Admin,
  Order
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
const {
  sequelize
} = require('../config/db');
const {
  ORDER_STATUS
} = require('../utils/constants');
const bcrypt = require('bcryptjs');
// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const customerCount = await Customer.count();
    const restaurantCount = await Restaurant.count();
    const deliveryAgentCount = await DeliveryAgent.count();
    const orderCount = await Order.count();
    // Get revenue stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        status: {
          [Op.not]: ORDER_STATUS.CANCELLED
        },
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    // Get week start
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weeklyRevenue = await Order.sum('totalAmount', {
      where: {
        status: {
          [Op.not]: ORDER_STATUS.CANCELLED
        },
        createdAt: {
          [Op.gte]: weekStart
        }
      }
    });
    // Get month start
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyRevenue = await Order.sum('totalAmount', {
      where: {
        status: {
          [Op.not]: ORDER_STATUS.CANCELLED
        },
        createdAt: {
          [Op.gte]: monthStart
        }
      }
    });
    // Get average order value
    const avgOrderValue = await Order.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('totalAmount')), 'average']],
      where: {
        status: {
          [Op.not]: ORDER_STATUS.CANCELLED
        }
      },
      raw: true
    });
    // Get recent activities
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Customer,
        attributes: ['name']
      }, {
        model: Restaurant,
        attributes: ['name']
      }]
    });
    const recentCustomers = await Customer.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['password']
      }
    });
    const recentRestaurants = await Restaurant.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['password']
      }
    });
    // Get pending approvals
    const pendingRestaurants = await Restaurant.count({
      where: {
        isVerified: false
      }
    });
    const pendingDeliveryAgents = await DeliveryAgent.count({
      where: {
        isVerified: false
      }
    });
    res.status(200).json({
      success: true,
      data: {
        counts: {
          customers: customerCount,
          restaurants: restaurantCount,
          deliveryAgents: deliveryAgentCount,
          orders: orderCount
        },
        revenue: {
          today: todayRevenue || 0,
          weekly: weeklyRevenue || 0,
          monthly: monthlyRevenue || 0,
          averageOrder: avgOrderValue?.average || 0
        },
        recent: {
          orders: recentOrders,
          customers: recentCustomers,
          restaurants: recentRestaurants
        },
        pending: {
          restaurants: pendingRestaurants,
          deliveryAgents: pendingDeliveryAgents
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
// User management
// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      role,
      status
    } = req.query;
    let customers, restaurants, deliveryAgents, admins;
    if (!role || role === 'customer') {
      const whereClause = {};
      if (status) {
        whereClause.isActive = status === 'active';
      }
      customers = await Customer.findAll({
        where: whereClause,
        attributes: {
          exclude: ['password']
        }
      });
    }
    if (!role || role === 'restaurant') {
      const whereClause = {};
      if (status) {
        whereClause.isActive = status === 'active';
      }
      restaurants = await Restaurant.findAll({
        where: whereClause,
        attributes: {
          exclude: ['password']
        }
      });
    }
    if (!role || role === 'delivery') {
      const whereClause = {};
      if (status) {
        whereClause.isActive = status === 'active';
      }
      deliveryAgents = await DeliveryAgent.findAll({
        where: whereClause,
        attributes: {
          exclude: ['password']
        }
      });
    }
    if (!role || role === 'admin') {
      const whereClause = {};
      if (status) {
        whereClause.isActive = status === 'active';
      }
      admins = await Admin.findAll({
        where: whereClause,
        attributes: {
          exclude: ['password']
        }
      });
    }
    res.status(200).json({
      success: true,
      data: {
        customers: customers || [],
        restaurants: restaurants || [],
        deliveryAgents: deliveryAgents || [],
        admins: admins || []
      }
    });
  } catch (error) {
    next(error);
  }
};
// Toggle user status (activate/deactivate)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const {
      role,
      id
    } = req.params;
    let user;
    switch (role) {
      case 'customer':
        user = await Customer.findByPk(id);
        break;
      case 'restaurant':
        user = await Restaurant.findByPk(id);
        break;
      case 'delivery':
        user = await DeliveryAgent.findByPk(id);
        break;
      case 'admin':
        // Only super_admin can deactivate other admins
        if (req.user.role !== 'super_admin') {
          throw new ApiError('Only super admins can modify admin accounts', 403);
        }
        user = await Admin.findByPk(id);
        break;
      default:
        throw new ApiError('Invalid role specified', 400);
    }
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    // Toggle status
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};
// Verify restaurant or delivery agent
exports.verifyUser = async (req, res, next) => {
  try {
    const {
      role,
      id
    } = req.params;
    let user;
    if (role === 'restaurant') {
      user = await Restaurant.findByPk(id);
    } else if (role === 'delivery') {
      user = await DeliveryAgent.findByPk(id);
    } else {
      throw new ApiError('Invalid role specified', 400);
    }
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    // Verify user
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};
// Create admin user
exports.createAdmin = async (req, res, next) => {
  try {
    // Only super_admin can create other admins
    if (req.user.role !== 'super_admin') {
      throw new ApiError('Only super admins can create admin accounts', 403);
    }
    const {
      name,
      email,
      password,
      role = 'admin'
    } = req.body;
    // Validate admin role
    if (!['admin', 'support'].includes(role)) {
      throw new ApiError('Invalid admin role specified', 400);
    }
    // Check if email already exists
    const existingAdmin = await Admin.findOne({
      where: {
        email
      }
    });
    if (existingAdmin) {
      throw new ApiError('Email already in use', 400);
    }
    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role
    });
    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;
    res.status(201).json({
      success: true,
      data: adminData
    });
  } catch (error) {
    next(error);
  }
};