const {
  DataTypes
} = require('sequelize');
const {
  sequelize
} = require('../config/db');
const Customer = require('./Customer');
const Restaurant = require('./Restaurant');
const DeliveryAgent = require('./DeliveryAgent');
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'in_transit', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  customerRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  customerFeedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customerId: {
    type: DataTypes.UUID,
    references: {
      model: Customer,
      key: 'id'
    },
    allowNull: false
  },
  restaurantId: {
    type: DataTypes.UUID,
    references: {
      model: Restaurant,
      key: 'id'
    },
    allowNull: false
  },
  deliveryAgentId: {
    type: DataTypes.UUID,
    references: {
      model: DeliveryAgent,
      key: 'id'
    },
    allowNull: true
  }
});
// Define associations
Order.belongsTo(Customer, {
  foreignKey: 'customerId'
});
Customer.hasMany(Order, {
  foreignKey: 'customerId'
});
Order.belongsTo(Restaurant, {
  foreignKey: 'restaurantId'
});
Restaurant.hasMany(Order, {
  foreignKey: 'restaurantId'
});
Order.belongsTo(DeliveryAgent, {
  foreignKey: 'deliveryAgentId'
});
DeliveryAgent.hasMany(Order, {
  foreignKey: 'deliveryAgentId'
});
module.exports = Order;