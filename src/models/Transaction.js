const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  uetr: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PROCESSING', 'ACCEPTED', 'SETTLED', 'REJECTED', 'FAILED'),
    defaultValue: 'PENDING'
  },
  amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  debtorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  debtorIban: {
    type: DataTypes.STRING,
    allowNull: false
  },
  debtorBic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creditorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creditorIban: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creditorBic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  xmlMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
