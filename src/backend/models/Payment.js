const {
  DataTypes
} = require('sequelize');
const {
  sequelize
} = require('../config/db');
const Order = require('./Order');
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'cash', 'wallet'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  refundDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orderId: {
    type: DataTypes.UUID,
    references: {
      model: Order,
      key: 'id'
    },
    allowNull: false
  }
});
// Define associations
Payment.belongsTo(Order, {
  foreignKey: 'orderId'
});
Order.hasOne(Payment, {
  foreignKey: 'orderId'
});
module.exports = Payment;