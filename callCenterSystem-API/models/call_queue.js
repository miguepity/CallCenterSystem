'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class call_queue extends Model {
    static associate(models) {
      call_queue.belongsTo(models.Calls, {
        foreignKey: 'callId',
        as: 'call'
      });
    }
  }
  call_queue.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    callId: {
    type: DataTypes.INTEGER,
    field: 'callId'
    },
    priority: DataTypes.INTEGER,
    joined_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'call_queue',
    tableName: 'call_queue',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return call_queue;
};