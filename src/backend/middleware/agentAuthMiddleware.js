const {
  DeliveryAgent
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
// Verify delivery agent is verified
exports.verifyAgentStatus = async (req, res, next) => {
  try {
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent.isVerified) {
      throw new ApiError('Your account is pending verification', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};
// Check if agent is available
exports.checkAvailability = async (req, res, next) => {
  try {
    const agent = await DeliveryAgent.findByPk(req.user.id);
    if (!agent.isAvailable) {
      throw new ApiError('You must be available to perform this action', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};