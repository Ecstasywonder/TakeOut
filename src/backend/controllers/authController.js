const jwt = require('jsonwebtoken');
const {
  Customer,
  Restaurant,
  DeliveryAgent,
  Admin
} = require('../models');
const env = require('../config/env');
const {
  ApiError
} = require('../utils/errors');
// Optional Supabase server-side integration
let supabase = null;
if (env.SUPABASE_URL && env.SUPABASE_KEY) {
  try {
    supabase = require('@supabase/supabase-js').createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err.message);
    supabase = null;
  }
}
// Generate JWT token
const generateToken = (user, role) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    role
  }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};
// Register a new user (customer, restaurant, delivery agent)
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      ...otherData
    } = req.body;
    // Validate role
    if (!['customer', 'restaurant', 'delivery'].includes(role)) {
      throw new ApiError('Invalid role specified', 400);
    }
    // If Supabase is configured, create user with Supabase Auth (server-side)
    if (supabase) {
      // Use admin API (service_role key) to create user server-side
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role, ...otherData }
      });
      if (error) return next(new ApiError(error.message, 400));
      // Create local profile record in Sequelize if needed
      let user;
      if (role === 'customer') {
        user = await Customer.create({ name, email, password: 'supabase', ...otherData });
      } else if (role === 'restaurant') {
        user = await Restaurant.create({ name, email, password: 'supabase', ...otherData });
      } else if (role === 'delivery') {
        user = await DeliveryAgent.create({ name, email, password: 'supabase', ...otherData });
      }
      // Return the Supabase user id and info (no JWT from our server)
      return res.status(201).json({ success: true, data: { user: data.user, role } });
    }
    // Check if email already exists in any role
    const customerExists = await Customer.findOne({
      where: {
        email
      }
    });
    const restaurantExists = await Restaurant.findOne({
      where: {
        email
      }
    });
    const deliveryAgentExists = await DeliveryAgent.findOne({
      where: {
        email
      }
    });
    if (customerExists || restaurantExists || deliveryAgentExists) {
      throw new ApiError('Email already in use', 400);
    }
    let user;
    // Create user based on role (fallback local DB)
    if (role === 'customer') {
      user = await Customer.create({ name, email, password, ...otherData });
    } else if (role === 'restaurant') {
      user = await Restaurant.create({ name, email, password, ...otherData });
    } else if (role === 'delivery') {
      user = await DeliveryAgent.create({ name, email, password, ...otherData });
    }
    // Generate token
    const token = generateToken(user, role);
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    res.status(201).json({ success: true, data: { user: userResponse, role, token } });
  } catch (error) {
    next(error);
  }
};
// Login user
exports.login = async (req, res, next) => {
  try {
    const {
      email,
      password,
      role
    } = req.body;
    if (!email || !password || !role) {
      throw new ApiError('Please provide email, password and role', 400);
    }
    // If Supabase is configured, use Supabase signIn to verify credentials
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) return next(new ApiError(error ? error.message : 'Invalid credentials', 401));
      // Optionally map to local user or return Supabase session
      return res.status(200).json({ success: true, data: { user: data.user, role, token: data.session.access_token } });
    }
    let user;
    // Find user based on role
    if (role === 'customer') {
      user = await Customer.findOne({
        where: {
          email
        }
      });
    } else if (role === 'restaurant') {
      user = await Restaurant.findOne({
        where: {
          email
        }
      });
    } else if (role === 'delivery') {
      user = await DeliveryAgent.findOne({
        where: {
          email
        }
      });
    } else if (role === 'admin') {
      user = await Admin.findOne({
        where: {
          email
        }
      });
    } else {
      throw new ApiError('Invalid role specified', 400);
    }
    // Check if user exists
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    // Check if password is correct
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }
    // Generate token
    const token = generateToken(user, role);
    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
// Get current user
exports.getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      role: req.role
    }
  });
};
// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ApiError('Please provide current password and new password', 400);
    }
    let user;
    // Get user based on role
    if (req.role === 'customer') {
      user = await Customer.findByPk(req.user.id);
    } else if (req.role === 'restaurant') {
      user = await Restaurant.findByPk(req.user.id);
    } else if (req.role === 'delivery') {
      user = await DeliveryAgent.findByPk(req.user.id);
    } else if (req.role === 'admin') {
      user = await Admin.findByPk(req.user.id);
    }
    // Check if current password is correct
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 401);
    }
    // Update password
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};