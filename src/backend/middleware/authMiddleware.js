const jwt = require('jsonwebtoken');
const {
  Customer,
  Restaurant,
  DeliveryAgent,
  Admin
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
const env = require('../config/env');
// Protect routes - verify token and set user
exports.protect = async (req, res, next) => {
  try {
    let token;
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check if token exists
    if (!token) {
      throw new ApiError('Not authorized to access this route', 401);
    }
    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET);
      let user;
      const {
        id,
        role
      } = decoded;
      // Get user based on role
      switch (role) {
        case 'customer':
          user = await Customer.findByPk(id, {
            attributes: {
              exclude: ['password']
            }
          });
          break;
        case 'restaurant':
          user = await Restaurant.findByPk(id, {
            attributes: {
              exclude: ['password']
            }
          });
          break;
        case 'delivery':
          user = await DeliveryAgent.findByPk(id, {
            attributes: {
              exclude: ['password']
            }
          });
          break;
        case 'admin':
          user = await Admin.findByPk(id, {
            attributes: {
              exclude: ['password']
            }
          });
          break;
        default:
          throw new ApiError('Invalid user role', 401);
      }
      // Check if user exists
      if (!user) {
        throw new ApiError('User not found', 401);
      }
      // Check if user is active
      if (!user.isActive) {
        throw new ApiError('User account is deactivated', 401);
      }
      // Set user and role in request
      req.user = user;
      req.role = role;
      next();
    } catch (error) {
      throw new ApiError('Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};
// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(new ApiError(`User role ${req.role} is not authorized to access this route`, 403));
    }
    next();
  };
};