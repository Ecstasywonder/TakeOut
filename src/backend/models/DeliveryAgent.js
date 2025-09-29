const {
  DataTypes
} = require('sequelize');
const {
  sequelize
} = require('../config/db');
const bcrypt = require('bcryptjs');
const DeliveryAgent = sequelize.define('DeliveryAgent', {
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
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  currentLocation: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalDeliveries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate: async agent => {
      if (agent.password) {
        const salt = await bcrypt.genSalt(10);
        agent.password = await bcrypt.hash(agent.password, salt);
      }
    },
    beforeUpdate: async agent => {
      if (agent.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        agent.password = await bcrypt.hash(agent.password, salt);
      }
    }
  }
});
DeliveryAgent.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = DeliveryAgent;