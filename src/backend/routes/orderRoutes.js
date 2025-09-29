const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
// All routes require authentication
router.use(authMiddleware.protect);
// Admin only routes
router.get('/', authMiddleware.restrictTo('admin'), orderController.getAllOrders);
router.get('/statistics', authMiddleware.restrictTo('admin'), orderController.getOrderStatistics);
// Routes accessible by admin and restaurant
router.put('/:id/status', authMiddleware.restrictTo('admin', 'restaurant'), orderController.updateOrderStatus);
// Routes accessible by admin and delivery agent
router.put('/:id/assign-delivery-agent', authMiddleware.restrictTo('admin'), orderController.assignDeliveryAgent);
// Routes accessible by all roles
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/cancel', orderController.cancelOrder);
module.exports = router;