const {
  DataTypes
} = require('sequelize');
const {
  sequelize
} = require('../config/db');
const Order = require('./Order');
const MenuItem = require('./MenuItem');
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notes: {
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
  },
  menuItemId: {
    type: DataTypes.UUID,
    references: {
      model: MenuItem,
      key: 'id'
    },
    allowNull: false
  }
});
// Define associations
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});
Order.hasMany(OrderItem, {
  foreignKey: 'orderId'
});
OrderItem.belongsTo(MenuItem, {
  foreignKey: 'menuItemId'
});
MenuItem.hasMany(OrderItem, {
  foreignKey: 'menuItemId'
});
module.exports = OrderItem;