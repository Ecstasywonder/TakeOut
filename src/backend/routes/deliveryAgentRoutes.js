const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../controllers/deliveryAgentController');
const authMiddleware = require('../middleware/authMiddleware');
// All routes require authentication
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('delivery'));
// Profile routes
router.get('/profile', deliveryAgentController.getProfile);
router.put('/profile', deliveryAgentController.updateProfile);
router.post('/toggle-availability', deliveryAgentController.toggleAvailability);
router.post('/location', deliveryAgentController.updateLocation);
// Order routes
router.get('/available-orders', deliveryAgentController.getAvailableOrders);
router.post('/orders/:orderId/accept', deliveryAgentController.acceptOrder);
router.get('/current-orders', deliveryAgentController.getCurrentOrders);
router.put('/orders/:orderId/status', deliveryAgentController.updateOrderStatus);
router.get('/delivery-history', deliveryAgentController.getDeliveryHistory);
// Earnings
router.get('/earnings', deliveryAgentController.getEarningsSummary);
module.exports = router;