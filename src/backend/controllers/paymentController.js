const {
  Payment,
  Order,
  Customer
} = require('../models');
const {
  ApiError
} = require('../utils/errors');
const paymentService = require('../services/paymentService');
const {
  ORDER_STATUS
} = require('../utils/constants');
// Process a payment
exports.processPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      paymentMethod,
      token
    } = req.body;
    // Validate payment method
    const validMethods = ['credit_card', 'debit_card', 'cash', 'wallet'];
    if (!validMethods.includes(paymentMethod)) {
      throw new ApiError(`Invalid payment method. Must be one of: ${validMethods.join(', ')}`, 400);
    }
    // Get order
    const order = await Order.findByPk(orderId, {
      include: [{
        model: Customer
      }]
    });
    if (!order) {
      throw new ApiError('Order not found', 404);
    }
    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      where: {
        orderId,
        status: ['completed', 'pending']
      }
    });
    if (existingPayment) {
      throw new ApiError('Payment already processed for this order', 400);
    }
    let paymentResult;
    // Process payment based on method
    if (paymentMethod === 'cash') {
      // For cash payments, just create a pending payment record
      paymentResult = {
        success: true,
        transactionId: `CASH-${Date.now()}`,
        status: 'pending'
      };
    } else {
      // For card payments, process through payment service
      paymentResult = await paymentService.processCardPayment(token, order.totalAmount, order.orderNumber, order.Customer.email);
    }
    if (!paymentResult.success) {
      throw new ApiError('Payment processing failed', 400);
    }
    // Create payment record
    const payment = await Payment.create({
      orderId,
      amount: order.totalAmount,
      method: paymentMethod,
      status: paymentResult.status,
      transactionId: paymentResult.transactionId,
      paymentIntentId: paymentResult.paymentIntentId || null,
      paymentDate: new Date()
    });
    // Update order status if payment is completed
    if (paymentResult.status === 'completed') {
      order.status = ORDER_STATUS.CONFIRMED;
      await order.save();
    }
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
// Confirm cash payment (for delivery agents)
exports.confirmCashPayment = async (req, res, next) => {
  try {
    const {
      orderId
    } = req.params;
    // Get order
    const order = await Order.findOne({
      where: {
        id: orderId,
        deliveryAgentId: req.user.id,
        status: ORDER_STATUS.DELIVERED
      }
    });
    if (!order) {
      throw new ApiError('Order not found or not delivered by you', 404);
    }
    // Get payment
    const payment = await Payment.findOne({
      where: {
        orderId,
        method: 'cash',
        status: 'pending'
      }
    });
    if (!payment) {
      throw new ApiError('Cash payment not found for this order', 404);
    }
    // Update payment status
    payment.status = 'completed';
    payment.paymentDate = new Date();
    await payment.save();
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [{
        model: Order
      }]
    });
    if (!payment) {
      throw new ApiError('Payment not found', 404);
    }
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
// Process refund
exports.processRefund = async (req, res, next) => {
  try {
    const {
      paymentId
    } = req.params;
    const {
      amount,
      reason
    } = req.body;
    // Get payment
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Order
      }]
    });
    if (!payment) {
      throw new ApiError('Payment not found', 404);
    }
    if (payment.status !== 'completed') {
      throw new ApiError('Only completed payments can be refunded', 400);
    }
    if (payment.method === 'cash') {
      throw new ApiError('Cash payments cannot be automatically refunded', 400);
    }
    // Validate refund amount
    const refundAmount = amount || payment.amount;
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      throw new ApiError('Invalid refund amount', 400);
    }
    // Process refund through payment service
    const refundResult = await paymentService.processRefund(payment.paymentIntentId, refundAmount);
    if (!refundResult.success) {
      throw new ApiError('Refund processing failed', 400);
    }
    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundDate = new Date();
    payment.refundReason = reason || 'Refund requested by admin';
    await payment.save();
    // Update order status if full refund
    if (refundAmount === payment.amount) {
      payment.Order.status = ORDER_STATUS.CANCELLED;
      await payment.Order.save();
    }
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
// Handle payment webhook (for Stripe)
exports.handleWebhook = async (req, res, next) => {
  try {
    // Try Paystack webhook first
    if (req.headers['x-paystack-signature'] || req.body && req.body.event) {
      // Basic Paystack webhook handling: verify via reference if provided
      try {
        const event = req.body;
        // Example: handle charge.success or transfer.success events
        if (event && event.data && event.event === 'charge.success') {
          const reference = event.data.reference;
          const verified = await paymentService.verifyTransaction(reference);
          // Update payment record by matching reference
          await Payment.update({
            status: 'completed',
            paymentDate: new Date()
          }, {
            where: {
              transactionId: reference
            }
          });
          const payment = await Payment.findOne({
            where: {
              transactionId: reference
            },
            include: [{ model: Order }]
          });
          if (payment && payment.Order) {
            payment.Order.status = ORDER_STATUS.CONFIRMED;
            await payment.Order.save();
          }
        }
        return res.status(200).json({ received: true });
      } catch (err) {
        return next(err);
      }
    }
    // Fallback: Stripe webhook handling retained for compatibility
    const sig = req.headers['stripe-signature'];
    const event = paymentService.constructWebhookEvent ? paymentService.constructWebhookEvent(req.body, sig) : null;
    if (event && event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await Payment.update({ status: 'completed', paymentDate: new Date() }, { where: { paymentIntentId: paymentIntent.id } });
      const payment = await Payment.findOne({ where: { paymentIntentId: paymentIntent.id }, include: [{ model: Order }] });
      if (payment && payment.Order) {
        payment.Order.status = ORDER_STATUS.CONFIRMED;
        await payment.Order.save();
      }
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// Initialize Paystack transaction and return authorization_url
exports.initPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return next(new ApiError('orderId is required', 400));
    const order = await Order.findByPk(orderId, { include: [{ model: Customer }] });
    if (!order) return next(new ApiError('Order not found', 404));
    // amount in kobo/ngn minor unit. Assuming order.totalAmount is in Naira
    const amountKobo = Math.round(order.totalAmount * 100);
    const email = order.Customer.email;
    const metadata = { orderId: order.id };
    const data = await require('../services/paystackService').initializeTransaction(amountKobo, email, metadata);
    // Create a payment record (pending)
    const payment = await Payment.create({
      orderId: order.id,
      amount: order.totalAmount,
      method: 'card',
      status: 'pending',
      transactionId: data.reference,
      paymentDate: new Date()
    });
    res.status(200).json({ success: true, data: { authorization_url: data.authorization_url, reference: data.reference } });
  } catch (error) {
    next(error);
  }
};