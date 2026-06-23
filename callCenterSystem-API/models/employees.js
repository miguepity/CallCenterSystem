'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    static associate(models) {
      employees.hasMany(models.Calls,);
    }
  }
  employees.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING(100),
    is_available: DataTypes.BOOLEAN,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rank: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'employees',
    underscored: true,
  });
  return employees;
};