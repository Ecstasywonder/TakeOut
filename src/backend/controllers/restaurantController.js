const {
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
  Customer,
  DeliveryAgent
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
// Get restaurant profile
exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
// Update restaurant profile
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      state,
      postalCode,
      cuisine,
      description,
      openingTime,
      closingTime,
      minOrderAmount,
      deliveryFee,
      estimatedDeliveryTime,
      image
    } = req.body;
    const restaurant = await Restaurant.findByPk(req.user.id);
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    // Update fields
    restaurant.name = name || restaurant.name;
    restaurant.phone = phone || restaurant.phone;
    restaurant.address = address || restaurant.address;
    restaurant.city = city || restaurant.city;
    restaurant.state = state || restaurant.state;
    restaurant.postalCode = postalCode || restaurant.postalCode;
    restaurant.cuisine = cuisine || restaurant.cuisine;
    restaurant.description = description || restaurant.description;
    restaurant.openingTime = openingTime || restaurant.openingTime;
    restaurant.closingTime = closingTime || restaurant.closingTime;
    restaurant.minOrderAmount = minOrderAmount || restaurant.minOrderAmount;
    restaurant.deliveryFee = deliveryFee || restaurant.deliveryFee;
    restaurant.estimatedDeliveryTime = estimatedDeliveryTime || restaurant.estimatedDeliveryTime;
    restaurant.image = image || restaurant.image;
    await restaurant.save();
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
// Toggle restaurant open/closed status
exports.toggleStatus = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.user.id);
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();
    res.status(200).json({
      success: true,
      data: {
        isOpen: restaurant.isOpen
      }
    });
  } catch (error) {
    next(error);
  }
};
// Create a new menu item
exports.createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      preparationTime
    } = req.body;
    if (!name || !price || !category) {
      throw new ApiError('Name, price, and category are required', 400);
    }
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      spicyLevel: spicyLevel || 0,
      preparationTime,
      restaurantId: req.user.id
    });
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};
// Update a menu item
exports.updateMenuItem = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      preparationTime
    } = req.body;
    const menuItem = await MenuItem.findOne({
      where: {
        id,
        restaurantId: req.user.id
      }
    });
    if (!menuItem) {
      throw new ApiError('Menu item not found', 404);
    }
    // Update fields
    menuItem.name = name || menuItem.name;
    menuItem.description = description !== undefined ? description : menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.image = image !== undefined ? image : menuItem.image;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
    menuItem.isVegetarian = isVegetarian !== undefined ? isVegetarian : menuItem.isVegetarian;
    menuItem.isVegan = isVegan !== undefined ? isVegan : menuItem.isVegan;
    menuItem.isGlutenFree = isGlutenFree !== undefined ? isGlutenFree : menuItem.isGlutenFree;
    menuItem.spicyLevel = spicyLevel !== undefined ? spicyLevel : menuItem.spicyLevel;
    menuItem.preparationTime = preparationTime !== undefined ? preparationTime : menuItem.preparationTime;
    await menuItem.save();
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};
// Delete a menu item
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const menuItem = await MenuItem.findOne({
      where: {
        id,
        restaurantId: req.user.id
      }
    });
    if (!menuItem) {
      throw new ApiError('Menu item not found', 404);
    }
    await menuItem.destroy();
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
// Get all menu items for the restaurant
exports.getMenuItems = async (req, res, next) => {
  try {
    const {
      category
    } = req.query;
    let whereClause = {
      restaurantId: req.user.id
    };
    if (category) {
      whereClause.category = category;
    }
    const menuItems = await MenuItem.findAll({
      where: whereClause,
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    // Group by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    res.status(200).json({
      success: true,
      data: menuByCategory,
      count: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};
// Get restaurant orders
exports.getOrders = async (req, res, next) => {
  try {
    const {
      status
    } = req.query;
    let whereClause = {
      restaurantId: req.user.id
    };
    if (status) {
      whereClause.status = status;
    }
    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'phone']
      }, {
        model: DeliveryAgent,
        attributes: ['id', 'name', 'phone']
      }, {
        model: OrderItem,
        include: [{
          model: MenuItem,
          attributes: ['id', 'name', 'price']
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
// Get order details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const order = await Order.findOne({
      where: {
        id,
        restaurantId: req.user.id
      },
      include: [{
        model: Customer,
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
        attributes: ['id', 'method', 'status', 'amount']
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
    const allowedStatuses = [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY];
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(`Status must be one of: ${allowedStatuses.join(', ')}`, 400);
    }
    const order = await Order.findOne({
      where: {
        id,
        restaurantId: req.user.id
      }
    });
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check for valid status transitions
    const currentStatus = order.status;
    if (status === ORDER_STATUS.CONFIRMED && currentStatus !== ORDER_STATUS.PENDING || status === ORDER_STATUS.PREPARING && currentStatus !== ORDER_STATUS.CONFIRMED || status === ORDER_STATUS.READY && currentStatus !== ORDER_STATUS.PREPARING) {
      throw new ApiError(`Cannot transition from ${currentStatus} to ${status}`, 400);
    }
    // Update order status
    order.status = status;
    // If order is ready, set estimated delivery time (30 minutes from now)
    if (status === ORDER_STATUS.READY) {
      const estimatedTime = new Date();
      estimatedTime.setMinutes(estimatedTime.getMinutes() + 30);
      order.estimatedDeliveryTime = estimatedTime;
    }
    await order.save();
    // Notify delivery agents if order is ready
    if (status === ORDER_STATUS.READY) {
      // This will be handled by Socket.IO in the notification service
      // notificationService.notifyDeliveryAgents(order);
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// Get restaurant dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get new orders count
    const newOrdersCount = await Order.count({
      where: {
        restaurantId,
        status: ORDER_STATUS.PENDING,
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    // Get preparing orders count
    const preparingOrdersCount = await Order.count({
      where: {
        restaurantId,
        status: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING],
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    // Get completed orders count
    const completedOrdersCount = await Order.count({
      where: {
        restaurantId,
        status: [ORDER_STATUS.DELIVERED],
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    // Get today's revenue
    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        restaurantId,
        status: {
          [Op.not]: ORDER_STATUS.CANCELLED
        },
        createdAt: {
          [Op.gte]: today
        }
      }
    });
    // Get recent orders
    const recentOrders = await Order.findAll({
      where: {
        restaurantId
      },
      include: [{
        model: Customer,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    res.status(200).json({
      success: true,
      data: {
        newOrders: newOrdersCount || 0,
        preparingOrders: preparingOrdersCount || 0,
        completedOrders: completedOrdersCount || 0,
        todayRevenue: todayRevenue || 0,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};