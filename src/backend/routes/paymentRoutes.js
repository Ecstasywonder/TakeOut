const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
// Public webhook route
router.post('/webhook', paymentController.handleWebhook);
// Initialize Paystack transaction (protected)
router.post('/init', authMiddleware.protect, paymentController.initPayment);
// Protected routes
router.use(authMiddleware.protect);
// Routes for all authenticated users
router.post('/process', paymentController.processPayment);
router.get('/:id', paymentController.getPaymentDetails);
// Routes for delivery agents
router.post('/:orderId/confirm-cash', authMiddleware.restrictTo('delivery'), paymentController.confirmCashPayment);
// Admin only routes
router.post('/:paymentId/refund', authMiddleware.restrictTo('admin'), paymentController.processRefund);
module.exports = router;