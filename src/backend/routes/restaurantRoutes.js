const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
// All routes require authentication
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('restaurant'));
// Restaurant profile routes
router.get('/profile', restaurantController.getProfile);
router.put('/profile', restaurantController.updateProfile);
router.post('/toggle-status', restaurantController.toggleStatus);
// Menu routes
router.get('/menu', restaurantController.getMenuItems);
router.post('/menu', restaurantController.createMenuItem);
router.put('/menu/:id', restaurantController.updateMenuItem);
router.delete('/menu/:id', restaurantController.deleteMenuItem);
// Order routes
router.get('/orders', restaurantController.getOrders);
router.get('/orders/:id', restaurantController.getOrderDetails);
router.put('/orders/:id/status', restaurantController.updateOrderStatus);
// Dashboard stats
router.get('/dashboard', restaurantController.getDashboardStats);
module.exports = router;