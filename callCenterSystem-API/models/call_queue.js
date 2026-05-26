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
  call_queue.init({

    id: DataTypes.UUID,
    call_id: DataTypes.UUID,
    priority: DataTypes.INTEGER,
    joined_at: DataTypes.DATE
    
  }, 
  {

    sequelize,
    modelName: 'call_queue',
    underscored: true,

  });
  return call_queue;
};