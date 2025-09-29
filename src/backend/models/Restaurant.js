const {
  DataTypes
} = require('sequelize');
const {
  sequelize
} = require('../config/db');
const bcrypt = require('bcryptjs');
const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  openingTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  closingTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estimatedDeliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Delivery time in minutes'
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async restaurant => {
      if (restaurant.password) {
        const salt = await bcrypt.genSalt(10);
        restaurant.password = await bcrypt.hash(restaurant.password, salt);
      }
    },
    beforeUpdate: async restaurant => {
      if (restaurant.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        restaurant.password = await bcrypt.hash(restaurant.password, salt);
      }
    }
  }
});
Restaurant.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = Restaurant;