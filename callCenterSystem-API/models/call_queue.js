'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call_queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employees.init({
    name: DataTypes.STRING,
    is_available: DataTypes.BOOLEAN,
    rank: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'employees',
    underscored: true,
  });
  return employees;
};