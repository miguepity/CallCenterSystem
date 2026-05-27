'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employees.hasMany(models.Calls,);
    }
  }
  employees.init({
    id:{

      allowNull:false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,

    },
    name: DataTypes.STRING(100),
    is_available: DataTypes.BOOLEAN,
    rank: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'employees',
    underscored: true,
  });
  return employees;
};
