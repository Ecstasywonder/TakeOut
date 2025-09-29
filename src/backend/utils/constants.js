// Order status constants
exports.ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};
// User roles
exports.USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
  DELIVERY: 'delivery',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};
// Payment methods
exports.PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  CASH: 'cash',
  WALLET: 'wallet'
};
// Payment status
exports.PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};
// Notification types
exports.NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  NEW_ORDER: 'new_order',
  ORDER_ASSIGNED: 'order_assigned',
  PAYMENT: 'payment',
  DELIVERY_UPDATE: 'delivery_update'
};