'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call_queues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      call_queues.belongsTo(models.Calls, {
      });
    }
  }
  call_queues.init({
    id:{
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:true
    },
    call_id: DataTypes.UUID,
    priority: DataTypes.INTEGER,
    joined_at: DataTypes.DATE

  },
    {

      sequelize,
      modelName: 'call_queues',
      underscored: true,

    });
  return call_queues;
};
