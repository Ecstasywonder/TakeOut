const {
  ApiError
} = require('../utils/errors');
const logger = require('../utils/logger');
// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  };
  error.message = err.message;
  // Log error
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack
  });
  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(message, 400);
  }
  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    error = new ApiError('Database error', 500);
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Token expired', 401);
  }
  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    }
  });
};
module.exports = errorHandler;