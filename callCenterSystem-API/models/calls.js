'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * 
     */
    static associate(models) {
      // define association here
      Calls.belongsTo(models.employees, {
      });
      Calls.hasMany(models.call_queue, {
      });
    }
  }
  Calls.init({
    caller_name: DataTypes.STRING,
    caller_phone: DataTypes.STRING,
    rank_required: DataTypes.STRING,
    status: DataTypes.STRING,
    started_at: DataTypes.DATE,
    finished_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Calls',
  });
  return Calls;
};