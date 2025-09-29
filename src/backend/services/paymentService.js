const stripe = require('stripe')(require('../config/env').STRIPE_SECRET_KEY);
const {
  ApiError
} = require('../utils/errors');
const logger = require('../utils/logger');
// Process card payment
exports.processCardPayment = async (token, amount, orderNumber, customerEmail) => {
  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      // Convert to cents
      currency: 'usd',
      payment_method: token,
      confirmation_method: 'manual',
      confirm: true,
      description: `Order payment: ${orderNumber}`,
      receipt_email: customerEmail
    });
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        status: 'completed'
      };
    } else if (paymentIntent.status === 'requires_action') {
      return {
        success: true,
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        status: 'pending',
        clientSecret: paymentIntent.client_secret
      };
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }
  } catch (error) {
    logger.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
// Process refund
exports.processRefund = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100) // Convert to cents
    });
    return {
      success: true,
      refundId: refund.id,
      status: refund.status
    };
  } catch (error) {
    logger.error('Refund processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
// Construct webhook event
exports.constructWebhookEvent = (payload, signature) => {
  try {
    const webhookSecret = require('../config/env').STRIPE_WEBHOOK_SECRET;
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    throw new ApiError(`Webhook Error: ${error.message}`, 400);
  }
};
// Generate payment receipt
exports.generatePaymentReceipt = async (payment, order) => {
  // Implementation would depend on your receipt generation library
  // This is a placeholder for the actual implementation
  return {
    receiptNumber: `REC-${Date.now().toString().slice(-8)}`,
    paymentId: payment.id,
    orderId: order.id,
    amount: payment.amount,
    method: payment.method,
    date: payment.paymentDate,
    items: order.OrderItems.map(item => ({
      name: item.MenuItem.name,
      quantity: item.quantity,
      price: item.price
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    deliveryFee: order.deliveryFee,
    total: order.totalAmount
  };
};