const {
  ApiError
} = require('./errors');
// Validate email format
exports.validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
// Validate password strength
exports.validatePassword = password => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(String(password));
};
// Validate phone number
exports.validatePhone = phone => {
  const re = /^\+?[1-9]\d{9,14}$/;
  return re.test(String(phone));
};
// Validate request body
exports.validateRequest = schema => {
  return (req, res, next) => {
    const {
      error
    } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(errorMessage, 400));
    }
    next();
  };
};
// Validate pagination parameters
exports.validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  if (page < 1 || limit < 1 || limit > 100) {
    return next(new ApiError('Invalid pagination parameters', 400));
  }
  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit
  };
  next();
};