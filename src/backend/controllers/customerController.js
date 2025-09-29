const {
  Customer,
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
  Payment
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
// Get customer profile
exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
// Update customer profile
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      state,
      postalCode
    } = req.body;
    const customer = await Customer.findByPk(req.user.id);
    if (!customer) {
      throw new ApiError('Customer not found', 404);
    }
    // Update fields
    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.city = city || customer.city;
    customer.state = state || customer.state;
    customer.postalCode = postalCode || customer.postalCode;
    await customer.save();
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
// Get all restaurants
exports.getRestaurants = async (req, res, next) => {
  try {
    const {
      cuisine,
      rating,
      search
    } = req.query;
    let whereClause = {
      isActive: true,
      isVerified: true
    };
    if (cuisine) {
      whereClause.cuisine = cuisine;
    }
    if (rating) {
      whereClause.rating = {
        [Op.gte]: parseFloat(rating)
      };
    }
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{
          name: {
            [Op.iLike]: `%${search}%`
          }
        }, {
          cuisine: {
            [Op.iLike]: `%${search}%`
          }
        }, {
          description: {
            [Op.iLike]: `%${search}%`
          }
        }]
      };
    }
    const restaurants = await Restaurant.findAll({
      where: whereClause,
      attributes: {
        exclude: ['password']
      }
    });
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};
// Get restaurant details with menu
exports.getRestaurantWithMenu = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const restaurant = await Restaurant.findOne({
      where: {
        id,
        isActive: true,
        isVerified: true
      },
      attributes: {
        exclude: ['password']
      }
    });
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    // Get restaurant menu items
    const menuItems = await MenuItem.findAll({
      where: {
        restaurantId: id,
        isAvailable: true
      },
      order: [['category', 'ASC']]
    });
    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menu: menuByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};
// Place a new order
exports.placeOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod
    } = req.body;
    // Validate restaurant
    const restaurant = await Restaurant.findOne({
      where: {
        id: restaurantId,
        isActive: true,
        isVerified: true
      },
      transaction: t
    });
    if (!restaurant) {
      throw new ApiError('Restaurant not found or unavailable', 404);
    }
    // Validate items
    if (!items || !items.length) {
      throw new ApiError('No items in the order', 400);
    }
    // Fetch menu items to validate and calculate total
    const itemIds = items.map(item => item.menuItemId);
    const menuItems = await MenuItem.findAll({
      where: {
        id: itemIds,
        restaurantId,
        isAvailable: true
      },
      transaction: t
    });
    if (menuItems.length !== itemIds.length) {
      throw new ApiError('Some items are not available', 400);
    }
    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || null
      });
    }
    // Apply minimum order check
    if (restaurant.minOrderAmount && subtotal < restaurant.minOrderAmount) {
      throw new ApiError(`Minimum order amount is $${restaurant.minOrderAmount}`, 400);
    }
    // Calculate tax (assuming 8% tax rate)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    // Get delivery fee from restaurant
    const deliveryFee = restaurant.deliveryFee || 0;
    // Calculate total
    const totalAmount = subtotal + tax + deliveryFee;
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    // Create order
    const order = await Order.create({
      orderNumber,
      status: ORDER_STATUS.PENDING,
      totalAmount,
      subtotal,
      tax,
      deliveryFee,
      deliveryAddress,
      deliveryInstructions,
      customerId: req.user.id,
      restaurantId
    }, {
      transaction: t
    });
    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      }, {
        transaction: t
      });
    }
    // Create payment record
    await Payment.create({
      amount: totalAmount,
      method: paymentMethod,
      status: paymentMethod === 'cash' ? 'pending' : 'completed',
      orderId: order.id
    }, {
      transaction: t
    });
    await t.commit();
    res.status(201).json({
      success: true,
      data: {
        order,
        orderItems
      }
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
// Get customer orders
exports.getOrders = async (req, res, next) => {
  try {
    const {
      status
    } = req.query;
    let whereClause = {
      customerId: req.user.id
    };
    if (status) {
      whereClause.status = status;
    }
    const orders = await Order.findAll({
      where: whereClause,
      include: [{
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
    const order = await Order.findOne({
      where: {
        id,
        customerId: req.user.id
      },
      include: [{
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
// Rate and review an order
exports.rateOrder = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      rating,
      feedback
    } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError('Rating must be between 1 and 5', 400);
    }
    const order = await Order.findOne({
      where: {
        id,
        customerId: req.user.id,
        status: ORDER_STATUS.DELIVERED
      }
    });
    if (!order) {
      throw new ApiError('Order not found or not delivered yet', 404);
    }
    // Update order with rating
    order.customerRating = rating;
    order.customerFeedback = feedback || null;
    await order.save();
    // Update restaurant rating
    const restaurant = await Restaurant.findByPk(order.restaurantId);
    const newRating = (restaurant.rating * restaurant.totalRatings + rating) / (restaurant.totalRatings + 1);
    restaurant.rating = newRating;
    restaurant.totalRatings += 1;
    await restaurant.save();
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};