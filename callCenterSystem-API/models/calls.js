'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const CALL_STATUSES = ['pending', 'completed', 'cancelled'];

  class Calls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Calls.belongsTo(models.employees, {
        foreignKey: 'employeeId'
      });
      Calls.hasMany(models.call_queues, {
        foreignKey: 'call_id'
      });
    }
  }
  Calls.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    caller_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    caller_phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    rank_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [CALL_STATUSES]
      }
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    employeeId: {
      type: DataTypes.UUID,
      field: 'employee_id'
    }
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Calls',
    tableName: 'calls',
  });
  return Calls;
};
