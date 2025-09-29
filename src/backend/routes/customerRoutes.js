const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
// All routes require authentication
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('customer'));
// Customer profile routes
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
// Restaurant routes
router.get('/restaurants', customerController.getRestaurants);
router.get('/restaurants/:id', customerController.getRestaurantWithMenu);
// Order routes
router.post('/orders', customerController.placeOrder);
router.get('/orders', customerController.getOrders);
router.get('/orders/:id', customerController.getOrderDetails);
router.post('/orders/:id/rate', customerController.rateOrder);
module.exports = router;